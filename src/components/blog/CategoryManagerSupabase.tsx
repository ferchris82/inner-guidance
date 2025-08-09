import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Tag,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { 
  Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory as deleteCategoryAPI,
  generateSlug,
  isSlugAvailable,
  syncToLocalStorage
} from '@/utils/categoriesSupabase';

export function CategoryManagerSupabase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const { toast } = useToast();

  // Monitorear conexión a internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: "Error al cargar categorías",
          description: "Se están mostrando las categorías en cache. Verifica tu conexión.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [toast]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error al cargar categorías",
        description: "Se están mostrando las categorías en cache. Verifica tu conexión.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nombre requerido",
        description: "El nombre de la categoría es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (!isOnline) {
      toast({
        title: "Sin conexión",
        description: "Necesitas conexión a internet para guardar cambios",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);

      // Verificar que el slug no exista ya (excepto para la categoría que se está editando)
      const slugAvailable = await isSlugAvailable(formData.slug, editingCategory?.id);
      if (!slugAvailable) {
        toast({
          title: "Nombre duplicado",
          description: "Ya existe una categoría con ese nombre",
          variant: "destructive"
        });
        return;
      }

      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug,
        description: formData.description.trim()
      };

      if (editingCategory) {
        // Editar categoría existente
        await updateCategory(editingCategory.id, categoryData);
        toast({
          title: "Categoría actualizada",
          description: `"${categoryData.name}" ha sido actualizada correctamente`,
        });
      } else {
        // Crear nueva categoría
        await createCategory(categoryData);
        toast({
          title: "Categoría creada",
          description: `"${categoryData.name}" ha sido creada correctamente`,
        });
      }

      // Recargar categorías
      await loadCategories();
      handleCloseDialog();

    } catch (error: unknown) {
      console.error('Error saving category:', error);
      toast({
        title: "Error al guardar",
        description: error instanceof Error ? error.message : "Hubo un problema al guardar la categoría",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteCategory(category);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategory) return;

    if (!isOnline) {
      toast({
        title: "Sin conexión",
        description: "Necesitas conexión a internet para eliminar categorías",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCategoryAPI(deleteCategory.id);
      
      toast({
        title: "Categoría eliminada",
        description: `"${deleteCategory.name}" ha sido eliminada correctamente`,
      });

      // Recargar categorías
      await loadCategories();
      setDeleteCategory(null);

    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "Hubo un problema al eliminar la categoría",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    await loadCategories();
    toast({
      title: "Categorías actualizadas",
      description: "Se han recargado las categorías desde el servidor",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary flex items-center">
            <Database className="w-8 h-8 mr-3" />
            Gestión de Categorías
          </h2>
          <p className="text-muted-foreground mt-1 flex items-center">
            <span>Organiza tu contenido espiritual por temas</span>
            <span className="ml-4 flex items-center">
              {isOnline ? (
                <><Wifi className="w-4 h-4 mr-1 text-green-600" /> Conectado</>
              ) : (
                <><WifiOff className="w-4 h-4 mr-1 text-red-600" /> Sin conexión</>
              )}
            </span>
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading || !isOnline}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => handleOpenDialog()} 
                className="bg-gradient-aqua"
                disabled={!isOnline}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Nombre</Label>
                  <Input
                    id="categoryName"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej: Crecimiento Espiritual"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label htmlFor="categorySlug">URL Slug</Label>
                  <Input
                    id="categorySlug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="crecimiento-espiritual"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Descripción (opcional)</Label>
                  <Input
                    id="categoryDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Breve descripción de la categoría"
                    disabled={isSaving}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveCategory} 
                  className="bg-gradient-aqua"
                  disabled={isSaving || !isOnline}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connection Warning */}
      {!isOnline && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <WifiOff className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <p className="font-medium text-orange-800">Modo sin conexión</p>
                <p className="text-sm text-orange-600">
                  Mostrando datos en cache. Algunas funciones están deshabilitadas hasta recuperar la conexión.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">
                    {category.name}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog(category)}
                    disabled={!isOnline}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-destructive hover:bg-destructive/10"
                    disabled={!isOnline}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {category.description || 'Sin descripción'}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {category.slug}
                  </Badge>
                  {category.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(category.created_at).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="shadow-peaceful">
          <CardContent className="p-12 text-center">
            <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-primary mb-2">
              No hay categorías
            </h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primera categoría para organizar tu contenido espiritual
            </p>
            <Button 
              onClick={() => handleOpenDialog()} 
              className="bg-gradient-aqua"
              disabled={!isOnline}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Categoría
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
              Confirmar Eliminación
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar la categoría "{deleteCategory?.name}"? 
              Esta acción no se puede deshacer y podría afectar artículos existentes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCategory}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting || !isOnline}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar Categoría
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
