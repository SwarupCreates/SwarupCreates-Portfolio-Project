import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import styles from './Button.module.css';

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

type ButtonProps = BaseButtonProps & HTMLMotionProps<'button'>;
type AnchorProps = BaseButtonProps & HTMLMotionProps<'a'>;

type Props = (ButtonProps & { href?: undefined }) | (AnchorProps & { href: string });

export const Button = React.forwardRef<HTMLElement, Props>((props, ref) => {
  const { variant = 'primary', icon, children, disabled, className, ...rest } = props;

  const isAnchor = 'href' in rest;
  const Component = isAnchor ? motion.a : motion.button;

  // Background colors based on variant and hover state
  const bgVariants = {
    primary: { default: 'var(--primary)', hover: '#004da6' }, // slightly darker on hover
    secondary: { default: 'var(--surface-hover)', hover: 'rgba(0, 90, 194, 0.15)' },
    ghost: { default: 'transparent', hover: 'var(--surface-hover)' },
  };

  const getBackground = (state: 'default' | 'hover') => bgVariants[variant][state];

  return (
    <Component
      ref={ref as any}
      className={`${styles.button} ${styles[variant]} ${className || ''}`}
      disabled={disabled}
      whileHover={!disabled ? 'hover' : undefined}
      whileTap={!disabled ? 'tap' : undefined}
      initial="default"
      aria-disabled={disabled}
      {...(rest as any)}
    >
      <motion.div
        className={styles.background}
        variants={{
          default: { backgroundColor: getBackground('default'), scale: 1 },
          hover: { backgroundColor: getBackground('hover'), scale: 1 },
          tap: { scale: 0.98 },
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      />
      <span className={styles.content}>
        {icon && (
          <motion.span
            className={`material-symbols-outlined ${styles.icon}`}
            variants={{
              default: { fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" },
              hover: { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" },
            }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            aria-hidden="true"
          >
            {icon}
          </motion.span>
        )}
        {children}
      </span>
    </Component>
  );
});

Button.displayName = 'Button';
