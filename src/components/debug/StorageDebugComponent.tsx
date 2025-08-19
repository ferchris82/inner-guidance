import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { setupImageStorage, testImageUpload } from '@/utils/storageSetup';

interface StorageStatus {
  bucketsAvailable: string[];
  imagesBucketExists: boolean;
  isPublic: boolean;
  canUpload: boolean;
  error?: string;
}

export const StorageDebugComponent: React.FC = () => {
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const checkStorageStatus = async () => {
    setLoading(true);
    try {
      // Verificar buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        setStatus({
          bucketsAvailable: [],
          imagesBucketExists: false,
          isPublic: false,
          canUpload: false,
          error: `Error conectando con Storage: ${bucketsError.message}`
        });
        return;
      }

      const bucketNames = buckets?.map(b => b.name) || [];
      const imagesBucket = buckets?.find(b => b.name === 'images');
      
      // Verificar si puede subir (test de upload)
      let canUpload = false;
      if (imagesBucket) {
        const uploadTest = await testImageUpload();
        canUpload = uploadTest.success;
      }

      setStatus({
        bucketsAvailable: bucketNames,
        imagesBucketExists: !!imagesBucket,
        isPublic: imagesBucket?.public || false,
        canUpload,
        error: imagesBucket ? undefined : 'Bucket "images" no encontrado'
      });

    } catch (error) {
      setStatus({
        bucketsAvailable: [],
        imagesBucketExists: false,
        isPublic: false,
        canUpload: false,
        error: `Error inesperado: ${error}`
      });
    } finally {
      setLoading(false);
    }
  };

  const createImagesBucket = async () => {
    setCreating(true);
    try {
      const result = await setupImageStorage();
      if (result.success) {
        await checkStorageStatus();
        alert('✅ Bucket creado exitosamente!');
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Error inesperado: ${error}`);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    checkStorageStatus();
  }, []);

  return (
    <Card className="max-w-2xl mx-auto m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Diagnóstico de Supabase Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkStorageStatus} disabled={loading} variant="outline">
            {loading ? 'Verificando...' : 'Verificar Estado'}
          </Button>
          {status && !status.imagesBucketExists && (
            <Button onClick={createImagesBucket} disabled={creating}>
              {creating ? 'Creando...' : 'Crear Bucket "images"'}
            </Button>
          )}
        </div>

        {status && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">📊 Estado Actual:</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>Buckets disponibles:</strong> {status.bucketsAvailable.length > 0 ? status.bucketsAvailable.join(', ') : 'Ninguno'}
                </li>
                <li>
                  <strong>Bucket "images" existe:</strong> 
                  <span className={status.imagesBucketExists ? 'text-green-600' : 'text-red-600'}>
                    {status.imagesBucketExists ? ' ✅ Sí' : ' ❌ No'}
                  </span>
                </li>
                <li>
                  <strong>Es público:</strong> 
                  <span className={status.isPublic ? 'text-green-600' : 'text-red-600'}>
                    {status.isPublic ? ' ✅ Sí' : ' ❌ No'}
                  </span>
                </li>
                <li>
                  <strong>Puede subir imágenes:</strong> 
                  <span className={status.canUpload ? 'text-green-600' : 'text-red-600'}>
                    {status.canUpload ? ' ✅ Sí' : ' ❌ No'}
                  </span>
                </li>
              </ul>
            </div>

            {status.error && (
              <div className="p-3 bg-red-50 text-red-800 rounded">
                <strong>❌ Error:</strong> {status.error}
              </div>
            )}

            {!status.imagesBucketExists && (
              <div className="p-3 bg-yellow-50 text-yellow-800 rounded">
                <h4 className="font-medium mb-2">🔧 Instrucciones para crear el bucket:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Ve a <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 underline">Supabase Dashboard</a></li>
                  <li>Selecciona tu proyecto</li>
                  <li>Ve a Storage en el menú lateral</li>
                  <li>Haz clic en "Create a new bucket"</li>
                  <li>Nombre: <code className="bg-gray-200 px-1 rounded">images</code></li>
                  <li>Marcar como <strong>Public bucket</strong></li>
                  <li>File size limit: <code className="bg-gray-200 px-1 rounded">5242880</code> (5MB)</li>
                  <li>Allowed MIME types: <code className="bg-gray-200 px-1 rounded">image/jpeg,image/jpg,image/png,image/gif,image/webp</code></li>
                </ol>
              </div>
            )}

            {status.imagesBucketExists && !status.canUpload && (
              <div className="p-3 bg-orange-50 text-orange-800 rounded">
                <h4 className="font-medium mb-2">🔐 Configurar políticas RLS:</h4>
                <p className="text-sm mb-2">El bucket existe pero no puedes subir. Necesitas configurar las políticas:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Ve a Storage → Policies en Supabase</li>
                  <li>Crea políticas para el bucket "images"</li>
                  <li>Política SELECT: Acceso público</li>
                  <li>Política INSERT: Usuarios autenticados</li>
                </ol>
              </div>
            )}

            {status.canUpload && (
              <div className="p-3 bg-green-50 text-green-800 rounded">
                <strong>🎉 ¡Todo configurado correctamente!</strong> Ya puedes subir imágenes.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
