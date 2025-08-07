import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, FileText } from 'lucide-react';
import { saveBlogPost } from '@/utils/blogSupabase';
import { BlogPost } from '@/lib/supabase';

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
  const quillRef = useRef<ReactQuill>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Validar campos requeridos
      if (!blogPost.title.trim()) {
        setSaveMessage('El título es requerido');
        setIsSaving(false);
        return;
      }
      
      if (!blogPost.content.trim()) {
        setSaveMessage('El contenido es requerido');
        setIsSaving(false);
        return;
      }
      
      if (!blogPost.category) {
        setSaveMessage('Selecciona una categoría');
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
        setSaveMessage(`¡Artículo guardado exitosamente!`);
        
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Editor de Blog Espiritual
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium mb-2">Título del Artículo</label>
                <Input
                  value={blogPost.title}
                  onChange={(e) => setBlogPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Escribe el título de tu artículo espiritual..."
                  className="text-lg"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <Select
                  value={blogPost.category}
                  onValueChange={(value) => setBlogPost(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
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

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">Resumen (Opcional)</label>
                <Textarea
                  value={blogPost.excerpt}
                  onChange={(e) => setBlogPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descripción del artículo (se generará automáticamente si se deja vacío)"
                  rows={3}
                />
              </div>

              {/* Tiempo de lectura */}
              <div>
                <label className="block text-sm font-medium mb-2">Tiempo de Lectura</label>
                <Select
                  value={blogPost.read_time}
                  onValueChange={(value) => setBlogPost(prev => ({ ...prev, read_time: value }))}
                >
                  <SelectTrigger>
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

              {/* Editor de contenido */}
              <div>
                <label className="block text-sm font-medium mb-2">Contenido del Artículo</label>
                <div className="border rounded-lg overflow-hidden">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={blogPost.content}
                    onChange={(content) => setBlogPost(prev => ({ ...prev, content }))}
                    modules={quillModules}
                    placeholder="Comparte tu mensaje espiritual..."
                    style={{ minHeight: '300px' }}
                  />
                </div>
              </div>

              {/* Mensajes */}
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-lg ${
                    saveMessage.includes('exitosamente') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {saveMessage}
                </motion.div>
              )}

              {/* Botón guardar */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Guardando...' : 'Guardar Artículo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
