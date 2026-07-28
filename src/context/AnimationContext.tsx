import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type ElementState = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  speed: number;
};

export type AnimationConfig = {
  initial: ElementState;
  final: ElementState;
};

export type GlobalAnimationConfig = {
  plane: AnimationConfig;
  thoughtCard: AnimationConfig;
  codeCard: AnimationConfig;
  twiceCard: AnimationConfig;
  flightPath: AnimationConfig;
};

const initialConfig: GlobalAnimationConfig = {
  "plane": {
    "initial": {
      "x": -33,
      "y": 24,
      "rotate": 0,
      "scale": 15,
      "speed": 50
    },
    "final": {
      "x": -33,
      "y": 24,
      "rotate": 0,
      "scale": 15,
      "speed": 50
    }
  },
  "thoughtCard": {
    "initial": {
      "x": 0,
      "y": -3,
      "rotate": 2,
      "scale": -5,
      "speed": 50
    },
    "final": {
      "x": 22,
      "y": -70,
      "rotate": -6,
      "scale": 0,
      "speed": 50
    }
  },
  "codeCard": {
    "initial": {
      "x": 0,
      "y": 0,
      "rotate": -4,
      "scale": -5,
      "speed": 50
    },
    "final": {
      "x": 30,
      "y": 78,
      "rotate": 10,
      "scale": 0,
      "speed": 50
    }
  },
  "twiceCard": {
    "initial": {
      "x": 0,
      "y": 0,
      "rotate": 0,
      "scale": -5,
      "speed": 50
    },
    "final": {
      "x": 0,
      "y": 0,
      "rotate": 0,
      "scale": -5,
      "speed": 50
    }
  },
  "flightPath": {
    "initial": {
      "x": 68,
      "y": -122,
      "rotate": 0,
      "scale": 8,
      "speed": 50
    },
    "final": {
      "x": 136,
      "y": -122,
      "rotate": 0,
      "scale": 8,
      "speed": 46
    }
  }
};

type AnimationContextType = {
  config: GlobalAnimationConfig;
  updateAnimationConfig: (element: keyof GlobalAnimationConfig, state: 'initial' | 'final', property: keyof ElementState, value: number) => void;
  getJsonConfig: () => string;
  globalProgress: number;
  setGlobalProgress: (val: number) => void;
  isScrubbing: boolean;
  setIsScrubbing: (val: boolean) => void;
  replayKey: number;
  triggerReplay: () => void;
};

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<GlobalAnimationConfig>(initialConfig);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const updateAnimationConfig = (element: keyof GlobalAnimationConfig, state: 'initial' | 'final', property: keyof ElementState, value: number) => {
    setConfig(prev => ({
      ...prev,
      [element]: {
        ...prev[element],
        [state]: {
          ...prev[element][state],
          [property]: value
        }
      }
    }));
  };

  const getJsonConfig = () => {
    return JSON.stringify(config, null, 2);
  };

  const triggerReplay = () => setReplayKey(k => k + 1);

  return (
    <AnimationContext.Provider value={{ 
      config, updateAnimationConfig, getJsonConfig,
      globalProgress, setGlobalProgress,
      isScrubbing, setIsScrubbing,
      replayKey, triggerReplay
    }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationConfig = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationConfig must be used within an AnimationProvider');
  }
  return context;
};
