// Utilidad para manejar configuraciones del editor
export interface EditorConfig {
  toolbarPosition: 'top' | 'bottom';
}

const EDITOR_CONFIG_KEY = 'inner-guidance-editor-config';

// Configuración por defecto
const defaultConfig: EditorConfig = {
  toolbarPosition: 'top'
};

// Obtener configuración actual
export const getEditorConfig = (): EditorConfig => {
  try {
    const stored = localStorage.getItem(EDITOR_CONFIG_KEY);
    if (stored) {
      return { ...defaultConfig, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Error loading editor config:', error);
  }
  return defaultConfig;
};

// Guardar configuración
export const saveEditorConfig = (config: EditorConfig): void => {
  try {
    localStorage.setItem(EDITOR_CONFIG_KEY, JSON.stringify(config));
    console.log('Editor config saved:', config);
  } catch (error) {
    console.error('Error saving editor config:', error);
  }
};

// Aplicar estilos según la configuración
export const applyToolbarStyles = (config: EditorConfig) => {
  const toolbar = document.querySelector('.ql-toolbar') as HTMLElement;
  const container = document.querySelector('.ql-container') as HTMLElement;
  const quillEditor = document.querySelector('.ql-editor') as HTMLElement;
  
  if (!toolbar || !container) return;

  // Limpiar estilos anteriores y clases de wrapper
  toolbar.removeAttribute('style');
  container.removeAttribute('style');
  toolbar.classList.remove('toolbar-bottom'); // Limpiar clases anteriores
  
  // Limpiar cualquier wrapper previo
  const existingWrapper = document.querySelector('.custom-editor-wrapper');
  if (existingWrapper) {
    const parent = existingWrapper.parentNode;
    const toolbar = existingWrapper.querySelector('.ql-toolbar');
    const container = existingWrapper.querySelector('.ql-container');
    
    if (parent && toolbar && container) {
      parent.appendChild(toolbar);
      parent.appendChild(container);
      existingWrapper.remove();
    }
  }

  const baseToolbarStyles = `
    background-color: white !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.1) !important;
    padding: 8px 12px !important;
  `;

  const baseContainerStyles = `
    border: 1px solid #e5e7eb !important;
    border-radius: 8px !important;
  `;

  switch (config.toolbarPosition) {
    case 'top': {
      // Toolbar arriba del contenido (clásica)
      toolbar.setAttribute('style', `
        ${baseToolbarStyles}
        position: relative !important;
        margin-bottom: 0 !important;
        border-bottom-left-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      `);
      container.setAttribute('style', `
        ${baseContainerStyles}
        border-top: none !important;
        border-top-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
      `);
      break;
    }

    case 'bottom': {
      // Para mover toolbar abajo, necesitamos reorganizar el DOM
      const reactQuillContainer = toolbar.parentElement;
      
      if (reactQuillContainer) {
        // Crear un contenedor personalizado
        const customWrapper = document.createElement('div');
        customWrapper.className = 'custom-editor-wrapper';
        customWrapper.style.cssText = `
          display: flex !important;
          flex-direction: column !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        `;

        // Insertar el wrapper antes del contenedor de ReactQuill
        reactQuillContainer.parentNode?.insertBefore(customWrapper, reactQuillContainer);

        // Mover el contenedor (editor) primero
        container.style.cssText = `
          ${baseContainerStyles}
          border: none !important;
          border-radius: 0 !important;
          order: 1 !important;
          margin: 0 !important;
        `;
        customWrapper.appendChild(container);

        // Mover la toolbar después
        toolbar.style.cssText = `
          ${baseToolbarStyles}
          border: none !important;
          border-radius: 0 !important;
          border-top: 1px solid #e5e7eb !important;
          order: 2 !important;
          margin: 0 !important;
        `;
        
        // Añadir clase para identificar toolbar en posición bottom
        toolbar.classList.add('toolbar-bottom');
        
        customWrapper.appendChild(toolbar);

        // Ocultar el contenedor original de ReactQuill
        reactQuillContainer.style.display = 'none';
      }
      break;
    }
  }
};
