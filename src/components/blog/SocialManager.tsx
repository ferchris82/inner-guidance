import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  MessageCircle, 
  Twitter, 
  Linkedin,
  Globe,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { SocialLink, getSocialLinks, saveSocialLinks, updateSocialLink, addSocialLink, deleteSocialLink } from '@/utils/socialStorage';

const iconOptions = [
  { value: 'Instagram', label: 'Instagram', icon: Instagram },
  { value: 'Youtube', label: 'YouTube', icon: Youtube },
  { value: 'Facebook', label: 'Facebook', icon: Facebook },
  { value: 'MessageCircle', label: 'WhatsApp', icon: MessageCircle },
  { value: 'Twitter', label: 'Twitter', icon: Twitter },
  { value: 'Linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'Globe', label: 'Sitio Web', icon: Globe },
];

export function SocialManager() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLink, setNewLink] = useState<Omit<SocialLink, 'id'>>({
    platform: '',
    url: '',
    icon: 'Instagram',
    isActive: true,
    order: 1
  });

  // Cargar redes sociales al montar el componente
  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = () => {
    const links = getSocialLinks();
    setSocialLinks(links.sort((a, b) => a.order - b.order));
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink({ ...link });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (editingLink) {
      updateSocialLink(editingLink.id, editingLink);
      setEditingLink(null);
      loadSocialLinks();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta red social?')) {
      deleteSocialLink(id);
      loadSocialLinks();
    }
  };

  const handleAddNew = () => {
    if (newLink.platform && newLink.url) {
      const maxOrder = Math.max(...socialLinks.map(link => link.order), 0);
      addSocialLink({
        ...newLink,
        order: maxOrder + 1
      });
      setNewLink({
        platform: '',
        url: '',
        icon: 'Instagram',
        isActive: true,
        order: 1
      });
      setIsAddingNew(false);
      loadSocialLinks();
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateSocialLink(id, { isActive });
    loadSocialLinks();
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newLinks = [...socialLinks];
      const currentLink = newLinks[index];
      const previousLink = newLinks[index - 1];
      
      // Intercambiar orders
      const tempOrder = currentLink.order;
      currentLink.order = previousLink.order;
      previousLink.order = tempOrder;
      
      // Actualizar en storage
      updateSocialLink(currentLink.id, { order: currentLink.order });
      updateSocialLink(previousLink.id, { order: previousLink.order });
      
      loadSocialLinks();
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < socialLinks.length - 1) {
      const newLinks = [...socialLinks];
      const currentLink = newLinks[index];
      const nextLink = newLinks[index + 1];
      
      // Intercambiar orders
      const tempOrder = currentLink.order;
      currentLink.order = nextLink.order;
      nextLink.order = tempOrder;
      
      // Actualizar en storage
      updateSocialLink(currentLink.id, { order: currentLink.order });
      updateSocialLink(nextLink.id, { order: nextLink.order });
      
      loadSocialLinks();
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Globe;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            Gestión de Redes Sociales
          </h2>
          <p className="text-muted-foreground">
            Configura los enlaces a tus redes sociales que aparecen en la página principal
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingNew(true)}
          className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Red Social
        </Button>
      </div>

      {/* Formulario para agregar nueva red social */}
      {isAddingNew && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Agregar Nueva Red Social</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-platform">Nombre de la Plataforma</Label>
                <Input
                  id="new-platform"
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                  placeholder="Ej: Instagram, YouTube, etc."
                />
              </div>
              <div>
                <Label htmlFor="new-icon">Icono</Label>
                <Select
                  value={newLink.icon}
                  onValueChange={(value) => setNewLink({ ...newLink, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar icono" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="new-url">URL</Label>
              <Input
                id="new-url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newLink.isActive}
                onCheckedChange={(checked) => setNewLink({ ...newLink, isActive: checked })}
              />
              <Label>Mostrar en la página principal</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddNew}>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de redes sociales existentes */}
      <div className="grid gap-4">
        {socialLinks.map((link, index) => {
          const IconComponent = getIconComponent(link.icon);
          const isEditing = editingLink?.id === link.id;

          return (
            <Card key={link.id} className={`${link.isActive ? 'border-green-200' : 'border-gray-200'}`}>
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre de la Plataforma</Label>
                        <Input
                          value={editingLink.platform}
                          onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Icono</Label>
                        <Select
                          value={editingLink.icon}
                          onValueChange={(value) => setEditingLink({ ...editingLink, icon: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center space-x-2">
                                  <option.icon className="w-4 h-4" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={editingLink.url}
                        onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingLink.isActive}
                        onCheckedChange={(checked) => setEditingLink({ ...editingLink, isActive: checked })}
                      />
                      <Label>Mostrar en la página principal</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button variant="outline" onClick={() => setEditingLink(null)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-spiritual p-3 rounded-full">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{link.platform}</h3>
                        <p className="text-sm text-muted-foreground break-all">{link.url}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={link.isActive ? "default" : "secondary"}>
                            {link.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Orden: {link.order}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === socialLinks.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                      <Switch
                        checked={link.isActive}
                        onCheckedChange={(checked) => handleToggleActive(link.id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(link)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {socialLinks.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="p-12 text-center">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay redes sociales configuradas</h3>
            <p className="text-muted-foreground mb-4">
              Agrega tus primeras redes sociales para que aparezcan en la página principal
            </p>
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primera Red Social
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
