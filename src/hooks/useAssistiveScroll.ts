import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export const useAssistiveScroll = () => {
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollYRef = useRef(0);
  const isProgrammaticScroll = useRef(false);
  const scrollAnimationRef = useRef<any>(null);

  useEffect(() => {
    // Cancel animation if user manually scrolls (mouse wheel or touch)
    const handleUserInteraction = () => {
      if (scrollAnimationRef.current) {
        scrollAnimationRef.current.stop();
        scrollAnimationRef.current = null;
        isProgrammaticScroll.current = false;
      }
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Calculate direction
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      // Ignore if we triggered the scroll ourselves
      if (isProgrammaticScroll.current) {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 150);
        return;
      }

      isScrollingRef.current = true;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        
        // Only trigger assistive magnetic effect when scrolling down
        if (!isScrollingDown) return;

        const windowHeight = window.innerHeight;
        const sections = Array.from(document.querySelectorAll('section'));
        
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const rect = section.getBoundingClientRect();
          
          // Calculate the percentage of the section that has entered the viewport.
          // When rect.top === windowHeight (just entered), scrollPercentage = 0
          // When rect.bottom === windowHeight (just finished), scrollPercentage = 1
          const scrollPercentage = (windowHeight - rect.top) / rect.height;
          
          if (scrollPercentage > 0.45 && scrollPercentage < 0.99) {
            // Target the end of this section (align section bottom with viewport bottom)
            const targetScrollY = window.scrollY + rect.bottom - windowHeight;
            
            // Allow a small threshold to avoid sub-pixel jitter loops
            if (Math.abs(window.scrollY - targetScrollY) > 5) {
              isProgrammaticScroll.current = true;
              
              if (scrollAnimationRef.current) {
                scrollAnimationRef.current.stop();
              }

              scrollAnimationRef.current = animate(window.scrollY, targetScrollY, {
                type: "tween",
                ease: "easeInOut",
                duration: 1.2, // Much slower, human-readable speed
                onUpdate: (latest) => window.scrollTo(0, latest),
                onComplete: () => {
                  isProgrammaticScroll.current = false;
                  scrollAnimationRef.current = null;
                }
              });
            }
            break; // Only act on one section
          }
        }
      }, 150); // 150ms debounce - waits for user to stop actively scrolling
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (scrollAnimationRef.current) {
        scrollAnimationRef.current.stop();
      }
    };
  }, []);
};
