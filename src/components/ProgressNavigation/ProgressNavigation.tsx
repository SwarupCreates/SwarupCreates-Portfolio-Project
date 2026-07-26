import React from 'react';
import styles from './ProgressNavigation.module.css';

export const ProgressNavigation: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.line} ${styles.active}`} />
      <div className={styles.line} />
      <div className={styles.line} />
      <div className={styles.line} />
    </div>
  );
};
