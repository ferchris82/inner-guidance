import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

interface ArticlePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    read_time: string;
    featured_image?: string;
    created_at?: string;
  };
  categoryName?: string;
  onEdit?: () => void;
  onSaveBeforePreview?: () => Promise<void>;
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({
  open,
  onOpenChange,
  article,
  categoryName,
  onEdit,
  onSaveBeforePreview,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Enfoque automático al abrir
  useEffect(() => {
    if (open && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [open]);

  // Atajo Ctrl+P para abrir/cerrar
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-0 overflow-hidden dark:bg-neutral-900"
        aria-label="Vista previa del artículo"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <DialogHeader className="p-6 pb-2 border-b bg-background">
          <DialogTitle className="text-2xl font-bold">Vista Previa del Artículo</DialogTitle>
        </DialogHeader>
        <button
          ref={closeBtnRef}
          aria-label="Cerrar vista previa"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 dark:bg-neutral-800 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => onOpenChange(false)}
        >
          <span aria-hidden>×</span>
        </button>
        <div className="overflow-y-auto p-6 sm:p-10 flex-1">
          {article.featured_image && (
            <img
              src={article.featured_image}
              alt="Imagen destacada"
              className="w-full max-h-72 object-cover rounded-xl mb-6"
              style={{ background: '#f3f3f3' }}
            />
          )}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {article.author && <span>👤 {article.author}</span>}
            {article.created_at && <span>📅 {new Date(article.created_at).toLocaleDateString()}</span>}
            {categoryName && <span>🏷️ {categoryName}</span>}
            {article.read_time && <span>⏱️ {article.read_time}</span>}
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-primary dark:text-primary-400">{article.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>
          <div className="prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        <div className="flex justify-end gap-2 p-4 border-t bg-background">
          <button
            onClick={async () => {
              if (onSaveBeforePreview) {
                await onSaveBeforePreview();
              }
              onOpenChange(false);
            }}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Guardar artículo
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onOpenChange(false);
                onEdit();
              }}
              className="px-4 py-2 rounded bg-muted text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Editar
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
