import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Button } from '../Button';
import { ProgressNavigation } from '../ProgressNavigation/ProgressNavigation';
import { ScrollIndicator } from '../ScrollIndicator/ScrollIndicator';
import { SwarupCreatesLogo } from '../../assets/icons/SwarupCreatesLogo';
import Antigravity from '../backgrounds/Antigravity/Antigravity';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const topGradOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const bottomGradOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);

  const [vh, setVh] = useState(1000);
  React.useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Crossfade between 65% and 75% of the viewport height using global scrollY
  const oldHeaderOpacity = useTransform(scrollY, [vh * 0.65, vh * 0.75], [1, 0]);
  const newHeaderOpacity = useTransform(scrollY, [vh * 0.75, vh * 0.85], [0, 1]);
  const newHeaderY = useTransform(scrollY, [vh * 0.75, vh * 0.85], [15, 0]);

  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 4); 
    mouseY.set(e.clientY - 12); // Raised by 8px from cursor
  };

  return (
    <div className={styles.heroWrapper}>
      {/* Animated Background */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <Antigravity
          count={1000}
          magnetRadius={9}
          ringRadius={14}
          waveSpeed={1.4}
          waveAmplitude={1.1}
          particleSize={0.75}
          lerpSpeed={0.05}
          color="#005ec9"
          autoAnimate={false}
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={5.3}
          particleShape="sphere"
          fieldStrength={9.2}
        />
      </div>

      {/* Background Logo */}
      <div className={styles.bgLogoContainer}>
        <div className={styles.radialOverlay}></div>
        <SwarupCreatesLogo className={styles.bgLogo} />
      </div>

      <div className={styles.container}>
        {/* Top Header */}
        <header className={styles.header}>
          <motion.div className={styles.headerGradient} style={{ opacity: topGradOpacity }}>
          </motion.div>
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '48px' }}>
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
                gap: '8px',
                position: 'absolute',
                left: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <SwarupCreatesLogo 
                width="42"
                height="42"
                style={{ width: '42px', height: '42px', minWidth: '48px', flexShrink: 0 }} 
                isContracted={true} 
                color="#005ec9" 
              />
              <span style={{ fontSize: '24px', color: '#1a1a1a', letterSpacing: '-0.5px', fontFamily: '"Stack Sans Notch", sans-serif' }}>
                Swarup<span style={{ fontWeight: 700 }}>Creates</span>
              </span>
            </motion.div>
          </div>

          <ProgressNavigation />
        </header>

        {/* Main Content Area */}
        <main className={styles.main}>
          <motion.div 
            className={styles.content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1 className={styles.headline}>
              Hello, I'm{' '}
              <motion.span 
                className={styles.highlight}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
                style={{ cursor: 'pointer', display: 'inline-block', pointerEvents: 'auto' }}
                animate={{ fontWeight: isHovered ? 700 : 400 }}
                transition={{ duration: 0.2 }}
              >
                Swarup
              </motion.span>
            </h1>
            <p className={styles.subtitle}>
              Engineering scalable platforms.<br />
              Designing meaningful experiences.
            </p>
          </motion.div>
        </main>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        <motion.div 
          className={styles.buttonGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <Button 
            icon="download" 
            style={{ borderRadius: '32px 12px 12px 32px', width: 'fit-content', whiteSpace: 'nowrap' }}
          >
            Download Resume
          </Button>
          <Button 
            variant="secondary" 
            icon="mail" 
            style={{ borderRadius: '12px 32px 32px 12px', width: 'fit-content', whiteSpace: 'nowrap' }}
          >
            Get in touch with me
          </Button>
        </motion.div>

        <ScrollIndicator />
      </div>

      {/* Blur Transition */}
      <motion.div className={styles.blurTransition} style={{ opacity: bottomGradOpacity }}>
      </motion.div>

      {/* Photo Tooltip */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          initial={{ opacity: 0, scale: 0.5, originX: 0, originY: 1 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 300,
            delay: isHovered ? 0.12 : 0 // 120ms entrance delay
          }}
        >
          <motion.div
            className={styles.tooltipText}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.15 }
              }
            }}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          >
            {"Yup, that's me!".split('').map((char, index) => (
              <motion.span 
                key={index} 
                variants={{
                  hidden: { opacity: 0, y: 5 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
          
          <img 
            src="/myPhoto.jpg?v=1" 
            alt="Swarup" 
            className={styles.photoTooltip}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
