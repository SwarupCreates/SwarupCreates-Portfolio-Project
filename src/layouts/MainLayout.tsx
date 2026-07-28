import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavBar } from '../components/TopNavBar/TopNavBar';
import { useAssistiveScroll } from '../hooks/useAssistiveScroll';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
  useAssistiveScroll();
  
  return (
    <div className={styles.layout}>
      <TopNavBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
