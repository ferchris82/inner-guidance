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
  FileText
} from 'lucide-react';
import { saveBlogPost, updateBlogPost, getBlogPosts } from '@/utils/blogSupabase';
import { BlogPost } from '@/lib/supabase';
// import { getEditorConfig, saveEditorConfig, applyToolbarStyles, EditorConfig } from '@/utils/editorConfig';
import { ToolbarConfigPanel } from './ToolbarConfigPanel';
import { getCategories, Category } from '@/utils/categories';
import { ArticlePreviewModal } from './ArticlePreviewModal';

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
  const quillRef = useRef<ReactQuill>(null);

  // Eliminado efecto de configuración de toolbar

  // Cargar categorías desde Supabase
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
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

  // Nuevo: id del borrador en edición
  const [draftId, setDraftId] = useState<string | null>(editingPost?.id || null);

  // Guardar automáticamente como borrador al editar
  useEffect(() => {
    // No guardar si se está editando un post existente (ya publicado)
    if (editingPost) return;
    // No guardar si el título y contenido están vacíos
    if (!blogPost.title && !blogPost.content) return;
    const timeout = setTimeout(async () => {
      // Si ya hay un borrador, actualizarlo
      if (draftId) {
        const updated = await updateBlogPost(draftId, blogPost, true);
        if (updated) setDraftId(updated.id);
      } else {
        // Si no, crear uno nuevo
        const saved = await saveBlogPost(blogPost, true);
        if (saved) setDraftId(saved.id);
      }
    }, 1200); // Espera 1.2s tras la última edición
    return () => clearTimeout(timeout);
  }, [blogPost, editingPost]);

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
  };

  // Al guardar, publicar el artículo (is_draft: false)
  const handleSave = async () => {
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
        }, false);
      } else {
        // Guardar como nuevo artículo publicado
        result = await saveBlogPost({
          ...blogPost,
          excerpt: excerptToSave.trim(),
        }, false);
      }
      if (result) {
        setSaveMessage('¡Artículo guardado exitosamente!');
        setDraftId(null); // Limpiar el id del borrador
        // Actualizar la lista de borradores para quitar el publicado
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
      } else {
        setSaveMessage('Error al guardar el artículo. Verifica tu conexión a internet.');
      }
    } catch (error) {
      setSaveMessage('Error al guardar el artículo. Revisa la consola para más detalles.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const handleEditorChange = (content: string) => {
    setBlogPost(prev => ({ ...prev, content }));
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['link'],
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
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1 sm:flex-none order-3 text-xs sm:text-sm min-w-0"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="truncate">
                        {isSaving ? 'Guardando...' : 'Guardar'}
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
                  <Input
                    value={blogPost.featured_image}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="URL de la imagen"
                    className="h-9 text-sm"
                  />
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