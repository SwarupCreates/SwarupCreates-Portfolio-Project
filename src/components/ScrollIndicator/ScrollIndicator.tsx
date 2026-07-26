import React from 'react';
import { motion } from 'framer-motion';
import styles from './ScrollIndicator.module.css';

export const ScrollIndicator: React.FC = () => {
  return (
    <motion.div 
      className={styles.container}
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mouse</span>
      <span className={styles.text}>Scroll Down</span>
    </motion.div>
  );
};
