// Configuración de Quill Editor (Alternativa gratuita a TinyMCE)
// No requiere API key y es completamente funcional

export const QUILL_CONFIG = {
  // Configuración del editor
  EDITOR_CONFIG: {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image', 'blockquote', 'code-block'],
        ['clean']
      ],
      clipboard: {
        matchVisual: false
      }
    },
    placeholder: 'Escribe tu contenido aquí...',
    formats: [
      'header', 'bold', 'italic', 'underline', 'strike',
      'color', 'background', 'align', 'list', 'bullet',
      'indent', 'link', 'image', 'blockquote', 'code-block'
    ]
  },
  
  // Estilos personalizados para el editor
  EDITOR_STYLES: {
    '.ql-editor': {
      'min-height': '400px',
      'font-family': 'inherit',
      'line-height': '1.7',
      'padding': '1rem'
    },
    '.ql-toolbar': {
      'border-top': '1px solid #e2e8f0',
      'border-left': '1px solid #e2e8f0',
      'border-right': '1px solid #e2e8f0',
      'border-radius': '0.5rem 0.5rem 0 0',
      'background-color': '#f8fafc'
    },
    '.ql-container': {
      'border-bottom': '1px solid #e2e8f0',
      'border-left': '1px solid #e2e8f0',
      'border-right': '1px solid #e2e8f0',
      'border-radius': '0 0 0.5rem 0.5rem'
    }
  }
};

