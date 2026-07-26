import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { PaperPlaneAnimation } from '../PaperPlaneAnimation/PaperPlaneAnimation';
import {
  BuildAvatar,
  CodeTextCard,
  FlyingPlane,
  RefineAvatar,
  ThinkAvatar,
  ThoughtTextCard,
  TwiceTextCard
} from '../../assets/icons';
import styles from './BuiltTwice.module.css';

const avatarData = [
  {
    id: 'think',
    Component: ThinkAvatar,
    text: "Before choosing the technology, I focus on understanding the problem, the people, and the purpose. Every great solution starts with asking the right questions."
  },
  {
    id: 'build',
    Component: BuildAvatar,
    text: "Once the direction is clear, I bring ideas to life with scalable cloud platforms, modern engineering practices, and reliable automation."
  },
  {
    id: 'refine',
    Component: RefineAvatar,
    text: "Finally, I iterate on every detail—improving usability, performance, and visual polish until the experience feels effortless for the people using it."
  }
];

export const BuiltTwice: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [isMobile, setIsMobile] = useState(false);
  const [pathScale, setPathScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      const idealWidth = mobile ? 427 : 1692;
      setPathScale(window.innerWidth / idealWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Text Reveal Mask (0 to 100%) mapped from 0.1 to 0.4 of scroll
  const textRevealProgress = useTransform(scrollYProgress, [0.1, 0.4], [0, 100]);
  
  // Twice sticker pops in when text is fully revealed
  const twiceScale = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const twiceScaleSpring = useSpring(twiceScale, { stiffness: 300, damping: 20 });
  
  // Hover states for the text area to expand cards
  const [isHoveringText, setIsHoveringText] = useState(false);

  // Avatar Slideshow
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [userClicked, setUserClicked] = useState(false);

  const avatarsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(avatarsRef, { once: true, amount: 0.3 });
  const [animationStage, setAnimationStage] = useState<'hidden' | 'entering' | 'done'>('hidden');

  useEffect(() => {
    if (isInView && animationStage === 'hidden') {
      setAnimationStage('entering');
    }
  }, [isInView, animationStage]);

  useEffect(() => {
    if (animationStage === 'entering') {
      const timer = setTimeout(() => {
        setAnimationStage('done');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [animationStage]);

  useEffect(() => {
    if (isHoveringAvatar || userClicked || animationStage !== 'done') return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHoveringAvatar, userClicked, animationStage]);

  const handleAvatarClick = (index: number) => {
    if (animationStage === 'done') {
      setActiveIndex(index);
      setUserClicked(true);
    }
  };

  // Reversed paths: they start from right side and end at left side
  const desktopPathD = "M 1690.5 197.44 C 1344 110.94 1269.18 338.429 928.5 349.94 C 697.55 357.744 603.492 216.784 609 105.94 C 616.128 -37.4935 809 -37.5597 776 128.441 C 742.155 298.689 284.038 534.154 1 176.367";
  const mobilePathD = "M 426 140.4 C 418.992 111.47 368.332 14.9488 259.804 2.32473 C 124.145 -13.4553 223.276 114.878 208.244 220.177 C 194.227 318.364 66.5772 282.42 1 207.465";

  const viewBox = isMobile ? "0 0 427 281" : "0 0 1692 365";
  const currentPath = isMobile ? mobilePathD : desktopPathD;

  const pathRef = useRef<SVGPathElement>(null);
  const planeInView = useInView(containerRef, { once: false, margin: "100px 0px 0px 0px" });

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.stickySection}>
        
        {/* Background Path & Plane */}
        <div 
          className={styles.pathContainer}
          style={{ 
            transform: `translate(-50%, -50%) scale(${pathScale})`,
            width: isMobile ? '427px' : '1692px',
            height: isMobile ? '281px' : '365px'
          }}
        >
          {/* Procedural Path Line */}
          <svg width={isMobile ? 427 : 1692} height={isMobile ? 281 : 365} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              ref={pathRef}
              d={currentPath}
              stroke="#1A1A1A"
              strokeOpacity="0.64"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: planeInView ? 1 : 0 }}
              transition={{ duration: 4, ease: [0.645, 0.045, 0.355, 1.000] }} // Match easeInOutCubic approx
            />
          </svg>
          
          <PaperPlaneAnimation pathRef={pathRef} autoPlay={planeInView} duration={4000}>
            <FlyingPlane style={{ width: '100%', height: '100%' }} />
          </PaperPlaneAnimation>
        </div>

        <div className={styles.heroContent}>
          {/* Hero Text */}
          <motion.div 
            className={styles.headingWrapper}
            onMouseEnter={() => setIsHoveringText(true)}
            onMouseLeave={() => setIsHoveringText(false)}
          >
            <motion.div 
              style={{ 
                clipPath: useTransform(textRevealProgress, p => `inset(0 ${100 - p}% 0 0)`),
                display: 'inline-flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? '8px' : '16px',
              }}
            >
              <span>Great</span>
              <span>products</span>
              <span>are</span>
              <span>built</span>
            </motion.div>
            
            <div className={styles.twiceContainer}>
              {/* Thought Card - Back */}
              <motion.div 
                className={`${styles.hoverCard} ${styles.thoughtCard}`}
                initial={false}
                animate={{ 
                  x: isHoveringText ? 60 : 0, 
                  y: isHoveringText ? -30 : 0,
                  rotate: isHoveringText ? 15 : 0,
                  opacity: twiceScaleSpring.get() > 0.1 ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ThoughtTextCard style={{ width: '100%', height: '100%' }} />
              </motion.div>
              
              {/* Code Card - Middle */}
              <motion.div 
                className={`${styles.hoverCard} ${styles.codeCard}`}
                initial={false}
                animate={{ 
                  x: isHoveringText ? 30 : 0, 
                  y: isHoveringText ? 40 : 0,
                  rotate: isHoveringText ? 10 : 0,
                  opacity: twiceScaleSpring.get() > 0.1 ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CodeTextCard style={{ width: '100%', height: '100%' }} />
              </motion.div>

              {/* Twice Card - Front */}
              <motion.div 
                className={styles.twiceSticker}
                style={{ scale: twiceScaleSpring }}
              >
                <TwiceTextCard style={{ width: '100%', height: '100%' }} />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.subtext}
            style={{ opacity: twiceScaleSpring }}
          >
            First in thought. Then in code.
          </motion.div>
        </div>

        <div 
          className={styles.avatarsSection}
          onMouseEnter={() => setIsHoveringAvatar(true)}
          onMouseLeave={() => setIsHoveringAvatar(false)}
          ref={avatarsRef}
        >
          <div className={styles.sharedBubbleContainer}>
            <AnimatePresence>
              {animationStage === 'done' && (
                <motion.div 
                  className={styles.sharedBubble}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {avatarData[activeIndex].text}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className={styles.notchesLayout}>
              {avatarData.map((data, index) => (
                <div key={`notch-${data.id}`} className={styles.notchWrapper}>
                  <motion.div 
                    className={styles.notch}
                    animate={{ 
                      opacity: (animationStage === 'done' && activeIndex === index) ? 1 : 0, 
                      scale: (animationStage === 'done' && activeIndex === index) ? 1 : 0.8,
                      rotate: 45
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.avatarsLayout}>
            {avatarData.map((data, index) => {
              const isActive = index === activeIndex && animationStage === 'done';
              const IconComponent = data.Component;
              
              const currentHeight = animationStage === 'hidden' ? 0 : (animationStage === 'entering' ? 200 : (isActive ? 240 : 190));
              const currentOpacity = animationStage === 'hidden' ? 0 : (animationStage === 'entering' ? 1 : (isActive ? 1 : 0.5));
              const currentFilter = animationStage === 'done' && !isActive ? 'grayscale(100%) opacity(60%)' : 'grayscale(0%) opacity(100%)';
              
              return (
                <div 
                  key={data.id} 
                  className={styles.avatarWrapper}
                  onClick={() => handleAvatarClick(index)}
                >
                  <motion.div
                    className={styles.avatarSvg}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: currentHeight,
                      opacity: currentOpacity,
                      filter: currentFilter
                    }}
                    transition={{ 
                      height: { duration: 0.4, delay: animationStage === 'entering' ? index * 0.2 : 0, type: "spring", bounce: 0.3 },
                      opacity: { duration: 0.4, delay: animationStage === 'entering' ? index * 0.2 : 0 }
                    }}
                    style={{ width: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}
                  >
                    <IconComponent style={{ width: 'auto', height: '100%' }} />
                  </motion.div>
                  <motion.h3 
                    className={styles.avatarTitle} 
                    animate={{ opacity: currentOpacity }}
                  >
                    {data.id.charAt(0).toUpperCase() + data.id.slice(1)}
                  </motion.h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
