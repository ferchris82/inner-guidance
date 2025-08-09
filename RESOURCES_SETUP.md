# Gestión de Recursos - Instrucciones de Setup

## 📋 Instrucciones para crear la tabla de recursos

### 1. **Ejecutar Script SQL en Supabase**

1. Ve a tu panel de Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto `inner-guidance`
3. Ve a la sección **SQL Editor** en el menú lateral
4. Crea un nuevo query y copia/pega el contenido del archivo `sql/create_resources_table.sql`
5. Ejecuta el script haciendo clic en **RUN**

### 2. **Verificar la tabla creada**

Después de ejecutar el script, puedes verificar que todo está correcto:

```sql
-- Verificar que la tabla existe
SELECT * FROM resources ORDER BY order_index;

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'resources';

-- Verificar índices
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'resources';
```

### 3. **Estructura de la tabla `resources`**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único (auto-generado) |
| `title` | TEXT | Título del recurso |
| `description` | TEXT | Descripción del recurso |
| `type` | TEXT | Tipo: podcast, youtube, pdf, audio, video_series, study |
| `url` | TEXT | URL del recurso |
| `thumbnail_url` | TEXT | URL de la imagen de portada (opcional) |
| `featured` | BOOLEAN | Si está destacado |
| `active` | BOOLEAN | Si está activo/visible |
| `order_index` | INTEGER | Orden de visualización |
| `metadata` | JSONB | Metadatos específicos del tipo |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

### 4. **Tipos de recursos soportados**

- **`podcast`**: Enlaces de Spotify, Apple Podcasts, Google Podcasts, etc.
- **`youtube`**: Videos individuales de YouTube
- **`video_series`**: Playlists de YouTube o series de videos
- **`pdf`**: Documentos PDF, guías, estudios
- **`audio`**: Archivos de audio, meditaciones
- **`study`**: Estudios bíblicos estructurados

### 5. **Funcionalidades incluidas**

✅ **CRUD Completo**: Crear, leer, actualizar, eliminar recursos  
✅ **Reordenamiento**: Cambiar el orden de visualización  
✅ **Estados**: Activar/desactivar, destacar recursos  
✅ **Validación de URLs**: Verificar que las URLs sean correctas según el tipo  
✅ **Extracción automática**: Thumbnails de YouTube automáticos  
✅ **Metadatos flexibles**: Campo JSON para información específica  
✅ **Políticas RLS**: Seguridad a nivel de fila configurada  
✅ **Triggers**: Actualización automática de `updated_at`  

### 6. **Datos de ejemplo**

El script incluye 4 recursos de ejemplo:
- Guía de Oración Profética (PDF, destacado)
- Serie: Descubriendo tu Propósito (Video series)
- Estudio Bíblico: Identidad en Cristo (Estudio)
- Meditaciones Guiadas (Audio)

### 7. **Uso en el frontend**

Una vez ejecutado el SQL, puedes:

1. **Ir al Admin Dashboard** → Sección "Recursos"
2. **Crear nuevos recursos** de podcasts y videos de YouTube
3. **Gestionar el orden** y destacados
4. **Ver los recursos** en la sección pública del sitio

### 8. **Notas de seguridad**

- **RLS habilitado**: La tabla usa Row Level Security
- **Políticas configuradas**: Acceso público para lectura, acceso completo para admin
- **En producción**: Deberías implementar autenticación adecuada y ajustar las políticas

---

## 🚀 Una vez ejecutado el SQL, ya puedes:

1. **Acceder al admin**: `http://localhost:8080/admin`
2. **Ir a Recursos**: Hacer clic en la nueva sección "Recursos"
3. **Crear tu primer podcast o video**: Usar el botón "Nuevo Recurso"
4. **Ver en la web**: Los recursos aparecerán en la sección de recursos del sitio

¡Disfruta gestionando tu contenido espiritual! 🙏✨
