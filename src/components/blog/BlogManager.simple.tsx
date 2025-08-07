import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function BlogManagerSimple() {
  return (
    <div className="min-h-screen bg-gradient-peaceful p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Gestor de Blog
          </h1>
          <p className="text-muted-foreground">
            Administra y edita tus artículos espirituales
          </p>
        </div>

        {/* Contenido básico */}
        <Card className="shadow-peaceful">
          <CardHeader>
            <CardTitle>Artículos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>El gestor de blog está cargando...</p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Test Button
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
