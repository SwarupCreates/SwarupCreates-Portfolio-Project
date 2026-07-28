import React, { useState } from 'react';
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
  const [hasFinePointer, setHasFinePointer] = useState(true);

  React.useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);

    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setHasFinePointer(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  // Crossfade between 65% and 75% of the viewport height using global scrollY
  const oldHeaderOpacity = useTransform(scrollY, [vh * 0.65, vh * 0.75], [1, 0]);
  const newHeaderOpacity = useTransform(scrollY, [vh * 0.75, vh * 0.85], [0, 1]);
  const newHeaderY = useTransform(scrollY, [vh * 0.75, vh * 0.85], [15, 0]);

  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [typeIdx, setTypeIdx] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);

  React.useEffect(() => {
    let i = 0;
    const fullLength = "Hello, I'm Swarup".length;
    const typeNext = () => {
      setTypeIdx(i);
      i++;
      if (i <= fullLength) {
        setTimeout(typeNext, 60 + Math.random() * 40);
      } else {
        setTimeout(() => setShowSubtitle(true), 400);
      }
    };
    setTimeout(typeNext, 800);
  }, []);

  const fullText = "Hello, I'm Swarup";
  const currentText = fullText.slice(0, typeIdx);
  const part1 = currentText.length > 11 ? "Hello, I'm " : currentText;
  const part2 = currentText.length > 11 ? currentText.slice(11) : "";
  const isTyping = typeIdx <= fullText.length;

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 4); 
    mouseY.set(e.clientY - 12);
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
          lerpSpeed={0.015}
          color="#005ec9"
          autoAnimate={!hasFinePointer}
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

        {/* Main Content Area */}
        <main className={styles.main}>
          <div className={styles.content}>
            <h1 className={styles.headline}>
              {part1}
              <motion.span 
                className={styles.highlight}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
                style={{ cursor: 'pointer', display: 'inline-block', pointerEvents: 'auto' }}
                animate={{ fontWeight: isHovered ? 700 : 400 }}
                transition={{ duration: 0.2 }}
              >
                {part2}
              </motion.span>
              <motion.span
                style={{ display: showSubtitle ? 'none' : 'inline-block', width: '4px', height: '1em', backgroundColor: 'var(--text-primary)', marginLeft: '4px', verticalAlign: 'baseline', position: 'relative', top: '2px' }}
                animate={{ opacity: isTyping ? [1, 0] : 0 }}
                transition={{ repeat: isTyping ? Infinity : 0, duration: 0.8, ease: "linear" }}
              />
            </h1>
            
            <motion.div 
              className={styles.subtitle}
              initial="hidden"
              animate={showSubtitle ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.4 }
                }
              }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } } }}>
                Engineering scalable platforms.
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } } }}>
                Designing meaningful experiences.
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        <motion.div 
          className={styles.buttonGroup}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.6 }
            }
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } } }}>
            <Button 
              icon="download" 
              style={{ borderRadius: '2rem 0.75rem 0.75rem 2rem', width: 'fit-content', whiteSpace: 'nowrap' }}
              href="https://drive.google.com/file/d/1SPhjffmYk2aQo3qGoZHaO3hZQZHmsXJ6/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </Button>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } } }}>
            <Button 
              variant="secondary" 
              icon="mail" 
              style={{ borderRadius: '0.75rem 2rem 2rem 0.75rem', width: 'fit-content', whiteSpace: 'nowrap' }}
              href="mailto:srpcreates@gmail.com"
            >
              Get in touch with me
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <ScrollIndicator />
        </motion.div>
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
            src={`${import.meta.env.BASE_URL}myPhoto.jpg?v=1`} 
            alt="Swarup" 
            className={styles.photoTooltip}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
