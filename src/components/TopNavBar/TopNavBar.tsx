import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ProgressNavigation } from '../ProgressNavigation/ProgressNavigation';
import { SwarupCreatesLogo } from '../../assets/icons/SwarupCreatesLogo';
import styles from './TopNavBar.module.css';

export const TopNavBar: React.FC = () => {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(1000);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const topGradOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const oldHeaderOpacity = useTransform(scrollY, [vh * 0.65, vh * 0.75], [1, 0]);
  const newHeaderOpacity = useTransform(scrollY, [vh * 0.75, vh * 0.85], [0, 1]);
  const newHeaderY = useTransform(scrollY, [vh * 0.75, vh * 0.85], [15, 0]);

  return (
    <header className={styles.header}>
      <motion.div className={styles.headerGradient} style={{ opacity: topGradOpacity }} />
      
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '3rem' }}>
        <motion.span 
          className={styles.tagline}
          style={{ 
            opacity: oldHeaderOpacity,
            position: 'absolute',
            left: 0,
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          Building with purpose.
        </motion.span>

        <motion.div
          style={{ 
            opacity: newHeaderOpacity, 
            y: newHeaderY,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            position: 'absolute',
            left: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <SwarupCreatesLogo 
            width="42"
            height="42"
            style={{ width: '2.625rem', height: '2.625rem', minWidth: '3rem', flexShrink: 0 }} 
            isContracted={true} 
            color="#005ec9" 
          />
          <span style={{ fontSize: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03125rem', fontFamily: '"Stack Sans Notch", sans-serif' }}>
            Swarup<span style={{ fontWeight: 700 }}>Creates</span>
          </span>
        </motion.div>
      </div>

      <ProgressNavigation />
    </header>
  );
};
