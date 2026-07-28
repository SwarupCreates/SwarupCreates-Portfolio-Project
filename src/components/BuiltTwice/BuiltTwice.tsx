import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView, useMotionValueEvent } from 'framer-motion';
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
import { useAnimationConfig } from '../../context/AnimationContext';
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

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20); // 20ms per character
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export const BuiltTwice: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  const { config, isScrubbing, globalProgress, replayKey } = useAnimationConfig();
  
  const mapScale = (val: number) => 1 + (val / 100);

  const interpolate = (element: keyof typeof config, prop: 'x' | 'y' | 'rotate' | 'scale') => {
    const start = config[element].initial[prop];
    const end = config[element].final[prop];
    return start + (end - start) * (globalProgress / 100);
  };

  const getActiveState = (element: keyof typeof config, isActive: boolean) => {
    if (isScrubbing) {
      return {
        x: interpolate(element, 'x'),
        y: interpolate(element, 'y'),
        rotate: interpolate(element, 'rotate'),
        scale: interpolate(element, 'scale'),
        speed: config[element].final.speed
      };
    }
    return isActive ? config[element].final : config[element].initial;
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Text Reveal Mask (0 to 100%) mapped from 0.1 to 0.4 of scroll
  const textRevealProgress = useTransform(scrollYProgress, [0.1, 0.4], [0, 100]);
  
  // Plane & Path scroll progress mapped from 0.0 to 0.8 of scroll
  const planeScrollProgress = useTransform(scrollYProgress, [0.0, 0.8], [0, 1]);
  const pathLengthScroll = useTransform(scrollYProgress, [0.0, 0.8], [0, 0.96]);
  
  // Twice sticker pops in when text is fully revealed
  const twiceScale = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const twiceScaleSpring = useSpring(twiceScale, { stiffness: 300, damping: 20 });
  
  // Hover states for the text area to expand cards
  const [isHoveringText, setIsHoveringText] = useState(false);

  // Avatar Slideshow
  const [activeIndex, setActiveIndex] = useState(0);

  const avatarsRef = useRef<HTMLDivElement>(null);
  
  const [scrollPhase, setScrollPhase] = useState<'hidden' | 'avatars_in' | 'slideshow'>('hidden');

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.15) {
      if (scrollPhase !== 'hidden') setScrollPhase('hidden');
    } else if (latest >= 0.15 && latest < 0.8) {
      if (scrollPhase !== 'avatars_in') setScrollPhase('avatars_in');
    } else if (latest >= 0.8) {
      if (scrollPhase !== 'slideshow') setScrollPhase('slideshow');
    }
  });

  const isHidden = scrollPhase === 'hidden';
  const isAvatarsIn = scrollPhase === 'avatars_in';
  const isSlideshow = scrollPhase === 'slideshow';

  useEffect(() => {
    if (!isSlideshow) {
      setActiveIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [isSlideshow]);

  const handleAvatarClick = (index: number) => {
    if (isSlideshow) {
      setActiveIndex(index);
    }
  };

  // Reversed paths: they start from right side and end at left side
  const desktopPathD = "M 1690.5 197.44 C 1344 110.94 1269.18 338.429 928.5 349.94 C 697.55 357.744 603.492 216.784 609 105.94 C 616.128 -37.4935 809 -37.5597 776 128.441 C 742.155 298.689 284.038 534.154 1 176.367";
  const mobilePathD = "M 426 140.4 C 418.992 111.47 368.332 14.9488 259.804 2.32473 C 124.145 -13.4553 223.276 114.878 208.244 220.177 C 194.227 318.364 66.5772 282.42 1 207.465";

  const viewBox = isMobile ? "0 0 427 281" : "0 0 1692 365";
  const currentPath = isMobile ? mobilePathD : desktopPathD;

  const pathRef = useRef<SVGPathElement>(null!);
  const planeInView = useInView(containerRef, { once: false, margin: "100px 0px 0px 0px" });

  const flightPathState = getActiveState('flightPath', planeInView);
  const planeState = getActiveState('plane', planeInView);
  const thoughtState = getActiveState('thoughtCard', isHoveringText);
  const codeState = getActiveState('codeCard', isHoveringText);
  const twiceState = getActiveState('twiceCard', isHoveringText);

  return (
    <section className={styles.container} ref={containerRef} key={replayKey}>
      <div className={styles.stickySection}>
        
        {/* Background Path & Plane */}
        <div 
          className={styles.pathContainer}
          style={{ 
            transform: `translate(calc(-46% + ${flightPathState.x}px), calc(-50% + ${flightPathState.y}px)) scale(${1 * mapScale(flightPathState.scale)}) rotate(${flightPathState.rotate}deg)`,
            width: isMobile ? '26.6875rem' : '105.75rem',
            height: isMobile ? '17.5625rem' : '22.8125rem',
            transition: isScrubbing ? 'none' : 'transform 1s ease'
          }}
        >
          {/* Procedural Path Line */}
          <svg width={isMobile ? 427 : 1692} height={isMobile ? 281 : 365} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <mask id="trail-mask">
                <motion.path
                  d={currentPath}
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  style={{ pathLength: isScrubbing ? (globalProgress / 100) * 0.96 : pathLengthScroll }}
                />
              </mask>
            </defs>
            <path
              ref={pathRef}
              d={currentPath}
              stroke="var(--text-primary)"
              strokeOpacity="0.48"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 8"
              mask="url(#trail-mask)"
            />
          </svg>
          
          <PaperPlaneAnimation 
            pathRef={pathRef} 
            progressOverride={isScrubbing ? globalProgress / 100 : planeScrollProgress}
          >
            <FlyingPlane style={{ 
              width: '100%', 
              height: '100%', 
              transform: `translateY(-5px) translate(${planeState.x}px, ${planeState.y}px) scale(${mapScale(planeState.scale)}) rotate(${planeState.rotate}deg)`
            }} />
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
                gap: isMobile ? '0.5rem' : '1rem',
              }}
            >
              <span>Great</span>
              <span>products</span>
              <span>are</span>
              <span>built</span>
            </motion.div>
            
            <motion.div 
              className={styles.twiceContainer}
              style={{ scale: twiceScaleSpring }}
            >
              {/* Thought Card - Back */}
              <motion.div 
                className={`${styles.hoverCard} ${styles.thoughtCard}`}
                initial={false}
                animate={{ 
                  x: thoughtState.x, 
                  y: thoughtState.y,
                  rotate: thoughtState.rotate,
                  scale: mapScale(thoughtState.scale)
                }}
                transition={isScrubbing ? { duration: 0 } : { type: "spring", stiffness: thoughtState.speed * 6, damping: 20 }}
              >
                <ThoughtTextCard style={{ width: '100%', height: '100%' }} />
              </motion.div>
              
              {/* Code Card - Middle */}
              <motion.div 
                className={`${styles.hoverCard} ${styles.codeCard}`}
                initial={false}
                animate={{ 
                  x: codeState.x, 
                  y: codeState.y,
                  rotate: codeState.rotate,
                  scale: mapScale(codeState.scale)
                }}
                transition={isScrubbing ? { duration: 0 } : { type: "spring", stiffness: codeState.speed * 6, damping: 20 }}
              >
                <CodeTextCard style={{ width: '100%', height: '100%' }} />
              </motion.div>

              {/* Twice Card - Front */}
              <div className={styles.twiceSticker}>
                <motion.div
                  initial={false}
                  animate={{
                    x: twiceState.x,
                    y: twiceState.y,
                    rotate: twiceState.rotate,
                    scale: mapScale(twiceState.scale)
                  }}
                  transition={isScrubbing ? { duration: 0 } : { type: "spring", stiffness: twiceState.speed * 6, damping: 20 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <TwiceTextCard style={{ width: '100%', height: '100%' }} />
                </motion.div>
              </div>
            </motion.div>
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
          ref={avatarsRef}
        >
          <div className={styles.sharedBubbleContainer}>
            <AnimatePresence>
              {isSlideshow && (
                <motion.div 
                  className={styles.sharedBubble}
                  initial={{ opacity: 0, scale: 0, y: 30, transformOrigin: 'bottom center' }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 30 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TypewriterText text={avatarData[activeIndex].text} />
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
                      opacity: (isSlideshow && activeIndex === index) ? 1 : 0, 
                      scale: (isSlideshow && activeIndex === index) ? 1 : 0.8,
                      rotate: 45
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.avatarsLayout}>
            {avatarData.map((data, index) => {
              const isSlideshowActive = isSlideshow && index === activeIndex;
              const isActive = isAvatarsIn || isSlideshowActive; 
              const IconComponent = data.Component;
              
              const currentScale = isHidden ? 0 : (isActive ? 1.05 : 0.8);
              const currentOpacity = isHidden ? 0 : (isActive ? 1 : 0.5);
              const currentFilter = isHidden ? 'grayscale(100%) opacity(0%)' : (isActive ? 'grayscale(0%) opacity(100%)' : 'grayscale(100%) opacity(60%)');
              
              return (
                <div 
                  key={data.id} 
                  className={styles.avatarWrapper}
                  onClick={() => handleAvatarClick(index)}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: currentScale,
                      opacity: currentOpacity,
                      filter: currentFilter
                    }}
                    transition={{ 
                      scale: { duration: 0.6, delay: isHidden ? 0 : index * 0.15, type: "spring", bounce: 0.5 },
                      opacity: { duration: 0.4, delay: isHidden ? 0 : index * 0.15 }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transformOrigin: 'center center' }}
                  >
                    <div className={styles.avatarSvg}>
                      <IconComponent className={isActive ? 'active-avatar' : ''} style={{ width: 'auto', height: isMobile ? '6.25rem' : '12.5rem' }} />
                    </div>
                    <h3 className={styles.avatarTitle}>
                      {data.id.charAt(0).toUpperCase() + data.id.slice(1)}
                    </h3>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
