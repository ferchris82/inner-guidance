import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Calendar, 
  User, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  Trash2,
  AlertCircle,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  getAllContactMessages, 
  markMessageAsRead, 
  markMessageAsResponded, 
  deleteContactMessage,
  ContactMessage 
} from "@/services/contactSupabase";
import { useToast } from "@/hooks/use-toast";

export function ContactMessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes de contacto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    
    // Marcar como leído si está como nuevo
    if (message.status === 'nuevo') {
      await markMessageAsRead(message.id!);
      // Actualizar estado local
      setMessages(prev => 
        prev.map(m => 
          m.id === message.id 
            ? { ...m, status: 'leido' as const }
            : m
        )
      );
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    const success = await markMessageAsRead(messageId);
    if (success) {
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId 
            ? { ...m, status: 'leido' as const }
            : m
        )
      );
      toast({
        title: "✅ Mensaje marcado como leído",
        description: "El estado del mensaje se ha actualizado",
      });
    } else {
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar el estado del mensaje",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsResponded = async (messageId: string) => {
    const success = await markMessageAsResponded(messageId);
    if (success) {
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId 
            ? { ...m, status: 'respondido' as const }
            : m
        )
      );
      toast({
        title: "✅ Mensaje marcado como respondido",
        description: "El estado del mensaje se ha actualizado correctamente",
      });
      setIsModalOpen(false);
    } else {
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar el estado del mensaje",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMessage = (message: ContactMessage) => {
    setDeleteMessage(message);
  };

  const confirmDeleteMessage = async () => {
    if (!deleteMessage) return;
    
    console.log('🗑️ ContactMessagesManager: Attempting to delete message:', deleteMessage.id);
    
    try {
      const success = await deleteContactMessage(deleteMessage.id!);
      console.log('🗑️ Delete operation result:', success);
      
      if (success) {
        // Recargar mensajes desde la base de datos para asegurar sincronización
        await loadMessages();
        setDeleteMessage(null);
        toast({
          title: "✅ Mensaje eliminado",
          description: "El mensaje se ha eliminado correctamente",
        });
        setIsModalOpen(false);
      } else {
        toast({
          title: "❌ Error al eliminar",
          description: "No se pudo eliminar el mensaje. Revisa la consola para más detalles.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "❌ Error inesperado",
        description: "Ocurrió un error al eliminar el mensaje. Revisa la consola para más detalles.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    switch (status) {
      case 'nuevo':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Nuevo</Badge>;
      case 'leido':
        return <Badge variant="secondary"><Eye className="w-3 h-3 mr-1" />Leído</Badge>;
      case 'respondido':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Respondido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceName = (service: string) => {
    const services: { [key: string]: string } = {
      'consulta': 'Consulta Espiritual Personal',
      'mentoria': 'Mentoría Espiritual',
      'conferencia': 'Conferencias y Talleres',
      'recursos': 'Recursos Escritos',
      'otro': 'Otro',
      'Sin especificar': 'Sin especificar'
    };
    return services[service] || service;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-peaceful p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Cargando mensajes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Mensajes de Contacto
          </h1>
          <p className="text-muted-foreground">
            Administra los mensajes recibidos a través del formulario de contacto
          </p>
        </div>

        {messages.length === 0 ? (
          <Card className="shadow-peaceful">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-heading font-semibold mb-2 text-muted-foreground">
                No hay mensajes
              </h3>
              <p className="text-muted-foreground">
                Los mensajes de contacto aparecerán aquí cuando los visitantes envíen el formulario.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <Card key={message.id} className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-gradient-golden p-2 rounded-full">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-heading font-semibold text-primary">
                            {message.name}
                          </h3>
                          {getStatusBadge(message.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{message.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(message.created_at!)}</span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <Badge variant="outline" className="text-xs">
                            {getServiceName(message.service)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => handleViewMessage(message)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver completo
                      </Button>
                      
                      {message.status === 'nuevo' && (
                        <Button
                          onClick={() => handleMarkAsRead(message.id!)}
                          variant="secondary"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar leído
                        </Button>
                      )}
                      
                      {message.status !== 'respondido' && (
                        <Button
                          onClick={() => handleMarkAsResponded(message.id!)}
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Respondido
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleDeleteMessage(message)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal para ver mensaje completo */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            {selectedMessage && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <span>Mensaje de {selectedMessage.name}</span>
                    {getStatusBadge(selectedMessage.status)}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-primary">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Servicio de interés</Label>
                      <p className="text-primary">{getServiceName(selectedMessage.service)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Fecha</Label>
                    <p className="text-primary">{formatDate(selectedMessage.created_at!)}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Mensaje</Label>
                    <div className="bg-muted/20 p-4 rounded-lg mt-2">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    {selectedMessage.status !== 'respondido' && (
                      <Button
                        onClick={() => handleMarkAsResponded(selectedMessage.id!)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como respondido
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteMessage(selectedMessage)}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* AlertDialog para confirmar eliminación */}
        <AlertDialog open={!!deleteMessage} onOpenChange={() => setDeleteMessage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 text-destructive mr-2" />
                Confirmar Eliminación
              </AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro que deseas eliminar el mensaje de "{deleteMessage?.name}"? 
                Esta acción no se puede deshacer.
                <div className="mt-2 p-3 bg-muted rounded text-sm">
                  <strong>Email:</strong> {deleteMessage?.email}<br />
                  <strong>Asunto:</strong> {deleteMessage?.service}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteMessage}
                className="bg-destructive hover:bg-destructive/90"
              >
                Eliminar Mensaje
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
