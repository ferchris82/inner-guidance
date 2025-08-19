import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Type, 
  Image, 
  Save, 
  Eye, 
  Settings, 
  FileText,
  Upload,
  X
} from 'lucide-react';
import { saveBlogPost, updateBlogPost, getBlogPosts } from '@/utils/blogSupabase';
import { BlogPost } from '@/lib/supabase';
// import { getEditorConfig, saveEditorConfig, applyToolbarStyles, EditorConfig } from '@/utils/editorConfig';
import { ToolbarConfigPanel } from './ToolbarConfigPanel';
import { getCategories, Category } from '@/utils/categories';
import { ArticlePreviewModal } from './ArticlePreviewModal';
import { uploadImage, UploadResult } from '@/utils/imageUpload';
import { setupImageStorage } from '@/utils/storageSetup';

interface BlogEditorProps {
  editingPost?: BlogPost | null;
}

export function BlogEditor({ editingPost }: BlogEditorProps) {
  const [blogPost, setBlogPost] = useState({
    title: editingPost?.title || '',
    excerpt: editingPost?.excerpt || '',
    content: editingPost?.content || '',
    category: editingPost?.category || '',
    author: editingPost?.author || 'Maité Gutiérrez',
    featured_image: editingPost?.featured_image || '',
    read_time: editingPost?.read_time || '5 min',
    featured: editingPost?.featured || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  // Eliminada la configuración de posición del toolbar
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [drafts, setDrafts] = useState<BlogPost[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  // Eliminado efecto de configuración de toolbar

  // Cargar categorías desde Supabase
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
        
        // Verificar configuración de storage para imágenes
        const storageSetup = await setupImageStorage();
        if (!storageSetup.success) {
          console.warn('⚠️ Configuración de storage:', storageSetup.error);
          // No mostrar error al usuario, solo log para debug
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Escuchar cambios en las categorías
  useEffect(() => {
    const handleCategoriesUpdate = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  // Gestión de múltiples borradores - no usar localStorage para un solo draft
  const [draftId, setDraftId] = useState<string | null>(editingPost?.id || null);
  // Variable para determinar si estamos editando un borrador (no un artículo publicado)
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(
    editingPost ? editingPost.is_draft : false
  );

  // Auto-guardado: crear nuevo borrador automáticamente si no existe
  useEffect(() => {
    // No auto-guardar si se está editando un post existente (ya publicado)
    if (editingPost) return;
    // No auto-guardar si el título y contenido están vacíos
    if (!blogPost.title && !blogPost.content) return;
    
    const timeout = setTimeout(async () => {
      try {
        if (draftId) {
          // Actualizar borrador existente
          await updateBlogPost(draftId, { ...blogPost, is_draft: true }, true);
        } else {
          // Crear nuevo borrador automáticamente
          const saved = await saveBlogPost({ ...blogPost, is_draft: true }, true);
          if (saved && saved.id) {
            setDraftId(saved.id);
            // Actualizar lista de borradores
            setDrafts(prev => [...prev, saved]);
          }
        }
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [blogPost, editingPost, draftId]);

  // Cargar borradores al montar el componente
  useEffect(() => {
    async function fetchDrafts() {
      const allPosts = await getBlogPosts();
      setDrafts(allPosts.filter(post => post.is_draft));
    }
    fetchDrafts();
  }, []);

  // Función para cargar un borrador en el editor
  const handleLoadDraft = (draft: BlogPost) => {
    setBlogPost({
      title: draft.title,
      excerpt: draft.excerpt,
      content: draft.content,
      category: draft.category,
      author: draft.author,
      featured_image: draft.featured_image || '',
      read_time: draft.read_time,
      featured: draft.featured,
    });
    setDraftId(draft.id);
    setIsEditingDraft(true); // Marcamos que estamos editando un borrador
  };

  // Guardar borrador manualmente
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      // Guardar borrador sin validaciones estrictas
      let excerptToSave = blogPost.excerpt;
      if (!excerptToSave.trim() && blogPost.content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blogPost.content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        excerptToSave = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
      }
      
      let result = null;
      if (draftId) {
        // Actualizar el borrador existente
        result = await updateBlogPost(draftId, {
          ...blogPost,
          excerpt: excerptToSave.trim(),
          is_draft: true,
        }, true);
      } else {
        // Crear nuevo borrador
        result = await saveBlogPost({
          ...blogPost,
          excerpt: excerptToSave.trim(),
          is_draft: true,
        }, true);
        
        // Guardar el nuevo draftId en estado (sin localStorage)
        if (result && result.id) {
          setDraftId(result.id);
          setIsEditingDraft(true); // Ahora estamos editando un borrador
        }
      }
      
      if (result) {
        setSaveMessage('¡Borrador guardado exitosamente!');
        // Actualizar la lista de borradores
        setDrafts(drafts => {
          const exists = drafts.some(d => d.id === result.id);
          if (exists) {
            // Actualizar borrador existente
            return drafts.map(d => d.id === result.id ? result : d);
          } else {
            // Agregar nuevo borrador
            return [...drafts, result];
          }
        });
        // NO limpiar campos - mantener el trabajo en curso
      } else {
        setSaveMessage('Error al guardar el borrador. Verifica tu conexión a internet.');
      }
    } catch (error) {
      setSaveMessage('Error al guardar el borrador. Revisa la consola para más detalles.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      if (!blogPost.title.trim()) {
        setSaveMessage('Error: El título es requerido');
        setIsSaving(false);
        return;
      }
      if (!blogPost.content.trim()) {
        setSaveMessage('Error: El contenido es requerido');
        setIsSaving(false);
        return;
      }
      if (!blogPost.category) {
        setSaveMessage('Error: Selecciona una categoría');
        setIsSaving(false);
        return;
      }
      let excerptToSave = blogPost.excerpt;
      if (!excerptToSave.trim()) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blogPost.content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        excerptToSave = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
      }
      let result = null;
      if (draftId) {
        // Actualizar el borrador y publicarlo
        result = await updateBlogPost(draftId, {
          ...blogPost,
          excerpt: excerptToSave.trim(),
          is_draft: false,
        }, false);
      } else {
        // Guardar como nuevo artículo publicado
        result = await saveBlogPost({
          ...blogPost,
          excerpt: excerptToSave.trim(),
          is_draft: false,
        }, false);
      }
      if (result) {
        setSaveMessage('¡Artículo publicado exitosamente!');
        setDraftId(null);
        setIsEditingDraft(false); // Ya no estamos editando un borrador
        setDrafts(drafts => drafts.filter(d => d.id !== (result.id || draftId)));
        if (!editingPost) {
          setBlogPost({
            title: '',
            excerpt: '',
            content: '',
            category: '',
            author: 'Maité Gutiérrez',
            featured_image: '',
            read_time: '5 min',
            featured: false,
          });
          if (quillRef.current) {
            quillRef.current.getEditor().setText('');
          }
        }
      }
    } catch (error) {
      setSaveMessage('Error al publicar el artículo. Verifica tu conexión a internet.');
    } finally {
      setIsSaving(false);
    }
  };

  // Función para manejar la subida de imagen
  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    setImageUploadError(null);

    try {
      const result: UploadResult = await uploadImage(file);
      
      if (result.success && result.url) {
        setBlogPost(prev => ({ ...prev, featured_image: result.url }));
        setSaveMessage('¡Imagen subida exitosamente!');
      } else {
        setImageUploadError(result.error || 'Error al subir la imagen');
      }
    } catch (error) {
      setImageUploadError('Error inesperado al subir la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Función para manejar el cambio de archivo de imagen
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Limpiar el input para permitir subir el mismo archivo otra vez
    event.target.value = '';
  };

  // Función para limpiar la imagen
  const handleClearImage = () => {
    setBlogPost(prev => ({ ...prev, featured_image: '' }));
    setImageUploadError(null);
  };

  // Funciones para drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    } else if (files.length > 0) {
      setImageUploadError('Por favor, arrastra solo archivos de imagen');
    }
  };

  const handleEditorChange = (content: string) => {
    setBlogPost(prev => ({ ...prev, content }));
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'link'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const categoryName = categories.find(c => c.id === blogPost.category)?.name || '';

  const handleSaveBeforePreview = async () => {
    if (!isSaving) {
      await handleSave();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-3 sm:p-4">
      {/* Modal de vista previa avanzada */}
      <ArticlePreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        article={{
          ...blogPost,
          created_at: editingPost?.created_at || new Date().toISOString(),
        }}
        categoryName={categoryName}
        onEdit={() => setPreviewOpen(false)}
        onSaveBeforePreview={handleSaveBeforePreview}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-primary mb-1 sm:mb-2">
            Editor Espiritual
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Crea contenido espiritual con total libertad de diseño
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Panel Principal */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isPreviewMode ? 'Vista Previa' : 'Editor de Contenido'}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2">
                    {/* Eliminado ToolbarConfigPanel y controles de posición de toolbar */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewOpen(true)}
                      className="flex-1 sm:flex-none order-1 sm:order-2 text-xs sm:text-sm min-w-0"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1 sm:ml-2 truncate">Vista Previa</span>
                    </Button>
                    {/* Botón de Guardar Borrador - solo aparece cuando es necesario */}
                    {(!editingPost || isEditingDraft) && (
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1 sm:flex-none order-3 text-xs sm:text-sm min-w-0"
                      >
                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="truncate">
                          {isSaving ? 'Guardando...' : (isEditingDraft ? 'Actualizar Borrador' : 'Guardar Borrador')}
                        </span>
                      </Button>
                    )}
                    <Button
                      onClick={handlePublish}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-1 sm:flex-none order-4 text-xs sm:text-sm min-w-0"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="truncate">
                        {isSaving ? 'Publicando...' : 'Publicar'}
                      </span>
                    </Button>
                  </div>
                </div>
                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mt-2 p-3 rounded-lg ${
                      saveMessage.includes('Error') 
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}
                  >
                    {saveMessage}
                  </motion.div>
                )}
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {!isPreviewMode ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Campos básicos */}
                    <div className="space-y-3 sm:space-y-4">
                      <Input
                        placeholder="Título del artículo..."
                        value={blogPost.title}
                        onChange={(e) => setBlogPost(prev => ({ ...prev, title: e.target.value }))}
                        className="text-lg sm:text-2xl font-heading h-12"
                      />
                      <Textarea
                        placeholder="Resumen del artículo..."
                        value={blogPost.excerpt}
                        onChange={(e) => setBlogPost(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows={3}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    {/* Editor Quill con toolbar fijo y área de edición scrollable interna */}
                    <div className="border rounded-lg overflow-hidden" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Toolbar fijo */}
                        <div
                          className="quill-toolbar-sticky"
                          style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', borderBottom: '1px solid #eee' }}
                        >
                          {/* El toolbar real será inyectado por ReactQuill, pero este div ayuda a que el sticky funcione */}
                        </div>
                        {/* Editor scrollable */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                          <ReactQuill
                            ref={quillRef}
                            value={blogPost.content}
                            onChange={handleEditorChange}
                            modules={quillModules}
                            placeholder="Comparte tu mensaje espiritual..."
                            style={{ height: '100%', minHeight: '250px' }}
                            className="text-sm sm:text-base h-full quill-toolbar-sticky-fix"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Vista Previa */
                  <div className="prose prose-sm sm:prose-lg max-w-none">
                    <h1 className="text-xl sm:text-3xl">{blogPost.title}</h1>
                    <p className="text-lg sm:text-xl text-muted-foreground">{blogPost.excerpt}</p>
                    <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Panel Lateral */}
          <div className="space-y-4 sm:space-y-6">
            {/* Configuración */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block">Categoría</label>
                  <Select 
                    value={blogPost.category} 
                    onValueChange={(value) => setBlogPost(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>Cargando categorías...</SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="empty" disabled>No hay categorías disponibles</SelectItem>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block">Tiempo de lectura</label>
                  <Select
                    value={blogPost.read_time}
                    onValueChange={(value) => setBlogPost(prev => ({ ...prev, read_time: value }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 min">3 min</SelectItem>
                      <SelectItem value="5 min">5 min</SelectItem>
                      <SelectItem value="8 min">8 min</SelectItem>
                      <SelectItem value="10 min">10 min</SelectItem>
                      <SelectItem value="15 min">15 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block">Imagen destacada</label>
                  
                  {/* Área de drag & drop */}
                  <div 
                    className={`
                      border-2 border-dashed rounded-lg p-4 transition-colors
                      ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                      ${isUploadingImage ? 'opacity-50' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {/* Opción de subir archivo */}
                    <div className="space-y-3">
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={isUploadingImage}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className={`
                            inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer
                            hover:bg-gray-50 transition-colors text-sm bg-white
                            ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <Upload className="w-4 h-4" />
                          {isUploadingImage ? 'Subiendo...' : 'Subir imagen'}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          {isDragOver ? 'Suelta la imagen aquí' : 'o arrastra una imagen aquí'}
                        </p>
                      </div>
                      
                      {blogPost.featured_image && (
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClearImage}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Eliminar imagen
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Error de subida */}
                  {imageUploadError && (
                    <div className="text-red-600 text-xs bg-red-50 p-2 rounded mt-2">
                      {imageUploadError}
                    </div>
                  )}
                  
                  {/* Información de ayuda */}
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <p>• Formatos soportados: JPG, PNG, GIF, WebP</p>
                    <p>• Tamaño máximo: 5MB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={blogPost.featured}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-xs sm:text-sm font-medium">
                    Artículo destacado
                  </label>
                </div>
              </CardContent>
            </Card>
            {/* Vista previa de imagen */}
            {blogPost.featured_image && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                    Vista Previa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={blogPost.featured_image} 
                    alt="Vista previa" 
                    className="w-full h-24 sm:h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </CardContent>
              </Card>
            )}
            {/* Mostrar lista de borradores debajo del panel de configuración */}
            {drafts.length > 0 && (
              <Card className="shadow-xl border-0 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-yellow-900">Borradores guardados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {drafts.map(draft => (
                      <button
                        key={draft.id}
                        onClick={() => handleLoadDraft(draft)}
                        className="px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-900 text-xs border border-yellow-300"
                      >
                        {draft.title || 'Sin título'}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}