import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff, 
  FileText,
  Video,
  Headphones,
  BookOpen,
  ExternalLink,
  Youtube,
  Music,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Loader2,
  ChevronUp,
  ChevronDown,
  Layers
} from 'lucide-react';

import { ResourceItem, CreateResourceData, resourceTypeConfig, validateUrl, extractYouTubeThumbnail, getUrlSuggestions } from '@/utils/resourcesConfig';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  toggleResourceActive,
  toggleResourceFeatured,
  reorderResources
} from '@/utils/resourcesSupabase';
import { 
  uploadAudioFile, 
  deleteAudioFile, 
  initializeAudioStorage 
} from '@/lib/audioSupabase';
import { initializeSampleResources, checkExistingResources } from '@/utils/initializeResources';

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{className?: string}>> = {
    FileText, Video, Headphones, BookOpen, Youtube, Music
  };
  return icons[iconName] || FileText;
};

export function ResourcesManager() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [deletingResource, setDeletingResource] = useState<ResourceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Estado del formulario
  const [formData, setFormData] = useState<CreateResourceData>({
    title: '',
    description: '',
    type: 'youtube',
    url: '',
    thumbnail_url: '',
    featured: false,
    order_index: 0,
    active: true,
    metadata: {}
  });

  // Cargar recursos
  const loadResources = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error cargando recursos:', error);
      toast({
        title: "Error cargando recursos",
        description: "No se pudieron cargar los recursos. Intenta refrescar la página.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'youtube',
      url: '',
      thumbnail_url: '',
      featured: false,
      order_index: resources.length,
      active: true,
      metadata: {}
    });
    setEditingResource(null);
  };

  // Abrir diálogo para crear/editar
  const openDialog = (resource?: ResourceItem) => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        type: resource.type,
        url: resource.url,
        thumbnail_url: resource.thumbnail_url || '',
        featured: resource.featured,
        order_index: resource.order_index,
        active: resource.active,
        metadata: resource.metadata || {}
      });
      setEditingResource(resource);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  // Cerrar diálogo
  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // Manejar cambios en el formulario
  const handleFormChange = (field: keyof CreateResourceData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-extraer thumbnail de YouTube
    if (field === 'url' && formData.type === 'youtube' && typeof value === 'string') {
      const thumbnail = extractYouTubeThumbnail(value);
      if (thumbnail) {
        setFormData(prev => ({
          ...prev,
          thumbnail_url: thumbnail
        }));
      }
    }
  };

  // Manejar subida de archivos de audio
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Solo se permiten archivos de audio (MP3, WAV, M4A, OGG)",
        variant: "destructive"
      });
      return;
    }

    // Validar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo no puede ser mayor a 50MB",
        variant: "destructive"
      });
      return;
    }

    setUploadingFile(true);
    setUploadProgress(0);

    try {
      // Inicializar storage si es necesario
      await initializeAudioStorage();
      
      // Simular progreso (ya que Supabase no provee progreso real)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Subir archivo
      const fileUrl = await uploadAudioFile(file, file.name);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (fileUrl) {
        // Actualizar formulario con la URL del archivo subido
        setFormData(prev => ({
          ...prev,
          url: fileUrl,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""), // Usar nombre del archivo si no hay título
        }));

        toast({
          title: "✅ Archivo subido exitosamente",
          description: "El audio se subió correctamente y está listo para usar",
        });
      } else {
        throw new Error('No se pudo obtener la URL del archivo');
      }
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      toast({
        title: "Error subiendo archivo",
        description: error instanceof Error ? error.message : "No se pudo subir el archivo",
        variant: "destructive"
      });
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  // Guardar recurso (crear o editar)
  const handleSave = async () => {
    // Validaciones
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (!formData.url.trim()) {
      toast({
        title: "Error",
        description: "La URL es obligatoria",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(formData.url, formData.type)) {
      const suggestions = getUrlSuggestions(formData.type);
      toast({
        title: "URL no válida",
        description: `La URL no es válida para ${resourceTypeConfig[formData.type].label}. Ejemplos válidos: ${suggestions[0]}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingResource) {
        // Editar existente
        await updateResource(editingResource.id, formData);
        toast({
          title: "✅ Recurso actualizado",
          description: "El recurso se actualizó correctamente"
        });
      } else {
        // Crear nuevo
        await createResource(formData);
        toast({
          title: "✅ Recurso creado",
          description: "El nuevo recurso se creó correctamente"
        });
      }
      
      await loadResources();
      closeDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el recurso",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar recurso
  const handleDelete = async () => {
    if (!deletingResource) return;
    
    try {
      await deleteResource(deletingResource.id);
      toast({
        title: "✅ Recurso eliminado",
        description: "El recurso se eliminó correctamente"
      });
      await loadResources();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el recurso",
        variant: "destructive"
      });
    } finally {
      setDeletingResource(null);
    }
  };

  // Toggle estado activo
  const handleToggleActive = async (resource: ResourceItem) => {
    try {
      await toggleResourceActive(resource.id, !resource.active);
      toast({
        title: `✅ Recurso ${!resource.active ? 'activado' : 'desactivado'}`,
        description: `El recurso "${resource.title}" se ${!resource.active ? 'activó' : 'desactivó'} correctamente`
      });
      await loadResources();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cambiar el estado del recurso",
        variant: "destructive"
      });
    }
  };

  // Toggle estado destacado
  const handleToggleFeatured = async (resource: ResourceItem) => {
    try {
      await toggleResourceFeatured(resource.id, !resource.featured);
      toast({
        title: `✅ Recurso ${!resource.featured ? 'destacado' : 'sin destacar'}`,
        description: `El recurso "${resource.title}" se ${!resource.featured ? 'marcó como destacado' : 'quitó de destacados'}`
      });
      await loadResources();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cambiar el estado destacado del recurso",
        variant: "destructive"
      });
    }
  };

  // Reordenar recursos
  const handleReorder = async (resource: ResourceItem, direction: 'up' | 'down') => {
    const currentIndex = resources.findIndex(r => r.id === resource.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= resources.length) return;

    const targetResource = resources[targetIndex];
    
    try {
      await reorderResources([
        { id: resource.id, order_index: targetResource.order_index },
        { id: targetResource.id, order_index: resource.order_index }
      ]);
      
      toast({
        title: "✅ Orden actualizado",
        description: "El orden de los recursos se actualizó correctamente"
      });
      
      await loadResources();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cambiar el orden del recurso",
        variant: "destructive"
      });
    }
  };

  // Inicializar recursos de ejemplo
  const handleInitializeSample = async () => {
    try {
      setIsInitializing(true);
      
      // Verificar si ya existen recursos
      const hasExisting = await checkExistingResources();
      if (hasExisting) {
        toast({
          title: "Ya existen recursos",
          description: "Ya tienes recursos creados. No se crearán ejemplos duplicados.",
          variant: "default"
        });
        return;
      }

      const results = await initializeSampleResources();
      
      if (results.created.length > 0) {
        toast({
          title: "✅ Recursos de ejemplo creados",
          description: `Se crearon ${results.created.length} recursos de ejemplo con podcasts, videos y más.`
        });
        await loadResources();
      }
      
      if (results.errors.length > 0) {
        toast({
          title: "⚠️ Algunos recursos no se pudieron crear",
          description: `${results.errors.length} recursos tuvieron errores. Revisa la consola para detalles.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error inicializando recursos:', error);
      toast({
        title: "Error",
        description: "No se pudieron crear los recursos de ejemplo. Asegúrate de que la tabla 'resources' existe en Supabase.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-7 w-7 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Layers className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Gestión de Recursos</h1>
        </div>
        <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Recurso
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-lg sm:text-2xl font-bold">{resources.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Activos</p>
              <p className="text-lg sm:text-2xl font-bold">{resources.filter(r => r.active).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Destacados</p>
              <p className="text-lg sm:text-2xl font-bold">{resources.filter(r => r.featured).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Video className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">YouTube</p>
              <p className="text-2xl font-bold">{resources.filter(r => r.type === 'youtube').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Resources List */}
      {resources.length === 0 ? (
        <Card className="p-6 sm:p-8 text-center">
          <div className="space-y-4">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
              <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No hay recursos</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Comienza agregando tu primer recurso espiritual
              </p>
              <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Recurso
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {resources.map((resource, index) => {
            const typeConfig = resourceTypeConfig[resource.type];
            const IconComponent = resourceTypeConfig[resource.type].icon === 'Headphones' ? Headphones :
                                 resourceTypeConfig[resource.type].icon === 'Video' ? Video :
                                 resourceTypeConfig[resource.type].icon === 'Youtube' ? Youtube :
                                 resourceTypeConfig[resource.type].icon === 'FileText' ? FileText :
                                 resourceTypeConfig[resource.type].icon === 'Music' ? Music :
                                 resourceTypeConfig[resource.type].icon === 'BookOpen' ? BookOpen :
                                 Video;
            
            return (
              <Card key={resource.id} className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {resource.thumbnail_url ? (
                        <img 
                          src={resource.thumbnail_url} 
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {IconComponent && <IconComponent className="h-4 w-4 sm:h-8 sm:w-8 text-gray-400" />}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {resource.title}
                          </h3>
                          {resource.featured && (
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          <Badge variant="default" className="text-xs">
                            {IconComponent && <IconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />}
                            {typeConfig.label}
                          </Badge>
                          <Badge variant={resource.active ? "default" : "secondary"} className="text-xs">
                            {resource.active ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                        <span>Orden: {resource.order_index}</span>
                        <span className="hidden sm:inline">•</span>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 truncate max-w-32 sm:max-w-xs"
                        >
                          {resource.url}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions - Stacked on mobile, horizontal on desktop */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-2 sm:ml-4 mt-3 sm:mt-0">
                    {/* Reorder buttons - hidden on mobile to save space */}
                    <div className="hidden sm:flex sm:flex-col">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(resource, 'up')}
                        disabled={index === 0}
                        className="h-6 w-8 p-0"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(resource, 'down')}
                        disabled={index === resources.length - 1}
                        className="h-6 w-8 p-0"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Main action buttons */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {/* Toggle featured */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(resource)}
                        className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${resource.featured ? 'text-yellow-600' : ''}`}
                        title={resource.featured ? 'Quitar destacado' : 'Marcar como destacado'}
                      >
                        <Star className={`h-3 w-3 sm:h-4 sm:w-4 ${resource.featured ? 'fill-current' : ''}`} />
                      </Button>
                      
                      {/* Toggle active */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(resource)}
                        className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${resource.active ? 'text-green-600' : 'text-gray-600'}`}
                        title={resource.active ? 'Desactivar' : 'Activar'}
                      >
                        {resource.active ? <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />}
                      </Button>
                      
                      {/* Edit button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog(resource)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        title="Editar"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      
                      {/* Delete button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingResource(resource)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingResource ? 'Editar Recurso' : 'Agregar Recurso'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingResource 
                ? 'Modifica la información del recurso.' 
                : 'Agrega un nuevo recurso espiritual.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Tipo de recurso */}
            <div>
              <Label htmlFor="type">Tipo de Recurso</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleFormChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(resourceTypeConfig).map(([key, config]) => {
                    const SelectIconComponent = config.icon === 'Headphones' ? Headphones :
                                              config.icon === 'Video' ? Video :
                                              config.icon === 'Youtube' ? Youtube :
                                              config.icon === 'FileText' ? FileText :
                                              config.icon === 'Music' ? Music :
                                              config.icon === 'BookOpen' ? BookOpen :
                                              Video;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <SelectIconComponent className="h-4 w-4" />
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Título del recurso"
              />
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Descripción del recurso..."
                rows={3}
              />
            </div>

            {/* URL */}
            <div>
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => handleFormChange('url', e.target.value)}
                placeholder={`URL del ${resourceTypeConfig[formData.type].label.toLowerCase()}`}
              />
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-500">
                  {resourceTypeConfig[formData.type].description}
                </p>
                <details className="text-sm">
                  <summary className="text-blue-600 cursor-pointer hover:text-blue-800">
                    Ver ejemplos de URLs válidas
                  </summary>
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    {getUrlSuggestions(formData.type).map((suggestion, index) => (
                      <div key={index} className="mb-1">
                        <code className="bg-white px-1 rounded">{suggestion}</code>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>

            {/* Subida de archivo de audio */}
            {(formData.type === 'audio' || formData.type === 'podcast') && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-sm font-medium text-blue-900">
                  📁 Subir tu propio archivo de audio
                </Label>
                <p className="text-xs text-blue-700 mt-1 mb-3">
                  Sube tu archivo MP3, WAV, M4A u OGG (máximo 50MB) en lugar de usar una URL externa
                </p>
                
                {uploadingFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-blue-700">{uploadProgress}%</span>
                    </div>
                    <p className="text-xs text-blue-600">Subiendo archivo...</p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="flex-1 text-xs file:mr-2 file:py-1 file:px-2 file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white file:rounded file:cursor-pointer hover:file:bg-blue-700"
                    />
                  </div>
                )}
                
                {formData.url.includes('supabase') && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-700">
                    ✅ Archivo subido correctamente. Tu audio se reproducirá directamente en la página.
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail URL */}
            <div>
              <Label htmlFor="thumbnail_url">URL de Imagen</Label>
              <Input
                id="thumbnail_url"
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => handleFormChange('thumbnail_url', e.target.value)}
                placeholder="URL de la imagen de portada (opcional)"
              />
              {formData.type === 'youtube' && (
                <p className="text-sm text-gray-500 mt-1">
                  Se extraerá automáticamente de YouTube si está vacío
                </p>
              )}
            </div>

            {/* Preview de thumbnail */}
            {formData.thumbnail_url && (
              <div>
                <Label>Vista previa</Label>
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 mt-1">
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Opciones */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleFormChange('featured', !!checked)}
                />
                <Label htmlFor="featured" className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Marcar como destacado</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleFormChange('active', !!checked)}
                />
                <Label htmlFor="active" className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Visible en el sitio web</span>
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 pt-6">
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingResource ? 'Actualizar' : 'Crear'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingResource} onOpenChange={() => setDeletingResource(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar recurso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el recurso:
              <br />
              <strong>"{deletingResource?.title}"</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
