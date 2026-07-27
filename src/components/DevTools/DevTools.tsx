import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationConfig } from '../../context/AnimationContext';
import type { GlobalAnimationConfig, ElementState } from '../../context/AnimationContext';
import styles from './DevTools.module.css';

const ELEMENTS: { label: string, key: keyof GlobalAnimationConfig }[] = [
  { label: 'Flying Plane', key: 'plane' },
  { label: 'Thought Card', key: 'thoughtCard' },
  { label: 'Code Card', key: 'codeCard' },
  { label: 'Twice Card', key: 'twiceCard' },
  { label: 'Flight Path', key: 'flightPath' }
];

export const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<keyof GlobalAnimationConfig>('plane');
  const [selectedState, setSelectedState] = useState<'initial' | 'final'>('initial');

  const { 
    config, 
    updateAnimationConfig, 
    getJsonConfig,
    globalProgress,
    setGlobalProgress,
    isScrubbing,
    setIsScrubbing,
    triggerReplay
  } = useAnimationConfig();

  const handleCopyJson = () => {
    const json = getJsonConfig();
    console.log("Animation Config JSON:", json);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(() => {
        alert('Config copied to clipboard! (also logged to console)');
      }).catch(err => {
        fallbackCopyTextToClipboard(json);
      });
    } else {
      fallbackCopyTextToClipboard(json);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Config copied to clipboard! (also logged to console)');
    } catch (err) {
      alert('Failed to copy. The JSON config has been printed to your browser console!');
    }
    document.body.removeChild(textArea);
  };

  const handleSliderChange = (property: keyof ElementState, value: number) => {
    updateAnimationConfig(selectedElement, selectedState, property, value);
  };

  const currentState = config[selectedElement][selectedState];

  return (
    <>
      <div className={styles.devToolsContainer}>
        <button 
          className={styles.devToolsBtn}
          onClick={() => setIsOpen(true)}
          aria-label="Open Dev Tools"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          Dev Tools
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Dev Controls</h3>
                <button 
                  className={styles.closeBtn} 
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div style={{ paddingBottom: '16px', borderBottom: '1px solid #eee', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                      <input 
                        type="checkbox" 
                        checked={isScrubbing}
                        onChange={(e) => setIsScrubbing(e.target.checked)}
                      />
                      Enable Scrubber
                    </label>
                    <button 
                      onClick={triggerReplay}
                      style={{ background: '#eee', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                    >
                      Replay Sequence
                    </button>
                  </div>
                  {isScrubbing && (
                    <div className={styles.controlRow}>
                      <div className={styles.controlHeader}>
                        <span>Progress (0 to 100)</span>
                        <span className={styles.controlValue}>{globalProgress}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={globalProgress} 
                        onChange={(e) => setGlobalProgress(Number(e.target.value))} 
                      />
                    </div>
                  )}
                </div>

                <select 
                  className={styles.selectInput}
                  value={selectedElement}
                  onChange={(e) => setSelectedElement(e.target.value as keyof GlobalAnimationConfig)}
                >
                  {ELEMENTS.map(el => (
                    <option key={el.key} value={el.key}>{el.label}</option>
                  ))}
                </select>

                <div className={styles.stateToggle}>
                  <button 
                    className={`${styles.stateBtn} ${selectedState === 'initial' ? styles.active : ''}`}
                    onClick={() => setSelectedState('initial')}
                  >
                    Initial
                  </button>
                  <button 
                    className={`${styles.stateBtn} ${selectedState === 'final' ? styles.active : ''}`}
                    onClick={() => setSelectedState('final')}
                  >
                    Final
                  </button>
                </div>

                <div className={styles.controlsWrapper}>
                  {/* X Axis */}
                  <div className={styles.controlRow}>
                    <div className={styles.controlHeader}>
                      <span>X Axis (px)</span>
                      <span className={styles.controlValue}>{currentState.x}</span>
                    </div>
                    <input 
                      type="range" 
                      min="-500" max="500" 
                      value={currentState.x} 
                      onChange={(e) => handleSliderChange('x', Number(e.target.value))} 
                    />
                  </div>

                  {/* Y Axis */}
                  <div className={styles.controlRow}>
                    <div className={styles.controlHeader}>
                      <span>Y Axis (px)</span>
                      <span className={styles.controlValue}>{currentState.y}</span>
                    </div>
                    <input 
                      type="range" 
                      min="-500" max="500" 
                      value={currentState.y} 
                      onChange={(e) => handleSliderChange('y', Number(e.target.value))} 
                    />
                  </div>

                  {/* Rotation */}
                  <div className={styles.controlRow}>
                    <div className={styles.controlHeader}>
                      <span>Rotation (deg)</span>
                      <span className={styles.controlValue}>{currentState.rotate}°</span>
                    </div>
                    <input 
                      type="range" 
                      min="-360" max="360" 
                      value={currentState.rotate} 
                      onChange={(e) => handleSliderChange('rotate', Number(e.target.value))} 
                    />
                  </div>

                  {/* Scale */}
                  <div className={styles.controlRow}>
                    <div className={styles.controlHeader}>
                      <span>Scale (-100 to +100)</span>
                      <span className={styles.controlValue}>{currentState.scale}</span>
                    </div>
                    <input 
                      type="range" 
                      min="-100" max="100" 
                      value={currentState.scale} 
                      onChange={(e) => handleSliderChange('scale', Number(e.target.value))} 
                    />
                  </div>

                  {/* Speed */}
                  <div className={styles.controlRow}>
                    <div className={styles.controlHeader}>
                      <span>Speed (1 to 100)</span>
                      <span className={styles.controlValue}>{currentState.speed}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="100" 
                      value={currentState.speed} 
                      onChange={(e) => handleSliderChange('speed', Number(e.target.value))} 
                    />
                  </div>
                </div>

                <button className={styles.finaliseBtn} onClick={handleCopyJson}>
                  Finalise & Copy JSON
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
