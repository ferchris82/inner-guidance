import { supabase } from '@/lib/supabase'

export const insertSampleData = async () => {
  try {
    console.log('🌱 Insertando datos de ejemplo...')

    // Insertar blog posts
    const { data: blogData, error: blogError } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: 'El Llamado Divino: Descubriendo Tu Propósito',
          excerpt: 'Reflexiones sobre cómo identificar el llamado de Dios en tu vida y caminar en propósito divino.',
          content: '<h2>Introducción</h2><p>El propósito divino en nuestras vidas es uno de los temas más profundos y transformadores que podemos explorar como creyentes. Cuando entendemos que Dios tiene un plan específico para cada uno de nosotros, nuestra perspectiva cambia completamente.</p><h2>Señales del Llamado</h2><p>Dios nos habla de muchas maneras, y reconocer Su voz es fundamental para caminar en nuestro propósito. Las señales pueden venir a través de Su palabra, circunstancias, confirmaciones de otros creyentes, y esa paz profunda que sentimos cuando estamos alineados con Su voluntad.</p><h2>Pasos Prácticos</h2><p>Para descubrir tu llamado divino, comienza con la oración constante, el estudio de la Palabra, y mantén tu corazón abierto a la dirección del Espíritu Santo. Recuerda que el llamado de Dios siempre viene acompañado de Su capacitación.</p>',
          category: 'llamado-divino',
          author: 'Maité Gutiérrez',
          read_time: '8 min',
          featured: true,
          featured_image: '/images/transformation-journey.jpg'
        },
        {
          title: 'Identidad en Cristo: Quién Eres en Él',
          excerpt: 'Descubre tu verdadera identidad como hijo de Dios y cómo esto transforma tu perspectiva de vida.',
          content: '<h2>Nuestra Verdadera Identidad</h2><p>En Cristo, somos nuevas criaturas. La identidad que tenemos en Él trasciende cualquier etiqueta que el mundo pueda poner sobre nosotros. No somos definidos por nuestros errores del pasado, nuestras circunstancias actuales, o las opiniones de otros.</p><h2>Viviendo desde la Identidad</h2><p>Cuando conocemos quiénes somos en Cristo, nuestras decisiones y acciones fluyen desde esa verdad. Somos amados, escogidos, perdonados y capacitados. Esta identidad nos da confianza para enfrentar cualquier desafío.</p><h2>Renovación Mental</h2><p>La renovación de nuestra mente es clave para vivir en nuestra identidad. Debemos reemplazar las mentiras que hemos creído sobre nosotros mismos con las verdades que Dios dice acerca de quiénes somos.</p>',
          category: 'identidad',
          author: 'Maité Gutiérrez',
          read_time: '6 min',
          featured: false,
          featured_image: '/images/provision-afliccion.jpg'
        },
        {
          title: 'Profecía Personal: Escuchando la Voz de Dios',
          excerpt: 'Guía práctica para desarrollar tu capacidad profética y escuchar la voz de Dios claramente.',
          content: '<h2>El Don Profético</h2><p>La profecía no es solo para algunos elegidos, sino un regalo disponible para todos los creyentes que buscan intimidad con Dios. Es la capacidad de escuchar el corazón del Padre y transmitir Sus mensajes de esperanza, dirección y aliento.</p><h2>Cómo Desarrollar el Oído Espiritual</h2><p>Escuchar a Dios requiere práctica, discernimiento y una relación cercana con Él. Comienza con momentos de silencio, estudiando cómo Dios habló en las Escrituras, y practicando el discernimiento espiritual.</p><h2>Profecía Bíblica</h2><p>Toda profecía verdadera está alineada con la Palabra de Dios. Nunca contradice las Escrituras, sino que confirma, edifica y consuela según 1 Corintios 14:3. Siempre debemos probar los espíritus y mantener todo bajo la autoridad de la Palabra.</p>',
          category: 'profecia',
          author: 'Maité Gutiérrez',
          read_time: '10 min',
          featured: false
        },
        {
          title: 'Transformación Espiritual: De la Aflicción al Propósito',
          excerpt: 'Cómo Dios usa nuestras pruebas y dificultades para moldearnos y prepararnos para Su propósito.',
          content: '<h2>El Propósito del Sufrimiento</h2><p>Aunque las pruebas son difíciles, Dios las usa para nuestro crecimiento espiritual. Cada dificultad es una oportunidad para que Su carácter se forme en nosotros y para que aprendamos a depender completamente de Él.</p><h2>Proceso de Transformación</h2><p>La transformación no es instantánea, es un proceso. Requiere paciencia, fe y la disposición de permitir que Dios quite lo que no nos sirve y añada lo que necesitamos para cumplir Su propósito.</p><h2>Fruto en la Adversidad</h2><p>Las pruebas producen fruto espiritual: paciencia, carácter probado, esperanza y una fe más profunda. Lo que el enemigo pretende para mal, Dios lo transforma para nuestro bien y Su gloria.</p>',
          category: 'proposito-divino',
          author: 'Maité Gutiérrez',
          read_time: '7 min',
          featured: false
        }
      ])

    if (blogError) {
      console.error('❌ Error insertando blog posts:', blogError)
    } else {
      console.log('✅ Blog posts insertados:', blogData?.length || 0)
    }

    // Insertar social links
    const { data: socialData, error: socialError } = await supabase
      .from('social_links')
      .insert([
        { platform: 'Instagram', url: 'https://instagram.com/maite_mentora', icon: 'Instagram', order_position: 1 },
        { platform: 'Facebook', url: 'https://facebook.com/maite.mentora', icon: 'Facebook', order_position: 2 },
        { platform: 'YouTube', url: 'https://youtube.com/@MaiteMentora', icon: 'Youtube', order_position: 3 },
        { platform: 'Email', url: 'mailto:contacto@maitegutierrez.com', icon: 'Mail', order_position: 4 }
      ])

    if (socialError) {
      console.error('❌ Error insertando social links:', socialError)
    } else {
      console.log('✅ Social links insertados:', socialData?.length || 0)
    }

    return { success: true, blogData, socialData }
  } catch (error) {
    console.error('❌ Error general:', error)
    return { success: false, error }
  }
}
