import React, { useEffect, useRef, useState } from 'react';
import { MotionValue, AnimatePresence, motion } from 'framer-motion';
import styles from './PaperPlaneAnimation.module.css';

interface PaperPlaneAnimationProps {
  pathRef: React.RefObject<SVGPathElement>;
  duration?: number;
  autoPlay?: boolean;
  children: React.ReactNode;
  width?: string;
  height?: string;
  progressOverride?: number | MotionValue<number>; // 0 to 1
}

export const PaperPlaneAnimation: React.FC<PaperPlaneAnimationProps> = ({
  pathRef,
  duration = 4000,
  autoPlay = false,
  children,
  width = '86px',
  height = '60px',
  progressOverride
}) => {
  const planeRef = useRef<HTMLDivElement>(null);
  const unrotatedRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);
  const isLandedRef = useRef(false);
  const [isLanded, setIsLanded] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const [showConnect, setShowConnect] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showConnect &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        planeRef.current &&
        !planeRef.current.contains(event.target as Node)
      ) {
        setShowConnect(false);
        setIsJiggling(true);
        setTimeout(() => setIsJiggling(false), 2000);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showConnect]);

  const setPlanePosition = (progress: number) => {
    if (pathRef.current && planeRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      
      // Safety check just in case path is not fully rendered/measured yet
      if (pathLength > 0) {
        // Stop a bit earlier than the very end of the path (e.g. 96%)
        const maxPathLength = pathLength * 0.96;
        const currentLength = progress * maxPathLength;

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

        planeRef.current.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) rotate(${angle}deg) scaleY(-1)`;
        if (unrotatedRef.current) {
          unrotatedRef.current.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
        }

        const isCurrentlyLanded = progress >= 0.999;
        if (isCurrentlyLanded !== isLandedRef.current) {
          isLandedRef.current = isCurrentlyLanded;
          setIsLanded(isCurrentlyLanded);
          if (!isCurrentlyLanded) {
            setShowConnect(false);
            setIsJiggling(false);
          }
        }
      }
    }
  };

  const animate = (time: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = time;
    }

    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    
    setPlanePosition(progress);

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
        
        // SVG is intrinsically drawn facing left, so we rotate by 180 degrees
        angle += 180;

        planeRef.current.style.transform = `translate(${startPoint.x}px, ${startPoint.y}px) translate(-50%, -50%) rotate(${angle}deg) scaleY(-1)`;
        if (unrotatedRef.current) {
          unrotatedRef.current.style.transform = `translate(${startPoint.x}px, ${startPoint.y}px) translate(-50%, -50%)`;
        }
      }
    }
  };

  // Setup / Reset logic
  useEffect(() => {
    // If we have an override, we don't autoPlay. We just set position.
    if (progressOverride !== undefined) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      
      if (typeof progressOverride === 'number') {
        // Let SVG render first before sampling path
        setTimeout(() => {
          setPlanePosition(progressOverride);
        }, 0);
        return;
      } else {
        // It's a MotionValue
        const unsubscribe = progressOverride.on("change", (latest) => {
          setPlanePosition(latest);
        });
        setTimeout(() => {
          setPlanePosition(progressOverride.get());
        }, 0);
        return () => unsubscribe();
      }
    }

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
  }, [autoPlay, duration, progressOverride]); // Re-run when these toggle

  const handlePlaneClick = () => {
    if (!isLanded) return;
    if (showConnect) {
      setShowConnect(false);
      setIsJiggling(true);
      setTimeout(() => setIsJiggling(false), 2000);
      return;
    }
    setIsJiggling(true);
    setShowConnect(true);
    setTimeout(() => setIsJiggling(false), 2000);
  };

  return (
    <>
      <div 
        ref={planeRef} 
        className={`${styles.planeWrapper} ${isLanded ? styles.landed : ''}`}
        style={{ width, height }}
        onClick={handlePlaneClick}
      >
        <div className={isJiggling ? styles.jiggling : ''} style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      </div>

      <div ref={unrotatedRef} className={styles.unrotatedWrapper}>
        <AnimatePresence>
          {showConnect && (
            <motion.div 
              ref={tooltipRef}
              className={styles.connectTooltip}
              initial={{ scale: 0, opacity: 0, y: -30, x: "-50%" }}
              animate={{ scale: 1, opacity: 1, y: 0, x: "-50%" }}
              exit={{ scale: 0, opacity: 0, y: -30, x: "-50%" }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
              style={{ originX: 0.5, originY: 0 }}
            >
              <span className={styles.connectText}>Wanna connect?</span>
              <a href="mailto:srpcreates@gmail.com" className={styles.connectBtn}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>forward_to_inbox</span>
                Drop an email
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
