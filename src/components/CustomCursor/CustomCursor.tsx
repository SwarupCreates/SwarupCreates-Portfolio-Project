import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { customCursorIcon as CursorIcon } from '../../assets/icons/customCursorIcon';
import { customPointerIcon as PointerIcon } from '../../assets/icons/customPointerIcon';
import { customTextIcon as TextIcon } from '../../assets/icons/customTextIcon';
import styles from './CustomCursor.module.css';

// ==========================================
// ADJUST THESE VALUES TO CONTROL CURSOR SIZE
// ==========================================
const ARROW_SIZE = 24;
const HAND_SIZE = 26;

export const CustomCursor: React.FC = () => {
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      let currentElement: HTMLElement | null = target;
      let newType: 'default' | 'pointer' | 'text' = 'default';
      
      while (currentElement) {
        const style = window.getComputedStyle(currentElement);
        const tagName = currentElement.tagName.toLowerCase();

        if (style.cursor === 'pointer' || tagName === 'a' || tagName === 'button') {
          newType = 'pointer';
          break;
        }

        const isTextInput = tagName === 'textarea' || 
          (tagName === 'input' && ['text', 'email', 'password', 'number', 'search', 'tel', 'url'].includes((currentElement as HTMLInputElement).type));
          
        if (style.cursor === 'text' || isTextInput) {
          newType = 'text';
          break;
        }

        currentElement = currentElement.parentElement;
      }
      setCursorType(newType);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initial check to show cursor if already inside window
    setIsVisible(true);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  const scaleSpring = { type: "spring", damping: 15, stiffness: 300 } as const;

  return (
    <motion.div
      className={styles.cursorWrapper}
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Aggressively hide native cursor globally */}
      <style>{`
        *, *::before, *::after, html, body {
          cursor: none !important;
        }
      `}</style>

      <motion.div
        initial={false}
        animate={{ scale: cursorType === 'default' ? 1 : 0 }}
        transition={scaleSpring}
        className={styles.iconContainer}
        style={{ originX: 0, originY: 0, width: ARROW_SIZE, height: ARROW_SIZE }}
      >
        <CursorIcon width="100%" height="100%" style={{ width: '100%', height: '100%' }} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: cursorType === 'pointer' ? 1 : 0 }}
        transition={scaleSpring}
        className={styles.iconContainer}
        style={{ originX: 0.2, originY: 0.1, width: HAND_SIZE, height: HAND_SIZE }}
      >
        <PointerIcon width="100%" height="100%" style={{ width: '100%', height: '100%' }} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: cursorType === 'text' ? 1 : 0 }}
        transition={scaleSpring}
        className={styles.iconContainer}
        style={{ 
          originX: 0.5, 
          originY: 0.5, 
          width: HAND_SIZE, 
          height: HAND_SIZE,
          left: -(HAND_SIZE / 2),
          top: -(HAND_SIZE / 2)
        }}
      >
        <TextIcon width="100%" height="100%" style={{ width: '100%', height: '100%' }} />
      </motion.div>
    </motion.div>
  );
};
