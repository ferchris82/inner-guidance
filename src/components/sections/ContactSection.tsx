import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Send, Heart, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { saveContactMessage } from "@/services/contactSupabase";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error en el formulario",
        description: "Por favor completa todos los campos requeridos (nombre, email y mensaje).",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Guardar en Supabase
      const savedMessage = await saveContactMessage({
        name: formData.name,
        email: formData.email,
        service: formData.service || 'Sin especificar',
        message: formData.message
      });

      if (savedMessage) {
        toast({
          title: "¡Mensaje enviado exitosamente! 🙏",
          description: "Gracias por contactarme. Me pondré en contacto contigo dentro de las próximas 24 horas.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          service: '',
          message: ''
        });
      } else {
        throw new Error('Error al guardar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast({
        title: "Error al enviar mensaje",
        description: "Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo o contacta directamente por email.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contacto" className="py-20 bg-gradient-peaceful">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
              Comienza tu viaje espiritual
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Estoy aquí para acompañarte en tu crecimiento espiritual. 
              Conversemos sobre cómo puedo ayudarte a descubrir tu propósito divino.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-up">
              <Card className="shadow-spiritual">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading text-primary flex items-center">
                    <Heart className="w-6 h-6 mr-2 icon-aqua-gradient" />
                    Envíame un mensaje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-primary font-medium">
                        Nombre completo *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-primary font-medium">
                        Correo electrónico *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="service" className="text-primary font-medium">
                        Servicio de interés
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('service', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consulta">Consulta Espiritual Personal</SelectItem>
                          <SelectItem value="mentoria">Mentoría Espiritual</SelectItem>
                          <SelectItem value="conferencia">Conferencias y Talleres</SelectItem>
                          <SelectItem value="recursos">Recursos Escritos</SelectItem>
                          <SelectItem value="otro">Otro (especificar en mensaje)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-primary font-medium">
                        Mensaje *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Cuéntame sobre tu situación espiritual, qué búsquedas tienes o cómo puedo ayudarte..."
                        required
                        className="mt-2 min-h-[120px]"
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-aqua hover:shadow-spiritual transition-spiritual disabled:opacity-50"
                      size="lg"
                    >
                      <Send className="w-5 h-5 mr-2 text-white" />
                      {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-8">
                <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-aqua p-3 rounded-full">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-primary mb-2">
                          Correo Electrónico
                        </h3>
                        <p className="text-muted-foreground">
                          maitegutierrez.monitora@gmail.com
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Respondo dentro de 24 horas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-aqua p-3 rounded-full">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-primary mb-2">
                          Horarios de Atención
                        </h3>
                        <div className="space-y-1 text-muted-foreground">
                          <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                          <p>Sábados: 10:00 AM - 2:00 PM</p>
                          <p>Domingos: Solo emergencias espirituales</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-aqua p-3 rounded-full">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-primary mb-2">
                          Modalidad
                        </h3>
                        <p className="text-muted-foreground">
                          Consultas virtuales por Zoom
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Disponible para personas de habla hispana en todo el mundo
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-divine p-6 rounded-2xl shadow-peaceful">
                  <h3 className="text-xl font-heading font-bold text-primary mb-3">
                    ¿Necesitas oración urgente?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Si atraviesas una situación espiritual que requiere oración inmediata, 
                    puedes escribirme directamente.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      window.open('https://wa.me/573137657304?text=Hola%20Maité,%20necesito%20oración%20urgente%20por%20favor', '_blank');
                    }}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-spiritual"
                  >
                    <Heart className="w-4 h-4 mr-2 icon-aqua-gradient" />
                    Solicitar oración
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 animate-fade-in">
            <div className="bg-gradient-spiritual p-8 rounded-2xl text-white shadow-divine">
              <h3 className="text-3xl font-heading font-bold mb-4">
                "Tu propósito te está esperando"
              </h3>
              <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
                No esperes más para dar el paso que cambiará tu vida. 
                Dios tiene planes específicos para ti, y yo estoy aquí para ayudarte a descubrirlos.
              </p>
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => {
                  const element = document.getElementById('blog');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-white text-primary hover:bg-white/90 transition-spiritual px-8 py-4"
              >
                Comenzar ahora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}