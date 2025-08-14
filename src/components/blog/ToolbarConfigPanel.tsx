import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings2, ArrowUp, ArrowDown } from 'lucide-react';
import { EditorConfig } from '@/utils/editorConfig';

interface ToolbarConfigPanelProps {
  config: EditorConfig;
  onConfigChange: (config: EditorConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ToolbarConfigPanel({ config, onConfigChange, isOpen, onToggle }: ToolbarConfigPanelProps) {
  const handlePositionChange = (position: string) => {
    const newConfig = { ...config, toolbarPosition: position as EditorConfig['toolbarPosition'] };
    onConfigChange(newConfig);
  }

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'top': return <ArrowUp className="w-4 h-4" />;
      case 'bottom': return <ArrowDown className="w-4 h-4" />;
      case 'floating': return <span className="w-4 h-4 inline-block">🪄</span>;
      default: return <ArrowUp className="w-4 h-4" />;
    }
  }

  const getPositionDescription = (position: string) => {
    switch (position) {
      case 'top': return 'Herramientas arriba del editor (clásica)';
      case 'bottom': return 'Herramientas abajo del editor';
      case 'floating': return 'Herramientas flotantes (siempre visibles arriba mientras editas)';
      default: return '';
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        <Settings2 className="w-4 h-4" />
        Configurar Herramientas
      </Button>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#20B2AA]" />
          Posición de Herramientas
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Posición de la toolbar */}
        <div className="space-y-2">
          <Select value={config.toolbarPosition} onValueChange={handlePositionChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" />
                  Arriba
                </div>
              </SelectItem>
              <SelectItem value="bottom">
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-4 h-4" />
                  Abajo
                </div>
              </SelectItem>
              <SelectItem value="floating">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 inline-block">🪄</span>
                  Flotante
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vista previa de configuración actual */}
        <div className="p-3 bg-blue-50 rounded-md border">
          <p className="text-xs text-gray-600 mb-2">Configuración actual:</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              {getPositionIcon(config.toolbarPosition)}
              {config.toolbarPosition === 'top' && 'Arriba'}
              {config.toolbarPosition === 'bottom' && 'Abajo'}
              {config.toolbarPosition === 'floating' && 'Flotante'}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {getPositionDescription(config.toolbarPosition)}
          </p>
        </div>
      </div>
    </div>
  );
}
// Archivo eliminado: panel de configuración de toolbar ya no es necesario.
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings2, ArrowUp, ArrowDown } from 'lucide-react';
import { EditorConfig } from '@/utils/editorConfig';

interface ToolbarConfigPanelProps {
  config: EditorConfig;
  onConfigChange: (config: EditorConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ToolbarConfigPanel({ config, onConfigChange, isOpen, onToggle }: ToolbarConfigPanelProps) {
  const handlePositionChange = (position: string) => {
    const newConfig = { ...config, toolbarPosition: position as EditorConfig['toolbarPosition'] };
    onConfigChange(newConfig);
  }

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'top': return <ArrowUp className="w-4 h-4" />;
      case 'bottom': return <ArrowDown className="w-4 h-4" />;
      case 'floating': return <span className="w-4 h-4 inline-block">🪄</span>;
      default: return <ArrowUp className="w-4 h-4" />;
    }
  }

  const getPositionDescription = (position: string) => {
    switch (position) {
      case 'top': return 'Herramientas arriba del editor (clásica)';
      case 'bottom': return 'Herramientas abajo del editor';
      case 'floating': return 'Herramientas flotantes (siempre visibles arriba mientras editas)';
      default: return '';
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-2"
      >
        <Settings2 className="w-4 h-4" />
        Configurar Herramientas
      </Button>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#20B2AA]" />
          Posición de Herramientas
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Posición de la toolbar */}
        <div className="space-y-2">
          <Select value={config.toolbarPosition} onValueChange={handlePositionChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" />
                  Arriba
                </div>
              </SelectItem>
              <SelectItem value="bottom">
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-4 h-4" />
                  Abajo
                </div>
              </SelectItem>
              <SelectItem value="floating">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 inline-block">🪄</span>
                  Flotante
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vista previa de configuración actual */}
        <div className="p-3 bg-blue-50 rounded-md border">
          <p className="text-xs text-gray-600 mb-2">Configuración actual:</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              {getPositionIcon(config.toolbarPosition)}
              {config.toolbarPosition === 'top' && 'Arriba'}
              {config.toolbarPosition === 'bottom' && 'Abajo'}
              {config.toolbarPosition === 'floating' && 'Flotante'}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {getPositionDescription(config.toolbarPosition)}
          </p>
        </div>
      </div>
    </div>
  );
}
