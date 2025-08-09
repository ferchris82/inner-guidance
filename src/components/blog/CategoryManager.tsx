import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Tag,
  AlertTriangle
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
import { 
  Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory as deleteCategoryFn,
  generateSlug,
  clearLocalStorageCategories,
  initializeDefaultCategories
} from '@/utils/categories';

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías desde Supabase
  useEffect(() => {
    const initializeCategories = async () => {
      setLoading(true);
      
      // Limpiar localStorage una sola vez al cargar (migración a Supabase)
      clearLocalStorageCategories();
      
      try {
        // Inicializar categorías por defecto si no existen
        await initializeDefaultCategories();
        
        // Cargar categorías
        await loadCategories();
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeCategories();
  }, []);

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
    if (!formData.name.trim()) return;

    setIsSaving(true);
    try {
      // Verificar que el slug no exista ya (excepto para la categoría que se está editando)
      const existingCategory = categories.find(c => 
        c.slug === formData.slug && c.id !== editingCategory?.id
      );
      
      if (existingCategory) {
        toast({
          title: "⚠️ Nombre duplicado",
          description: "Ya existe una categoría con ese nombre. Elige un nombre diferente.",
          variant: "destructive",
        });
        return;
      }

      if (editingCategory) {
        // Editar categoría existente
        const updated = await updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          slug: formData.slug,
          description: formData.description.trim()
        });

        if (updated) {
          setCategories(categories.map(c => 
            c.id === editingCategory.id ? updated : c
          ));
        }
      } else {
        // Crear nueva categoría
        const newCategory = await createCategory({
          name: formData.name.trim(),
          slug: formData.slug,
          description: formData.description.trim()
        });

        if (newCategory) {
          setCategories([...categories, newCategory]);
        }
      }

      handleCloseDialog();
      
      toast({
        title: editingCategory ? "✅ Categoría actualizada" : "✅ Categoría creada",
        description: editingCategory 
          ? `La categoría "${formData.name}" ha sido actualizada correctamente.`
          : `La categoría "${formData.name}" ha sido creada correctamente.`,
      });
      
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "❌ Error al guardar",
        description: "No se pudo guardar la categoría. Revisa la consola para más detalles.",
        variant: "destructive",
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

    try {
      const success = await deleteCategoryFn(deleteCategory.id);
      
      if (success) {
        // Recargar categorías desde la base de datos
        await loadCategories();
        setDeleteCategory(null);
        
        toast({
          title: "✅ Categoría eliminada",
          description: `La categoría "${deleteCategory.name}" ha sido eliminada correctamente.`,
        });
      } else {
        toast({
          title: "❌ Error al eliminar",
          description: "No se pudo eliminar la categoría. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "❌ Error inesperado",
        description: "Ocurrió un error al eliminar la categoría. Revisa la consola para más detalles.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">
            Gestión de Categorías
          </h2>
          <p className="text-muted-foreground mt-1">
            Organiza tu contenido espiritual por temas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-aqua" disabled={loading}>
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
                />
              </div>
              <div>
                <Label htmlFor="categoryDescription">Descripción (opcional)</Label>
                <Input
                  id="categoryDescription"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descripción de la categoría"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
                Cancelar
              </Button>
              <Button onClick={handleSaveCategory} className="bg-gradient-aqua" disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Guardando...' : (editingCategory ? 'Guardar Cambios' : 'Crear Categoría')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <Card className="shadow-peaceful">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando categorías...</p>
          </CardContent>
        </Card>
      ) : (
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
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-destructive hover:bg-destructive/10"
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
                  <span className="text-sm text-muted-foreground">
                    {category.article_count || 0} artículos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <Card className="shadow-peaceful">
          <CardContent className="p-12 text-center">
            <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-primary mb-2">
              No hay categorías
            </h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primera categoría para organizar tu contenido espiritual
            </p>
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-aqua">
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
              Esta acción no se puede deshacer.
              {deleteCategory?.article_count && deleteCategory.article_count > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  ⚠️ Esta categoría tiene {deleteCategory.article_count} artículos asociados.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCategory}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar Categoría
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
