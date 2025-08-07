import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type AnimationType = 'fade-in' | 'fade-left' | 'fade-right' | 'scale' | 'slide-up';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation = 'fade-in',
  delay = 0,
  className = '',
}) => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={elementRef}
      className={`scroll-${animation} ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
