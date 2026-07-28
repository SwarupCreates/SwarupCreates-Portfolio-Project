import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './ThemeToggle.module.css';
import { LanternComponent } from '../../assets/icons';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const playClickSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Subtle tick sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      // Ignore if AudioContext is not supported
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newDark = !prev;
      if (newDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
      return newDark;
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPulling(true);
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isPulling) {
      setIsPulling(false);
      playClickSound();
      toggleTheme();
    }
  };

  const handlePointerLeave = () => {
    if (isPulling) {
      setIsPulling(false);
    }
  };

  return (
    <motion.button 
      className={styles.themeToggle} 
      initial={{ x: '-16rem' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      role="button"
      tabIndex={0}
      aria-label="Toggle theme"
      onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          playClickSound();
          toggleTheme();
        }
      }}
    >
      <LanternComponent 
        isDark={isDark} 
        isPulling={isPulling} 
        style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      />
    </motion.button>
  );
};
