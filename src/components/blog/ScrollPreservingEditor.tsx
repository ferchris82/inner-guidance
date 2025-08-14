import React, { useRef, useEffect, ReactNode } from 'react';

interface ScrollPreservingEditorProps {
  children: ReactNode;
}

export const ScrollPreservingEditor: React.FC<ScrollPreservingEditorProps> = ({ children }) => {
  const scrollPositionRef = useRef<number>(0);

  const preserveScroll = () => {
    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
  };

  const restoreScroll = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(currentScroll - scrollPositionRef.current) > 10) {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: 'instant'
      });
    }
  };

  useEffect(() => {
    // Interceptar eventos de formato en el toolbar
    const handleToolbarInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.ql-toolbar')) {
        preserveScroll();
        
        // Restaurar después de un breve delay
        setTimeout(restoreScroll, 5);
      }
    };

    // Escuchar eventos de clic en el toolbar
    document.addEventListener('click', handleToolbarInteraction, true);

    return () => {
      document.removeEventListener('click', handleToolbarInteraction, true);
    };
  }, []);

  return <>{children}</>;
};
