import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings2, Monitor, ArrowUp, ArrowDown, Layers, MousePointer } from 'lucide-react';
import { getEditorConfig, saveEditorConfig, EditorConfig } from '@/utils/editorConfig';
import { useToast } from '@/components/ui/use-toast';

interface EditorConfigManagerProps {
  onConfigChange?: (config: EditorConfig) => void;
}

export function EditorConfigManager({ onConfigChange }: EditorConfigManagerProps) {
  const [config, setConfig] = useState<EditorConfig>(getEditorConfig());
  const { toast } = useToast();

  useEffect(() => {
    const currentConfig = getEditorConfig();
    setConfig(currentConfig);
  }, []);

  const handleConfigChange = (newConfig: EditorConfig) => {
    setConfig(newConfig);
    saveEditorConfig(newConfig);
    onConfigChange?.(newConfig);
    
    toast({
      title: "✅ Configuración guardada",
      description: "Los cambios se aplicarán en el próximo artículo que edites",
      duration: 3000,
    });
  };

  const handlePositionChange = (position: string) => {
    const newConfig = { ...config, toolbarPosition: position as EditorConfig['toolbarPosition'] };
    handleConfigChange(newConfig);
  };

  const handleSideChange = (side: string) => {
    const newConfig = { ...config, toolbarSide: side as EditorConfig['toolbarSide'] };
    handleConfigChange(newConfig);
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'top': return <ArrowUp className="w-4 h-4" />;
      case 'bottom': return <ArrowDown className="w-4 h-4" />;
      case 'floating-top': return <Layers className="w-4 h-4" />;
      case 'floating-bottom': return <MousePointer className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getPositionDescription = (position: string) => {
    switch (position) {
      case 'top': return 'Barra integrada arriba del editor (clásica)';
      case 'bottom': return 'Barra integrada debajo del editor';
      case 'floating-top': return 'Barra flotante en la parte superior';
      case 'floating-bottom': return 'Barra flotante en la parte inferior';
      default: return '';
    }
  };

  const isFloating = config.toolbarPosition.includes('floating');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-[#20B2AA]" />
          Configuración del Editor
        </CardTitle>
        <p className="text-sm text-gray-600">
          Personaliza la posición de las herramientas del editor de artículos
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Posición de la barra */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Posición de la barra de herramientas</Label>
          <Select value={config.toolbarPosition} onValueChange={handlePositionChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" />
                  Arriba (Clásica)
                </div>
              </SelectItem>
              <SelectItem value="bottom" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-4 h-4" />
                  Abajo (Integrada)
                </div>
              </SelectItem>
              <SelectItem value="floating-top" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Flotante Superior
                </div>
              </SelectItem>
              <SelectItem value="floating-bottom" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4" />
                  Flotante Inferior
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            {getPositionIcon(config.toolbarPosition)}
            <span className="text-sm text-gray-700">
              {getPositionDescription(config.toolbarPosition)}
            </span>
          </div>
        </div>

        {/* Alineación para barras flotantes */}
        {isFloating && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Alineación horizontal</Label>
            <Select value={config.toolbarSide} onValueChange={handleSideChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Izquierda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Derecha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Vista previa de configuración actual */}
        <div className="p-4 border rounded-lg bg-blue-50">
          <h4 className="font-medium text-sm mb-2">Configuración actual:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getPositionIcon(config.toolbarPosition)}
              {config.toolbarPosition.replace('-', ' ')}
            </Badge>
            {isFloating && (
              <Badge variant="outline">
                Alineado: {config.toolbarSide}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 Los cambios se aplicarán automáticamente cuando abras el editor de artículos
          </p>
        </div>

        {/* Botón para resetear configuración */}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleConfigChange({ toolbarPosition: 'top', toolbarSide: 'center' })}
            className="w-full"
          >
            Restaurar configuración por defecto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
