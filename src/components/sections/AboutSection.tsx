import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, Users, Book } from "lucide-react";
import mentorPortrait from "@/assets/mentor-portrait.jpg";

export function AboutSection() {
  const scrollToServices = () => {
    const element = document.getElementById('servicios');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="acerca" className="py-20 bg-gradient-peaceful">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gradient-spiritual">
              Acerca de mí
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              María Teresa Gutiérrez Villa, conocida como Maité, 
              monitora espiritual con un llamado divino para guiar almas hacia su propósito.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-slide-up">
              <div className="relative">
                <img 
                  src={mentorPortrait} 
                  alt="Maité Gutiérrez - Monitora Espiritual"
                  className="rounded-2xl shadow-spiritual w-full max-w-md mx-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-spiritual p-4 rounded-xl shadow-divine">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-3xl font-heading font-bold mb-6 text-primary">
                Mi llamado divino
              </h3>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Durante años he experimentado el llamado divino de acompañar a las personas 
                  en su crecimiento espiritual y descubrimiento de propósito. Mi enfoque se 
                  centra en la <strong className="text-primary">guía profética</strong> y 
                  el desarrollo de la identidad espiritual.
                </p>
                <p>
                  A través de mis escritos y acompañamiento espiritual, he tenido el privilegio 
                  de ver cómo Dios transforma vidas y revela propósitos únicos en cada persona. 
                  Mi pasión es ser un instrumento del Espíritu Santo en este proceso sagrado.
                </p>
                <p>
                  Mi lema <em className="text-gradient-spiritual font-semibold">
                    "Mi propósito es guiarte a encontrar el tuyo"
                  </em> refleja mi compromiso con cada alma que busca dirección espiritual.
                </p>
              </div>
              
              <Button 
                onClick={scrollToServices}
                className="mt-8 bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
                size="lg"
              >
                Conoce mis servicios
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Crecimiento Personal",
                description: "Acompañamiento en el desarrollo de tu identidad espiritual y emocional."
              },
              {
                icon: Lightbulb,
                title: "Propósito de Vida",
                description: "Descubrimiento y activación de tu llamado divino único."
              },
              {
                icon: Users,
                title: "Guía Profética",
                description: "Dirección espiritual basada en la revelación del Espíritu Santo."
              },
              {
                icon: Book,
                title: "Enseñanza Bíblica",
                description: "Fundamentos sólidos en la Palabra para tu crecimiento espiritual."
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-spiritual p-3 rounded-full w-fit mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-heading font-semibold mb-2 text-primary">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}