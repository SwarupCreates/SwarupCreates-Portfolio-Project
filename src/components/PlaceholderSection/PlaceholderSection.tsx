import React from 'react';
import { motion } from 'framer-motion';
import { AwkwardAvatar } from '../../assets/icons';
import styles from './PlaceholderSection.module.css';

export const PlaceholderSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      >
        <AwkwardAvatar style={{ width: '8rem', height: 'auto', marginBottom: '2rem' }} />
        <h2 className={styles.heading}>Construction in progress</h2>
        <p className={styles.subtext}>Come back later.</p>
      </motion.div>
    </section>
  );
};
