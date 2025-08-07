import React, { useState, useRef } from 'react';
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
import { QUILL_CONFIG } from '@/config/quill';
import { saveBlogPost, BlogPost as BlogPostType } from '@/utils/blogStorage';

// Usar la interfaz del sistema de almacenamiento
type BlogPost = BlogPostType;

interface BlogEditorProps {
  editingPost?: BlogPost | null;
}

export function BlogEditor({ editingPost }: BlogEditorProps) {
  const [blogPost, setBlogPost] = useState<BlogPost>(() => {
    // Si estamos editando un post, usar sus datos; sino, crear uno nuevo
    if (editingPost) {
      return editingPost;
    }
    return {
      id: Date.now().toString(),
      title: '',
      excerpt: '',
      content: '',
      template: 'default',
      category: '',
      author: 'Maité Gutiérrez',
      featuredImage: '',
      readTime: '5 min',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customStyles: {
        primaryColor: '#2c3e50',
        secondaryColor: '#7f8c8d',
        fontFamily: 'Georgia, serif',
        spacing: 'relaxed'
      }
    };
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'settings'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const quillRef = useRef<ReactQuill>(null);

  const handleEditorChange = (content: string) => {
    setBlogPost(prev => ({ ...prev, content }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Validar campos requeridos
      if (!blogPost.title.trim()) {
        setSaveMessage('El título es requerido');
        return;
      }
      
      if (!blogPost.content.trim()) {
        setSaveMessage('El contenido es requerido');
        return;
      }
      
      if (!blogPost.category) {
        setSaveMessage('Selecciona una categoría');
        return;
      }
      
      // Guardar el artículo (actualizar fecha de modificación)
      const postToSave = {
        ...blogPost,
        updatedAt: new Date().toISOString()
      };
      
      const success = saveBlogPost(postToSave);
      
      if (success) {
        setSaveMessage(`¡Artículo ${editingPost ? 'actualizado' : 'guardado'} exitosamente!`);
        
        // Solo limpiar campos si estamos creando un nuevo post, no editando
        if (!editingPost) {
          setBlogPost({
            id: Date.now().toString(),
            title: '',
            excerpt: '',
            content: '',
            template: 'default',
            category: '',
            author: 'Maité Gutiérrez',
            featuredImage: '',
            readTime: '5 min',
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customStyles: {
              primaryColor: '#2c3e50',
              secondaryColor: '#7f8c8d',
              fontFamily: 'Georgia, serif',
              spacing: 'relaxed'
            }
          });
          
          // Limpiar el editor Quill si existe
          if (quillRef.current) {
            quillRef.current.getEditor().setText('');
          }
        } else {
          // Si estamos editando, actualizar el estado local con los cambios
          setBlogPost(postToSave);
        }
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Error al guardar el artículo');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setSaveMessage('Error al guardar el artículo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Editor de Blog
          </h1>
          <p className="text-muted-foreground">
            Crea contenido espiritual con total libertad de diseño
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel Principal */}
          <div className="lg:col-span-2">
            <Card className="shadow-spiritual">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {isPreviewMode ? 'Vista Previa' : 'Editor de Contenido'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                      {isPreviewMode ? <Settings className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {isPreviewMode ? 'Editar' : 'Vista Previa'}
                    </Button>
                                         <Button
                       onClick={handleSave}
                       disabled={isSaving}
                       className="bg-gradient-spiritual hover:shadow-spiritual"
                     >
                       <Save className="w-4 h-4 mr-2" />
                       {isSaving ? 'Guardando...' : 'Guardar'}
                     </Button>
                   </div>
                 </div>
                 {saveMessage && (
                   <div className={`mt-2 p-2 rounded text-sm ${
                     saveMessage.includes('Error') 
                       ? 'bg-red-100 text-red-700 border border-red-200' 
                       : 'bg-green-100 text-green-700 border border-green-200'
                   }`}>
                     {saveMessage}
                   </div>
                 )}
              </CardHeader>
              <CardContent>
                {!isPreviewMode ? (
                  <div className="space-y-6">
                    {/* Campos básicos */}
                    <div className="space-y-4">
                      <Input
                        placeholder="Título del artículo..."
                        value={blogPost.title}
                        onChange={(e) => setBlogPost(prev => ({ ...prev, title: e.target.value }))}
                        className="text-2xl font-heading"
                      />
                      <Textarea
                        placeholder="Resumen del artículo..."
                        value={blogPost.excerpt}
                        onChange={(e) => setBlogPost(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* Editor Quill */}
                    <div className="border rounded-lg overflow-hidden">
                      <ReactQuill
                        ref={quillRef}
                        value={blogPost.content}
                        onChange={handleEditorChange}
                        {...QUILL_CONFIG.EDITOR_CONFIG}
                        style={{
                          fontFamily: blogPost.customStyles.fontFamily,
                          color: blogPost.customStyles.secondaryColor
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Vista Previa */
                  <div 
                    className="prose prose-lg max-w-none"
                  >
                    <h1>{blogPost.title}</h1>
                    <p className="text-xl text-muted-foreground">{blogPost.excerpt}</p>
                    <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Configuración */}
            <Card className="shadow-peaceful">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Categoría</label>
                  <Select 
                    value={blogPost.category} 
                    onValueChange={(value) => setBlogPost(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llamado-divino">Llamado Divino</SelectItem>
                      <SelectItem value="mensaje-profetico">Mensaje Profético</SelectItem>
                      <SelectItem value="proposito-divino">Propósito Divino</SelectItem>
                      <SelectItem value="identidad">Identidad</SelectItem>
                      <SelectItem value="profecia">Profecía</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tiempo de lectura</label>
                  <Input
                    value={blogPost.readTime}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, readTime: e.target.value }))}
                    placeholder="5 min"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Imagen destacada</label>
                  <Input
                    value={blogPost.featuredImage}
                    onChange={(e) => setBlogPost(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="URL de la imagen"
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
                  <label htmlFor="featured" className="text-sm font-medium">
                    Artículo destacado
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Personalización de Colores */}
            <Card className="shadow-peaceful">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Personalización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Color principal</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={blogPost.customStyles.primaryColor}
                      onChange={(e) => setBlogPost(prev => ({
                        ...prev,
                        customStyles: { ...prev.customStyles, primaryColor: e.target.value }
                      }))}
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={blogPost.customStyles.primaryColor}
                      onChange={(e) => setBlogPost(prev => ({
                        ...prev,
                        customStyles: { ...prev.customStyles, primaryColor: e.target.value }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Color secundario</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={blogPost.customStyles.secondaryColor}
                      onChange={(e) => setBlogPost(prev => ({
                        ...prev,
                        customStyles: { ...prev.customStyles, secondaryColor: e.target.value }
                      }))}
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={blogPost.customStyles.secondaryColor}
                      onChange={(e) => setBlogPost(prev => ({
                        ...prev,
                        customStyles: { ...prev.customStyles, secondaryColor: e.target.value }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
