import { useState, useEffect, useRef } from 'react';

export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Una vez visible, dejamos de observar para que la animación solo ocurra una vez
          if (currentElement) {
            observer.unobserve(currentElement);
          }
        }
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px', // Inicia la animación un poco antes de que sea completamente visible
      }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return { elementRef, isVisible };
};
