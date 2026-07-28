import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ProgressNavigation.module.css';

export const ProgressNavigation: React.FC = () => {
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateSections = () => {
      const sectionElements = Array.from(document.querySelectorAll('section'));
      setSections(sectionElements as HTMLElement[]);
    };

    updateSections();
    const timer = setTimeout(updateSections, 500);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      const sectionElements = Array.from(document.querySelectorAll('section'));
      if (sectionElements.length !== sections.length) {
         setSections(sectionElements as HTMLElement[]);
      }

      let currentIndex = 0;
      
      // If at bottom of page, highlight last
      if (scrollY + windowHeight >= docHeight - 50) {
        setActiveIndex(sectionElements.length - 1);
        return;
      }

      sectionElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight / 2) {
          currentIndex = index;
        }
      });
      setActiveIndex(currentIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [sections.length]);

  return (
    <div className={styles.container}>
      {sections.map((_, index) => {
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
