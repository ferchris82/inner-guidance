import React, { useEffect, useRef } from 'react';

interface FloatingToolbarPortalProps {
  editorContainerSelector: string; // CSS selector for the editor container
  toolbarSelector: string; // CSS selector for the Quill toolbar
  topOffset?: number; // px
}

export const FloatingToolbarPortal: React.FC<FloatingToolbarPortalProps> = ({
  editorContainerSelector,
  toolbarSelector,
  topOffset = 240,
}) => {
  const originalParentRef = useRef<HTMLElement | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const toolbar = document.querySelector(toolbarSelector) as HTMLElement;
    const editorContainer = document.querySelector(editorContainerSelector) as HTMLElement;
    if (!toolbar || !editorContainer) return;

    // Guardar el padre original y crear un placeholder
    if (!originalParentRef.current) {
      originalParentRef.current = toolbar.parentElement;
      placeholderRef.current = document.createElement('div');
      if (toolbar.parentElement && placeholderRef.current) {
        toolbar.parentElement.insertBefore(placeholderRef.current, toolbar);
      }
    }

    // Mover toolbar al body
    document.body.appendChild(toolbar);

    // Sincronizar ancho y posición
    function syncToolbar() {
      const rect = editorContainer.getBoundingClientRect();
      toolbar.style.position = 'fixed';
      toolbar.style.top = `${topOffset}px`;
      toolbar.style.left = `${rect.left}px`;
      toolbar.style.width = `${rect.width}px`;
      toolbar.style.zIndex = '2000';
      toolbar.style.background = 'white';
      toolbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      toolbar.style.borderRadius = '8px';
      toolbar.style.border = '1px solid #e5e7eb';
    }
    syncToolbar();
    window.addEventListener('resize', syncToolbar);
    window.addEventListener('scroll', syncToolbar, true);

    // Dejar espacio en el editor
    if (placeholderRef.current) {
      placeholderRef.current.style.height = `${toolbar.offsetHeight + 16}px`;
    }

    return () => {
      // Restaurar toolbar a su lugar original
      if (originalParentRef.current && toolbar) {
        originalParentRef.current.insertBefore(toolbar, placeholderRef.current || null);
        toolbar.removeAttribute('style');
      }
      // Quitar placeholder
      if (placeholderRef.current && placeholderRef.current.parentElement) {
        placeholderRef.current.parentElement.removeChild(placeholderRef.current);
      }
      window.removeEventListener('resize', syncToolbar);
      window.removeEventListener('scroll', syncToolbar, true);
    };
  }, [editorContainerSelector, toolbarSelector, topOffset]);

  return null;
};
