import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, BookOpen, X, Share2, ArrowLeft, Clock, User } from "lucide-react";

export function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const articles = [
    {
      title: "¿Qué sucede cuando renuncias a la cruz, creyendo que es aflicción?",
      excerpt: "Hay momentos en que Dios revela el llamado, despierta el propósito, y marca asignaciones concretas sobre una persona. La carga es clara. El anhelo por obedecer es verdadero...",
      date: "5 de Agosto, 2025",
      category: "Llamado divino",
      readTime: "8 min",
      featured: true,
      image: "/images/transformation-journey.jpg",
      author: "Maité Gutiérrez",
      content: `
        <article class="prose prose-lg max-w-none">
          <h1>✨ Aceptación del llamado</h1>

          <p>Hay momentos en que Dios revela el llamado, despierta el propósito, y marca asignaciones concretas sobre una persona. La carga es clara. El anhelo por obedecer es verdadero. La oración suena sincera:</p>

          <blockquote>"Señor, haz conmigo como quieras. Te entrego mi vida. Envíame."</blockquote>

          <p>Y Dios toma esas palabras en serio. Pero el Reino no avanza con promesas humanas, sino con obediencia probada.</p>

          <blockquote>"El crisol es para la plata, y la hornaza para el oro, pero Jehová prueba los corazones." (Proverbios 17:3)</blockquote>

          <p>La prueba no es castigo. Es selección.</p>

          <p>Cuando el cielo te llama, la tierra te sacude. Cuando el propósito es revelado, la fidelidad es probada. Porque antes de confiar una herencia, Dios examina si puedes soportar peso, presión, oposición.</p>

          <p>Y ahí es donde muchos fallan. No porque no amen a Dios, sino porque no entienden cómo funciona el mundo espiritual.</p>

          <h2>💡 El día de aflicción revela dónde está tu fuerza</h2>

          <p>Dios no tienta, pero sí permite el crisol. Permite:</p>

          <ul>
            <li>Incomodidad</li>
            <li>Despojo</li>
            <li>Incomprensión</li>
          </ul>

          <p>No para aplastarte… sino para exponer si tu fuerza viene del Espíritu o de tus recursos.</p>

          <blockquote>"Si fueres flojo en el día de la angustia, tu fuerza será reducida." (Proverbios 24:10)</blockquote>

          <p>En hebreo, "flojo" es <strong>rafáh</strong>, que implica:</p>

          <ul>
            <li>Flaquear</li>
            <li>Ceder</li>
            <li>Soltar</li>
            <li>Aflojar el alma</li>
          </ul>

          <p>Es no sostener la fe cuando duele. Es clamar por alivio, antes que por transformación.</p>

          <h2>🙏 A veces Dios permite… lo que pediste fuera de su diseño</h2>

          <p>Cuando en medio de la prueba clamas:</p>

          <blockquote>"Señor, sácame de esto…"</blockquote>

          <p>Dios puede responder concediendo la petición. No porque sea su voluntad perfecta, sino porque no obliga a nadie a seguir a Cristo.</p>

          <blockquote>"Si alguno quiere venir en pos de mí, niéguese a sí mismo, tome su cruz y sígame." (Lucas 9:23)</blockquote>

          <p>El que no está dispuesto, no será forzado.<br>
          Pero tampoco será hallado digno de lo que fue reservado al final de la prueba.</p>

          <h2>😔 El alma humana se acomoda… y se desvía</h2>

          <p>Una vez pasa la aflicción y se consigue "estabilidad", muchos se sienten "bendecidos". Pero la pregunta no es si tienes trabajo o metas… sino:</p>

          <p><strong>¿Estás en lo que se te asignó?</strong></p>

          <p>Muchos cambian:</p>

          <ul>
            <li>Fuego por rutina</li>
            <li>Altar por agenda</li>
            <li>Obediencia por productividad</li>
          </ul>

          <p>Sin notarlo, se convierten en <strong>autómatas espirituales</strong>. Siguen activos, pero han perdido el rumbo.</p>

          <h2>🧠 Cuando la fuerza humana se vuelve en tu contra</h2>

          <p>Dios había preparado un galardón. Un avance real. Una estabilidad por diseño.</p>

          <p>Pero al declinar la prueba, el alma se aferra a lo que puede conseguir por sí misma. Y eso que parecía fortaleza… se convierte en carga.</p>

          <blockquote>"Porque dijisteis: Haremos huida en caballos veloces, por tanto, vosotros huiréis; sobre corceles ligeros cabalgaremos, por eso serán veloces vuestros perseguidores." (Isaías 30:16)</blockquote>

          <p>La fuente en la que confiaste, el plan que ideaste, el trabajo que sostenías… se vuelve contra ti.</p>

          <h2>🌿 El abandono del propósito produce ruina silenciosa</h2>

          <p>Dios lo muestra así:</p>

          <blockquote>"Pasé junto al campo del hombre perezoso… y he aquí, por toda ella habían crecido los espinos…" (Proverbios 24:30-34)</blockquote>

          <p><strong>Interpretación espiritual:</strong></p>

          <ul>
            <li><strong>Campo:</strong> tu propósito, el terreno del llamado, tu tierra prometida</li>
            <li><strong>Viña:</strong> el corazón cultivado</li>
            <li><strong>Cerca rota:</strong> cobertura quebrada</li>
            <li><strong>Espinos:</strong> juicio silencioso por negligencia</li>
            <li><strong>Pobreza armada:</strong> consecuencias que no puedes resistir, porque no estás protegido</li>
          </ul>

          <p>Esto no habla del que nunca conoció.<br>
          Habla del que recibió campo, pero no lo trabajó. Del que tuvo diseño, pero lo abandonó.</p>

          <h2>🔁 ¿Qué hacer si te saliste del diseño?</h2>

          <ol>
            <li><strong>Reconoce</strong> en qué momento cambiaste obediencia por comodidad.</li>
            <li><strong>Discierne</strong> si lo que hoy te sostiene fue dado por Dios o tomado por ti.</li>
            <li><strong>Vuelve</strong> al punto del abandono, no al de la caída.</li>
            <li><strong>Retoma</strong> lo que es tuyo: tu asignación, tu campo, tu altar, tu voz.</li>
            <li><strong>Prepara tu trabajo desde el diseño:</strong></li>
          </ol>

          <blockquote>"Prepara tus labores fuera… y después edifica tu casa." (Proverbios 24:27)</blockquote>

          <p><strong>No es tarde… pero el tiempo es corto.</strong></p>

          <h2>⚠️ Si no lo haces…</h2>

          <blockquote>"Así vendrá como caminante tu necesidad, y tu pobreza como hombre armado." (Proverbios 24:34)</blockquote>

          <ul>
            <li>Lo que no edifiques en fe, terminará siendo ruina.</li>
            <li>Lo que no limpies, se llenará de espinos.</li>
            <li>Lo que no valores, se perderá.</li>
          </ul>

          <h2>✨ El diseño sigue vigente</h2>

          <p>El cielo no ha retirado el llamado.<br>
          Pero es <strong>tu responsabilidad volver</strong>.</p>

          <p>Dios no cancela sus planes…<br>
          Pero tampoco fuerza a nadie a vivirlos.</p>

          <hr>

          <p><em>🖋️ @maitemonitora</em></p>
        </article>
      `
    },
    {
      title: "Tu provisión en tiempo de aflicción",
      excerpt: "¡Pueblo de Dios, oigan lo que el Espíritu está diciendo en este tiempo! No estamos ante una crisis cualquiera. Estamos en un Kairos del cielo...",
      date: "2 de Agosto, 2025",
      category: "Mensaje profético",
      readTime: "12 min",
      featured: false,
      author: "Maité Gutiérrez",
      image: "/images/provision-afliccion.jpg",
      content: `
        <article class="prose prose-lg max-w-none">
          <h1>Un Kairos del cielo</h1>
          
          <p>¡Pueblo de Dios, oigan lo que el Espíritu está diciendo en este tiempo!</p>
          
          <p>No estamos ante una crisis cualquiera. Estamos en un <strong>Kairos del cielo</strong>, un momento sellado en la agenda de Dios, donde se marca una separación clara entre los que viven por lo que ven y los que viven por lo que oyen.</p>
          
          <h2>La voz de Dios en este tiempo</h2>
          
          <p>Dios está diciendo:</p>
          
          <blockquote>
            "No busquen provisión en Egipto. No esperen respaldo en los reyes. <strong>El sustento de este tiempo no vendrá por contrato visible ni apoyo humano</strong>. Estoy dando pan diario a los que guardan mi Palabra sellada, no a los que la queman con su incredulidad."
          </blockquote>
          
          <p>Este no es un tiempo de puertas abiertas al estilo del mundo. <strong>Es un tiempo de cisternas, donde muchos sienten que han sido arrojados a lo profundo</strong>, abandonados, silenciados.</p>
          
          <p>Pero escuchen esto:</p>
          
          <h2>🕊️ La provisión ya está decretada</h2>
          
          <p><em><strong>Dios ya ha decretado la provisión de los suyos.</strong></em> Está escrita. Está sellada. No será borrada.</p>
          
          <p>El que fue fiel en declarar Su Palabra, será sostenido. El que obedezca aunque nadie lo respalde, será preservado. <strong>El que crea lo que el Padre ya ha dicho, aunque aún no lo vea, vivirá.</strong></p>
          
          <blockquote>
            No teman si el entorno se cierra.
          </blockquote>
          
          <p><strong>No teman si otros parecen avanzar y ustedes están en pausa.</strong> No teman si el pan viene día a día y no por abundancia.</p>
          
          <h3>Características de este tiempo</h3>
          
          <ul>
            <li>Este es el tiempo del <strong>pan escondido</strong></li>
            <li>Este es el tiempo de los <strong>Jeremías</strong></li>
            <li>Este es el tiempo del <strong>rollo escrito</strong>, no del aplauso del sistema</li>
          </ul>
          
          <p><strong>Los que se rinden al gobierno de Dios —no en apariencia, sino en verdad— serán sostenidos de forma milagrosa, inesperada y continua.</strong></p>
          
          <h2>📜 La Palabra no ha fallado</h2>
          
          <p>La Palabra no ha fallado. <strong>El sustento no ha cesado.</strong> Solo ha cambiado la forma en que se manifiesta: <strong>ahora viene del cielo, no de Egipto.</strong></p>
          
          <h3>Instrucciones para este Kairos</h3>
          
          <p>📌 Si esto quema en tu espíritu, no lo ignores. <strong>Este Kairos es una puerta invisible que se cierra para unos y se abre para otros.</strong></p>
          
          <p>Alinea tu fe, tu oído y tu obediencia. Y vivirás.</p>
          
          <p><em>✍️ Proféticamente anunciado, para todo aquel que tenga oído para oír.</em></p>
          
          <h2>🕊️ DECLARACIÓN PROFÉTICA – "Sostenidos por su Palabra"</h2>
          
          <p>En el nombre del Dios viviente, el que escribe en rollo lo que ha decretado, el que sustenta con pan diario a los suyos en medio del asedio, el que levanta a sus Jeremías cuando los reyes tiemblan, nos alineamos hoy con Su gobierno invisible y eterno.</p>
          
          <h3>Proclamaciones de fe</h3>
          
          <blockquote>
            📜 Proclamamos que la Palabra escrita no será quemada, ignorada ni borrada. Lo que Dios decretó sobre nuestra vida, nuestra provisión y nuestra asignación, ya está sellado en los cielos y no será anulado por la incredulidad de los hombres.
          </blockquote>
          
          <p>🍞 No vivimos por contratos ni apoyos humanos, sino por cada palabra que sale de la boca de Dios. Aunque los reinos tiemblen y Egipto se retire, nuestro sustento es fiel y diario, porque viene del Panadero del cielo.</p>
          
          <h3>Promesas de protección</h3>
          
          <p>⛲ Aun si nos arrojan a la cisterna, el Señor tiene preparado a Ebed-melec, un canal inesperado, un mensajero oculto, un rescate soberano, porque Su propósito no será enterrado por el miedo ni detenido por la presión.</p>
          
          <p>👑 Renunciamos a la lógica de Sedequías, que consulta a Dios en secreto pero no obedece en público. No seremos gobernados por el temor al juicio ni por la apariencia del sistema, sino por la voz del Espíritu que guía a los verdaderos hijos.</p>
          
          <h3>Declaración final</h3>
          
          <blockquote>
            🔥 Hoy declaramos: Estamos en Kairos de fe silenciosa, pan escondido y fidelidad probada. El maná invisible sostiene a los que no queman el rollo, sino que lo atesoran aunque nadie más crea.
          </blockquote>
          
          <h3>Identidad en este tiempo</h3>
          
          <p>🕊️ Somos Jeremías en este tiempo:</p>
          
          <ul>
            <li>No tememos a la cárcel ni a la cisterna</li>
            <li>No nos rinde el hambre ni la espera</li>
            <li>Porque Dios ha hablado, y su Palabra vivirá</li>
          </ul>
          
          <p><strong>Amén.</strong></p>
          
          <hr>
          
          <p><em>🖋️ @maitemonitora</em></p>
        </article>
      `
    },
    {
      title: "Dios no necesita que intervengas en el cumplimiento de su propósito",
      excerpt: "No le ayudes a Dios. La prisa desvía el diseño. Hay una operación espiritual activa que busca sabotear los propósitos divinos...",
      date: "1 de Agosto, 2025",
      category: "Propósito divino",
      readTime: "10 min",
      featured: false
    },
    {
      title: "Identidad espiritual vs identidad humana",
      excerpt: "Entender la diferencia entre quiénes somos en el espíritu y nuestra identidad terrenal es fundamental para caminar en nuestro propósito...",
      date: "28 de Julio, 2025",
      category: "Identidad",
      readTime: "15 min",
      featured: false
    },
    {
      title: "Planificación profética para el Reino",
      excerpt: "Cómo alinear nuestros planes con los propósitos eternos de Dios y caminar en sincronía con los tiempos divinos...",
      date: "25 de Julio, 2025",
      category: "Profecía",
      readTime: "11 min",
      featured: false
    },
    {
      title: "Los dos testigos del fin de los tiempos",
      excerpt: "Una revelación profética sobre el ministerio de los dos testigos y su relevancia para la iglesia de hoy...",
      date: "22 de Julio, 2025",
      category: "Profecía escatológica",
      readTime: "18 min",
      featured: false
    }
  ];

  const openArticle = (index: number) => {
    setSelectedArticle(index);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      <section id="blog" className="py-20 bg-gradient-peaceful">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gradient-spiritual">
                Blog Espiritual
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Reflexiones proféticas, enseñanzas bíblicas y revelaciones espirituales 
                para tu crecimiento en el Reino de Dios.
              </p>
            </div>

            {/* Featured Article */}
            <div className="mb-12 animate-slide-up">
              <Card className="overflow-hidden shadow-spiritual hover:shadow-divine transition-spiritual border-primary">
                <div className="md:flex">
                  <div className="md:w-2/3 p-8">
                    <Badge className="bg-gradient-spiritual mb-4">Artículo destacado</Badge>
                    <CardTitle className="text-3xl font-heading mb-4 text-primary">
                      {articles[0].title}
                    </CardTitle>
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                      {articles[0].excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{articles[0].date}</span>
                      </div>
                      <Badge variant="outline">{articles[0].category}</Badge>
                      <span>{articles[0].readTime} de lectura</span>
                    </div>
                    <Button 
                      onClick={() => openArticle(0)}
                      className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
                    >
                      Leer artículo completo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="md:w-1/3 bg-gradient-spiritual flex items-center justify-center p-8 relative overflow-hidden">
                    <img 
                      src={articles[0].image} 
                      alt="Viaje de transformación espiritual - De la aflicción al propósito"
                      className="w-full h-full object-cover absolute inset-0 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="relative z-10 text-center text-white">
                      <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-medium">Transformación Espiritual</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.slice(1).map((article, index) => (
                <Card 
                  key={index} 
                  className="shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {article.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-heading group-hover:text-primary transition-spiritual">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{article.date}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="group-hover:text-primary transition-spiritual"
                        onClick={() => openArticle(index + 1)}
                      >
                        Leer más
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-spiritual"
              >
                Ver todos los artículos
                <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Full Page View */}
      {selectedArticle !== null && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="flex items-center justify-between h-16">
                <Button 
                  variant="ghost" 
                  onClick={closeArticle}
                  className="flex items-center space-x-2 hover:bg-primary/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al blog</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <main className="container mx-auto px-4 lg:px-6 py-8">
            <article className="max-w-4xl mx-auto">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <Badge className="bg-gradient-spiritual">
                    {articles[selectedArticle].category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{articles[selectedArticle].date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{articles[selectedArticle].readTime} de lectura</span>
                  </div>
                  {articles[selectedArticle].author && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{articles[selectedArticle].author}</span>
                    </div>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6 leading-tight">
                  {articles[selectedArticle].title}
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {articles[selectedArticle].excerpt}
                </p>
              </header>

              {/* Featured Image */}
              {articles[selectedArticle].image && (
                <div className="mb-8">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-spiritual">
                    <img 
                      src={articles[selectedArticle].image} 
                      alt={`Imagen del artículo: ${articles[selectedArticle].title}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-lg max-w-none prose-headings:text-primary prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-strong:text-primary prose-li:marker:text-primary">
                {articles[selectedArticle].content ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: articles[selectedArticle].content }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Contenido completo disponible próximamente
                    </p>
                  </div>
                )}
              </div>

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={closeArticle}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al blog</span>
                  </Button>
                </div>
              </footer>
            </article>
          </main>
        </div>
      )}
    </>
  );
}