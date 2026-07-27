import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import styles from './ProgressNavigation.module.css';

export const ProgressNavigation: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.3) setActiveIndex(0);
    else setActiveIndex(1);
  });

  return (
    <div className={styles.container}>
      {[0, 1].map((index) => {
        const isActive = index === activeIndex;
        return (
          <motion.div
            key={index}
            className={styles.line}
            animate={{
              width: isActive ? 20 : 12,
              height: isActive ? 4 : 2,
              backgroundColor: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              opacity: isActive ? 1 : 0.4
            }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          />
        );
      })}
    </div>
  );
};
