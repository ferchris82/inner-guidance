# Guía de Colores de Marca - Inner Guidance

## 🎨 Paleta de Colores Principal

### Colores Base (HSL)
- **Indigo** `hsl(250 82% 26%)` - #280C78 - Fondos principales
- **Verde Turquesa** `hsl(175 80% 40%)` - #13BDAE - Subtítulos
- **Violeta** `hsl(270 100% 66%)` - #8C52FF - Títulos de capítulo y destacados
- **Blanco** `hsl(0 0% 100%)` - #FFFFFF - Texto en presentaciones
- **Negro** `hsl(0 0% 0%)` - #000000 - Texto en documentos
- **Amarillo Dorado** `hsl(43 75% 45%)` - #C38820 - Líneas y tablas

## 🎯 Clases de Utilidad Disponibles

### Fondos de Color
```css
.bg-indigo-brand      /* Fondo indigo */
.bg-turquoise-brand   /* Fondo turquesa */
.bg-violet-brand      /* Fondo violeta */
.bg-golden-brand      /* Fondo dorado */
```

### Texto de Color
```css
.text-indigo-brand    /* Texto indigo */
.text-turquoise-brand /* Texto turquesa */
.text-violet-brand    /* Texto violeta */
.text-golden-brand    /* Texto dorado */
```

### Bordes de Color
```css
.border-indigo-brand    /* Borde indigo */
.border-turquoise-brand /* Borde turquesa */
.border-violet-brand    /* Borde violeta */
.border-golden-brand    /* Borde dorado */
```

## 🌈 Gradientes Especiales

### Gradientes de Marca
```css
.bg-gradient-indigo-turquoise  /* Indigo → Turquesa */
.bg-gradient-violet-golden     /* Violeta → Dorado */
.bg-gradient-brand-full        /* Todos los colores */
```

### Gradientes Originales (Actualizados)
```css
.bg-gradient-spiritual  /* Indigo → Violeta → Turquesa */
.bg-gradient-divine     /* Indigo claro → Violeta claro */
.bg-gradient-peaceful   /* Turquesa claro → Blanco */
```

## 📋 Clases Especializadas

### Títulos de Capítulo
```css
.text-chapter-title     /* Violeta, peso 700 */
.bg-chapter-highlight   /* Violeta con transparencia */
```

### Subtítulos
```css
.text-subtitle-turquoise /* Turquesa, peso 600 */
.bg-subtitle-bg         /* Turquesa con transparencia */
```

### Tablas y Líneas
```css
.border-table-golden    /* Borde dorado para tablas */
.bg-table-header-golden /* Fondo dorado para encabezados */
```

## 🎨 Variables CSS Principales

### Modo Claro
```css
--primary: 250 82% 26%        /* Indigo */
--secondary: 175 80% 40%      /* Turquesa */
--accent: 270 100% 66%        /* Violeta */
--background: 250 100% 99%    /* Fondo claro */
--foreground: 0 0% 0%         /* Negro */
```

### Modo Oscuro
```css
--primary: 270 100% 66%       /* Violeta */
--secondary: 175 80% 40%      /* Turquesa */
--accent: 43 75% 45%          /* Dorado */
--background: 250 82% 8%      /* Fondo oscuro */
--foreground: 0 0% 100%       /* Blanco */
```

## 💡 Ejemplos de Uso

### Botones
```jsx
// Botón principal
<Button className="bg-gradient-indigo-turquoise">
  Comenzar mi viaje
</Button>

// Botón secundario
<Button variant="outline" className="border-violet-brand text-violet-brand">
  Conoce mi historia
</Button>
```

### Títulos
```jsx
// Título principal
<h1 className="text-gradient-brand-full">
  Mi propósito es guiarte
</h1>

// Título de capítulo
<h2 className="text-chapter-title">
  Mi Historia Espiritual
</h2>

// Subtítulo
<h3 className="text-subtitle-turquoise">
  Camino de Transformación
</h3>
```

### Elementos Destacados
```jsx
// Texto destacado
<span className="text-violet-brand font-semibold">
  Maité Gutiérrez
</span>

// Línea decorativa
<div className="border-golden-brand border-t-2"></div>

// Fondo con transparencia
<div className="bg-chapter-highlight p-4 rounded-lg">
  Contenido destacado
</div>
```

## 🔄 Transiciones y Animaciones

Todas las clases mantienen las transiciones suaves:
```css
.transition-spiritual  /* Transición suave para todos los elementos */
.animate-glow         /* Efecto de brillo */
.animate-float        /* Flotación */
```

## 📱 Responsive Design

Todos los colores y gradientes son completamente responsivos y se adaptan automáticamente a diferentes tamaños de pantalla.

## 🎯 Recomendaciones de Uso

1. **Indigo**: Usar para fondos principales, elementos de navegación y estructura
2. **Turquesa**: Ideal para subtítulos, elementos secundarios y acentos suaves
3. **Violeta**: Perfecto para títulos de capítulo, elementos destacados y llamadas a la acción
4. **Dorado**: Excelente para líneas, tablas y elementos decorativos
5. **Blanco/Negro**: Para texto principal y contraste

---

*Esta paleta de colores ha sido diseñada para mantener la coherencia visual y espiritual de tu marca, creando una experiencia visual armoniosa y profesional.*
