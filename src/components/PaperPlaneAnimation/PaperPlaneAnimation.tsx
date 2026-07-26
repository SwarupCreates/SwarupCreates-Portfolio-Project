import React, { useEffect, useRef } from 'react';
import styles from './PaperPlaneAnimation.module.css';

interface PaperPlaneAnimationProps {
  pathRef: React.RefObject<SVGPathElement>;
  duration?: number;
  autoPlay?: boolean;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

export const PaperPlaneAnimation: React.FC<PaperPlaneAnimationProps> = ({
  pathRef,
  duration = 4000,
  autoPlay = false,
  children,
  width = '86px',
  height = '60px',
}) => {
  const planeRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);
  const currentAngleRef = useRef<number | null>(null);

  // Cubic ease in out for natural throw effect
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animate = (time: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = time;
    }

    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    if (pathRef.current && planeRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      
      // Safety check just in case path is not fully rendered/measured yet
      if (pathLength > 0) {
        // Stop a bit earlier than the very end of the path (e.g. 96%)
        const maxPathLength = pathLength * 0.96;
        const currentLength = easedProgress * maxPathLength;

        const point = pathRef.current.getPointAtLength(currentLength);
        
        let angle = 0;
        if (currentLength + 1 >= maxPathLength) {
          // If at the end, use the tangent just before the end
          const prevPoint = pathRef.current.getPointAtLength(maxPathLength - 1);
          angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);
        } else {
          const nextPoint = pathRef.current.getPointAtLength(currentLength + 1);
          angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
        }

        // SVG is intrinsically drawn facing left, so we rotate by 180 degrees
        angle += 180;

        // Normalize initial angle to [-180, 180] before smoothing
        while (angle < -180) angle += 360;
        while (angle > 180) angle -= 360;

        // Smoothly interpolate angle to avoid snapping
        if (currentAngleRef.current !== null) {
          let diff = angle - currentAngleRef.current;
          // Normalize difference to [-180, 180] for shortest path interpolation
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          
          // Apply a smoothing factor (e.g. 0.1 for buttery smooth banking)
          angle = currentAngleRef.current + diff * 0.1;
        }
        currentAngleRef.current = angle;

        // Prevent flipping upside down when traveling backwards
        // Note: since we added 180 degrees, the visual orientation is inverted, 
        // so we flip based on the ACTUAL travel angle, which is angle - 180.
        let travelAngle = angle - 180;
        while (travelAngle < -180) travelAngle += 360;
        while (travelAngle > 180) travelAngle -= 360;

        const shouldFlip = Math.abs(travelAngle) > 90;
        const flipScale = shouldFlip ? -1 : 1;

        planeRef.current.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) rotate(${angle}deg) scaleY(${flipScale})`;
      }
    }

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  const resetPosition = () => {
    if (pathRef.current && planeRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      if (pathLength > 0) {
        const startPoint = pathRef.current.getPointAtLength(0);
        const nextPoint = pathRef.current.getPointAtLength(Math.min(1, pathLength));
        let angle = Math.atan2(nextPoint.y - startPoint.y, nextPoint.x - startPoint.x) * (180 / Math.PI);
        
        angle += 180;
        while (angle < -180) angle += 360;
        while (angle > 180) angle -= 360;

        currentAngleRef.current = angle; // Reset smoothing target
        
        let travelAngle = angle - 180;
        while (travelAngle < -180) travelAngle += 360;
        while (travelAngle > 180) travelAngle -= 360;

        const shouldFlip = Math.abs(travelAngle) > 90;
        const flipScale = shouldFlip ? -1 : 1;
        
        planeRef.current.style.transform = `translate(${startPoint.x}px, ${startPoint.y}px) translate(-50%, -50%) rotate(${angle}deg) scaleY(${flipScale})`;
      }
    }
  };

  // Setup / Reset logic
  useEffect(() => {
    // We want to be certain the path has calculated its length before we sample it.
    // Small timeout ensures SVGElements have rendered to DOM.
    const initTimer = setTimeout(() => {
      if (autoPlay) {
        startTimeRef.current = null;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(animate);
      } else {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        resetPosition();
      }
    }, 50);

    return () => {
      clearTimeout(initTimer);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoPlay, duration]); // Re-run when autoPlay toggles

  return (
    <div 
      ref={planeRef} 
      className={styles.planeWrapper}
      style={{ width, height }}
    >
      {children}
    </div>
  );
};
