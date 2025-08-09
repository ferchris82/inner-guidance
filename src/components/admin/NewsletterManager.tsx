import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Users, 
  TrendingUp, 
  Search, 
  Trash2,
  UserMinus,
  Download,
  UserCheck,
  CalendarDays
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getAllSubscribers,
  getSubscriberStats,
  unsubscribeFromNewsletter,
  deleteSubscriber,
  NewsletterSubscriber
} from '@/services/newsletterSupabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const { toast } = useToast();

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [subscribersData, statsData] = await Promise.all([
        getAllSubscribers(),
        getSubscriberStats()
      ]);
      
      setSubscribers(subscribersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de suscriptores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtrar suscriptores
  useEffect(() => {
    let filtered = subscribers;
    
    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }
    
    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSubscribers(filtered);
  }, [subscribers, searchTerm, statusFilter]);

  // Desuscribir usuario
  const handleUnsubscribe = async (id: string, email: string) => {
    try {
      const success = await unsubscribeFromNewsletter(id);
      if (success) {
        toast({
          title: "Usuario desuscrito",
          description: `${email} ha sido desuscrito del newsletter`
        });
        loadData();
      } else {
        throw new Error('Error desuscribiendo');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo desuscribir al usuario",
        variant: "destructive"
      });
    }
  };

  // Eliminar suscriptor
  const handleDelete = async (id: string, email: string) => {
    try {
      const success = await deleteSubscriber(id);
      if (success) {
        toast({
          title: "Suscriptor eliminado",
          description: `${email} ha sido eliminado permanentemente`
        });
        loadData();
      } else {
        throw new Error('Error eliminando');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el suscriptor",
        variant: "destructive"
      });
    }
  };

  // Exportar suscriptores
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Estado,Fecha Suscripción,Fuente\n"
      + filteredSubscribers.map(sub => 
          `${sub.email},${sub.status},${new Date(sub.subscribed_at || '').toLocaleDateString()},${sub.source}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "suscriptores_newsletter.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportación exitosa",
      description: `Se exportaron ${filteredSubscribers.length} suscriptores`
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando suscriptores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-2">
          Gestión de Newsletter
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Administra los suscriptores de tu newsletter espiritual
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-gradient-golden p-2 sm:p-3 rounded-full">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Suscriptores</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 sm:p-3 rounded-full">
                  <UserCheck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Activos</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="sm:col-span-2 md:col-span-1">
          <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 sm:p-3 rounded-full">
                  <UserMinus className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Desuscritos</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.unsubscribed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Controles */}
      <Card className="shadow-peaceful">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 items-start justify-between">
            <div className="flex flex-col w-full gap-3 sm:gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'unsubscribed')}
                className="px-3 sm:px-4 py-2 border border-border rounded-md bg-background text-sm w-full sm:w-auto"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo activos</option>
                <option value="unsubscribed">Solo desuscritos</option>
              </select>
            </div>
            
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2 w-full sm:w-auto text-sm">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de suscriptores */}
      <Card className="shadow-peaceful">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            Suscriptores ({filteredSubscribers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {filteredSubscribers.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredSubscribers.map((subscriber) => (
                <motion.div
                  key={subscriber.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-peaceful rounded-lg gap-3 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <p className="font-medium text-sm sm:text-base truncate">{subscriber.email}</p>
                      <Badge 
                        variant={subscriber.status === 'active' ? 'default' : 'destructive'}
                        className={`text-xs w-fit ${subscriber.status === 'active' ? 'bg-green-100 text-green-800' : ''}`}
                      >
                        {subscriber.status === 'active' ? 'Activo' : 'Desuscrito'}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        <span>Suscrito: {formatDate(subscriber.subscribed_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Fuente: {subscriber.source}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {subscriber.status === 'active' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs">
                            <UserMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline ml-1">Desuscribir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="mx-4 w-full sm:max-w-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg">Desuscribir usuario</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              ¿Estás seguro de que quieres desuscribir a {subscriber.email}? 
                              Esta acción se puede revertir.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleUnsubscribe(subscriber.id!, subscriber.email)}
                              className="w-full sm:w-auto"
                            >
                              Desuscribir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar suscriptor</AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de que quieres eliminar permanentemente a {subscriber.email}? 
                            Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(subscriber.id!, subscriber.email)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron suscriptores</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground mt-2">
                  Intenta con otro término de búsqueda
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
