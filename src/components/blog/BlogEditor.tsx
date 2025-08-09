import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { saveBlogPost, updateBlogPost } from '@/utils/blogSupabase';
import { BlogPost } from '@/lib/supabase';
import { getEditorConfig, saveEditorConfig, applyToolbarStyles, EditorConfig } from '@/utils/editorConfig';
import { ToolbarConfigPanel } from './ToolbarConfigPanel';
import { getCategories, Category } from '@/utils/categories';

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
  const [toolbarConfig, setToolbarConfig] = useState<EditorConfig>(getEditorConfig());
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const quillRef = useRef<ReactQuill>(null);

  // Aplicar configuración de toolbar
  useEffect(() => {
    const applyToolbarConfiguration = () => {
      applyToolbarStyles(toolbarConfig);
    };

    // Aplicar estilos cuando el componente se monte o cambie la configuración
    const timer = setTimeout(applyToolbarConfiguration, 100);
    
    // Limpiar el timer al desmontar
    return () => clearTimeout(timer);
  }, [isPreviewMode, toolbarConfig]); // Re-aplicar cuando cambie el modo de vista o configuración

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

  // Escuchar cambios en las categorías - ya no es necesario con Supabase
  // pero mantenemos por compatibilidad
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

  // Manejar cambios en la configuración
  const handleConfigChange = (newConfig: EditorConfig) => {
    setToolbarConfig(newConfig);
    saveEditorConfig(newConfig);
    
    // Re-aplicar estilos inmediatamente
    setTimeout(() => {
      applyToolbarStyles(newConfig);
    }, 100);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Validar campos requeridos
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

      // Si no hay excerpt, extraer del contenido
      let excerptToSave = blogPost.excerpt;
      if (!excerptToSave.trim()) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blogPost.content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        excerptToSave = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
      }

      console.log('💾 Guardando en Supabase...', blogPost);
      
      // Guardar en Supabase
      const result = await saveBlogPost({
        title: blogPost.title.trim(),
        excerpt: excerptToSave.trim(),
        content: blogPost.content,
        category: blogPost.category,
        author: blogPost.author,
        featured_image: blogPost.featured_image || '',
        read_time: blogPost.read_time,
        featured: blogPost.featured
      });
      
      if (result) {
        console.log('✅ Guardado exitoso:', result);
        setSaveMessage('¡Artículo guardado exitosamente!');
        
        // Limpiar formulario solo si estamos creando un nuevo post
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
          
          // Limpiar el editor Quill si existe
          if (quillRef.current) {
            quillRef.current.getEditor().setText('');
          }
        }
      } else {
        console.error('❌ Error al guardar');
        setSaveMessage('Error al guardar el artículo. Verifica tu conexión a internet.');
      }
    } catch (error) {
      console.error('❌ Error en handleSave:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-3 sm:p-4">
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
                    <div className="order-2 sm:order-1">
                      <ToolbarConfigPanel
                        config={toolbarConfig}
                        onConfigChange={handleConfigChange}
                        isOpen={isConfigPanelOpen}
                        onToggle={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="flex-1 sm:flex-none order-1 sm:order-2 text-xs sm:text-sm min-w-0"
                    >
                      {isPreviewMode ? <Settings className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                      <span className="ml-1 sm:ml-2 truncate">
                        {isPreviewMode ? 'Editar' : 'Vista Previa'}
                      </span>
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

                    {/* Editor Quill */}
                    <div className="border rounded-lg overflow-hidden">
                      <ReactQuill
                        ref={quillRef}
                        value={blogPost.content}
                        onChange={handleEditorChange}
                        modules={quillModules}
                        placeholder="Comparte tu mensaje espiritual..."
                        style={{ minHeight: '250px' }}
                        className="text-sm sm:text-base"
                      />
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
          </div>
        </div>
      </div>
    </div>
  );
}
