/* ============================================================
   script.js — Efectos visuales premium
   Página: Mantenimiento y Aseguramiento de Sistemas Informáticos
   Incluye: cursor personalizado, partículas, reveal al scroll,
   efecto typing, contador animado, parallax, ripple en cards,
   línea de progreso de lectura y menú hamburguesa móvil.
============================================================ */


/* ============================================================
   1. CURSOR PERSONALIZADO
   Reemplaza el cursor del sistema por un punto cian con un
   anillo que lo sigue con un pequeño retraso (efecto lag).
============================================================ */

// Crea el punto central del cursor
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';

// Crea el anillo exterior que sigue al punto con retraso
const cursorRing = document.createElement('div');
cursorRing.className = 'cursor-ring';

document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

// Posición actual del mouse
let mouseX = 0, mouseY = 0;

// Posición actual del anillo (se mueve más lento para el efecto lag)
let ringX = 0, ringY = 0;

// Escucha el movimiento del mouse y actualiza la posición del punto
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // El punto sigue al mouse de forma instantánea
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

// El anillo se mueve con interpolación (lerp) para el efecto lag
function animateCursor() {
  // Lerp: mueve el anillo un 10% hacia el mouse en cada frame
  ringX += (mouseX - ringX) * 0.10;
  ringY += (mouseY - ringY) * 0.10;

  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;

  requestAnimationFrame(animateCursor); // Llama al siguiente frame
}

animateCursor();

// Agranda el anillo al pasar sobre elementos interactivos
document.querySelectorAll('a, button, .info-card, .iso-card, .step-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-ring--hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-ring--hover'));
});

// SVG de la nave espacial codificado en base64 para usarlo como cursor CSS
// La nave apunta hacia arriba y tiene detalles cian
const shipSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
  <!-- Cuerpo principal de la nave -->
  <polygon points="19,2 27,30 19,25 11,30" fill="#00bcd4" opacity="0.95"/>
  <!-- Cabina / ventana central -->
  <ellipse cx="19" cy="14" rx="4" ry="5.5" fill="#0a0d0f" stroke="#00e5ff" stroke-width="1.2"/>
  <!-- Ala izquierda -->
  <polygon points="11,30 4,36 10,22" fill="#0097a7" opacity="0.9"/>
  <!-- Ala derecha -->
  <polygon points="27,30 34,36 28,22" fill="#0097a7" opacity="0.9"/>
  <!-- Propulsor central -->
  <ellipse cx="19" cy="30" rx="3.5" ry="2" fill="#00e5ff" opacity="0.7"/>
  <!-- Llama del propulsor -->
  <polygon points="16.5,30 21.5,30 19,38" fill="#00bcd4" opacity="0.5"/>
</svg>`;

const svgBlob   = new Blob([shipSVG], { type: 'image/svg+xml' });
const svgURL    = URL.createObjectURL(svgBlob);

const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
  /* Oculta el cursor nativo del sistema */
  * { cursor: none !important; }

  /* Nave espacial como cursor principal */
  .cursor-dot {
    position: fixed;
    top: -19px;
    left: -19px;
    width: 38px;
    height: 38px;
    background-image: url('${svgURL}');
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
    z-index: 99999;
    will-change: transform;
    filter: drop-shadow(0 0 6px rgba(0,188,212,0.8));
    transition: filter 0.2s ease;
  }

  /* Estela / propulsion detras de la nave */
  .cursor-ring {
    position: fixed;
    top: -5px;
    left: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,188,212,0.9) 0%, transparent 70%);
    pointer-events: none;
    z-index: 99998;
    will-change: transform;
    transition: width 0.2s ease, height 0.2s ease,
                top 0.2s ease, left 0.2s ease,
                opacity 0.2s ease;
    opacity: 0.7;
  }

  /* Al hacer hover sobre elementos: la estela crece y la nave brilla mas */
  .cursor-ring--hover {
    width: 22px;
    height: 22px;
    top: -11px;
    left: -11px;
    opacity: 1;
    background: radial-gradient(circle, rgba(0,229,255,0.7) 0%, rgba(0,188,212,0.2) 60%, transparent 100%);
  }

  /* Particulas de estela que deja la nave al moverse */
  .trail-particle {
    position: fixed;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #00bcd4;
    pointer-events: none;
    z-index: 99997;
    animation: trailFade 0.5s ease-out forwards;
  }

  @keyframes trailFade {
    0%   { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(0.1); opacity: 0; }
  }
`;
document.head.appendChild(cursorStyles);

// Genera partículas de estela mientras la nave se mueve
let lastTrailTime = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  // Crea una partícula de estela cada 40ms para no saturar el DOM
  if (now - lastTrailTime > 40) {
    lastTrailTime = now;

    const trail = document.createElement('div');
    trail.className = 'trail-particle';
    // La estela aparece ligeramente detrás de la nave (offset hacia abajo)
    trail.style.left = (e.clientX - 2 + (Math.random() * 6 - 3)) + 'px';
    trail.style.top  = (e.clientY + 14 + (Math.random() * 4 - 2)) + 'px';
    trail.style.width  = (Math.random() * 3 + 2) + 'px';
    trail.style.height = trail.style.width;

    document.body.appendChild(trail);
    // Se elimina del DOM al terminar la animación
    trail.addEventListener('animationend', () => trail.remove());
  }
});


/* ============================================================
   2. BARRA DE PROGRESO DE LECTURA
   Línea delgada cian en la parte superior de la página que
   crece horizontalmente a medida que el usuario hace scroll.
============================================================ */

const progressBar = document.createElement('div');
progressBar.className = 'reading-progress';
document.body.appendChild(progressBar);

// Inyecta los estilos de la barra de progreso
const progressStyles = document.createElement('style');
progressStyles.textContent = `
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #0097a7, #00bcd4, #00e5ff);
    z-index: 99997;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(0,188,212,0.8);
  }
`;
document.head.appendChild(progressStyles);

// Actualiza el ancho de la barra según el porcentaje de scroll
window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  // Altura total del documento menos la altura del viewport
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  progressBar.style.width = scrollPercent + '%';
});


/* ============================================================
   3. PARTÍCULAS FLOTANTES EN EL HERO
   Crea pequeños puntos cian que flotan aleatoriamente sobre
   la sección hero, dando profundidad y movimiento al fondo.
============================================================ */

const hero = document.querySelector('.hero');

if (hero) {
  // Cantidad de partículas a generar
  const PARTICLE_COUNT = 28;

  const particleStyles = document.createElement('style');
  particleStyles.textContent = `
    /* Contenedor de partículas, posicionado sobre el hero */
    .particles-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    /* Cada partícula individual */
    .particle {
      position: absolute;
      border-radius: 50%;
      background: rgba(0,188,212,0.55);
      animation: floatParticle linear infinite;
      will-change: transform, opacity;
    }

    /* Animación de flotación hacia arriba con fade */
    @keyframes floatParticle {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0;
      }
      10% { opacity: 1; }
      90% { opacity: 0.5; }
      100% {
        transform: translateY(-120vh) scale(0.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(particleStyles);

  // Contenedor de partículas
  const container = document.createElement('div');
  container.className = 'particles-container';
  hero.appendChild(container);

  // Genera cada partícula con propiedades aleatorias
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    // Tamaño aleatorio entre 2px y 5px
    const size = Math.random() * 3 + 2;
    // Posición horizontal aleatoria
    const left = Math.random() * 100;
    // Duración de animación entre 8 y 20 segundos
    const duration = Math.random() * 12 + 8;
    // Retraso inicial para que no arranquen todas al mismo tiempo
    const delay = Math.random() * 15;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      box-shadow: 0 0 ${size * 2}px rgba(0,188,212,0.6);
    `;

    container.appendChild(p);
  }
}


/* ============================================================
   4. REVEAL AL SCROLL (INTERSECTION OBSERVER)
   Los elementos entran con una animación suave cuando el
   usuario llega a ellos al hacer scroll, en lugar de estar
   todos visibles desde el principio.
============================================================ */

const revealStyles = document.createElement('style');
revealStyles.textContent = `
  /* Estado inicial: elemento invisible y desplazado hacia abajo */
  .reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s cubic-bezier(0.22, 0.68, 0, 1.2),
                transform 0.65s cubic-bezier(0.22, 0.68, 0, 1.2);
  }

  /* Estado visible: el elemento aparece en su lugar */
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Variante con retraso escalonado para grupos de tarjetas */
  .reveal-delay-1 { transition-delay: 0.08s; }
  .reveal-delay-2 { transition-delay: 0.16s; }
  .reveal-delay-3 { transition-delay: 0.24s; }
`;
document.head.appendChild(revealStyles);

// Selecciona los elementos que recibirán el efecto reveal
const revealTargets = document.querySelectorAll(
  '.info-card, .iso-card, .step-card, .concept-card, ' +
  '.highlight-box, .checklist-box, .text-block, ' +
  '.table-wrapper, .conclusion-content, .section-header'
);

// Agrega la clase "reveal" a cada elemento
revealTargets.forEach((el, i) => {
  el.classList.add('reveal');

  // Agrega retraso escalonado a los grupos de tarjetas
  const parent = el.parentElement;
  if (parent) {
    const siblings = [...parent.children].filter(c => c.classList.contains('info-card') ||
                                                       c.classList.contains('iso-card') ||
                                                       c.classList.contains('step-card'));
    const idx = siblings.indexOf(el);
    if (idx === 1) el.classList.add('reveal-delay-1');
    if (idx === 2) el.classList.add('reveal-delay-2');
    if (idx === 3) el.classList.add('reveal-delay-3');
  }
});

// IntersectionObserver: dispara cuando el elemento entra al viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Deja de observar el elemento una vez que ya apareció
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,    // Se activa cuando el 12% del elemento es visible
  rootMargin: '0px 0px -40px 0px' // Margen inferior para anticipar el reveal
});

revealTargets.forEach(el => observer.observe(el));


/* ============================================================
   5. EFECTO TYPING EN EL TÍTULO DEL HERO
   El título del hero se escribe letra por letra al cargar
   la página, simulando que alguien lo está escribiendo.
============================================================ */

const heroTitle = document.querySelector('.hero-title');

if (heroTitle) {
  const originalText = heroTitle.textContent.trim();
  heroTitle.textContent = '';       // Vacía el título
  heroTitle.style.opacity = '1';   // Lo hace visible (override de animación CSS)
  heroTitle.style.transform = 'none';

  // Agrega un cursor parpadeante al final del texto
  const typingStyles = document.createElement('style');
  typingStyles.textContent = `
    /* Cursor de escritura parpadeante */
    .typing-cursor {
      display: inline-block;
      width: 2px;
      height: 0.9em;
      background: #00bcd4;
      margin-left: 3px;
      vertical-align: middle;
      animation: blink 0.75s step-end infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
  `;
  document.head.appendChild(typingStyles);

  // Elemento cursor parpadeante
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  heroTitle.appendChild(cursor);

  let charIndex = 0;
  const TYPING_SPEED = 42; // Milisegundos entre cada letra

  // Escribe una letra cada TYPING_SPEED ms
  function typeChar() {
    if (charIndex < originalText.length) {
      // Inserta la letra antes del cursor parpadeante
      heroTitle.insertBefore(
        document.createTextNode(originalText[charIndex]),
        cursor
      );
      charIndex++;
      setTimeout(typeChar, TYPING_SPEED);
    } else {
      // Cuando termina de escribir, elimina el cursor después de 2s
      setTimeout(() => {
        cursor.style.transition = 'opacity 0.5s';
        cursor.style.opacity = '0';
        setTimeout(() => cursor.remove(), 500);
      }, 2000);
    }
  }

  // Espera 600ms antes de empezar a escribir (para que cargue la página)
  setTimeout(typeChar, 600);
}


/* ============================================================
   6. CONTADORES ANIMADOS EN LAS MÉTRICAS
   Los números en la tabla de KPIs se animan desde 0 hasta
   su valor real cuando el usuario llega a esa sección.
============================================================ */

const counterStyles = document.createElement('style');
counterStyles.textContent = `
  /* Resalta el valor numérico en la tabla */
  .animated-number {
    color: #00bcd4;
    font-weight: 700;
    font-family: 'Source Serif 4', serif;
  }
`;
document.head.appendChild(counterStyles);

// Mapa de valores numéricos por término de búsqueda en la tabla
const counterTargets = [
  { text: '99.9%', end: 99.9, suffix: '%',  decimals: 1 },
  { text: '70%',   end: 70,   suffix: '%',  decimals: 0 },
];

// Función que anima un número desde 0 hasta su valor final
function animateCounter(el, end, suffix, decimals, duration = 1600) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Función de easing: desacelera hacia el final
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (end * eased).toFixed(decimals);

    el.textContent = current + suffix;

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Busca las celdas de la tabla que contengan los valores objetivo
counterTargets.forEach(({ text, end, suffix, decimals }) => {
  document.querySelectorAll('.data-table td').forEach(td => {
    if (td.textContent.trim() === text) {
      td.innerHTML = `<span class="animated-number">0${suffix}</span>`;
      const span = td.querySelector('.animated-number');

      // Usa IntersectionObserver para disparar la animación al hacer scroll
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(span, end, suffix, decimals);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counterObserver.observe(td);
    }
  });
});


/* ============================================================
   7. EFECTO RIPPLE EN TARJETAS Y BOTONES
   Al hacer clic en una tarjeta o botón, aparece una onda
   cian que se expande desde el punto de clic y desaparece.
============================================================ */

const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
  /* El elemento padre necesita overflow hidden para que el ripple se corte */
  .ripple-host { overflow: hidden; position: relative; }

  /* La onda en sí */
  .ripple-wave {
    position: absolute;
    border-radius: 50%;
    background: rgba(0,188,212,0.18);
    transform: scale(0);
    animation: rippleExpand 0.55s ease-out forwards;
    pointer-events: none;
  }

  @keyframes rippleExpand {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyles);

// Aplica el efecto ripple a todos los elementos interactivos
document.querySelectorAll('.info-card, .iso-card, .step-card, .btn-primary, .card-link').forEach(el => {
  el.classList.add('ripple-host');

  el.addEventListener('click', (e) => {
    const rect   = el.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    // Calcula la posición del clic relativa al elemento
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${x}px;
      top:    ${y}px;
    `;

    el.appendChild(wave);

    // Elimina el elemento del DOM cuando termina la animación
    wave.addEventListener('animationend', () => wave.remove());
  });
});


/* ============================================================
   8. PARALLAX SUAVE EN EL HERO
   El fondo del hero se mueve más lento que el contenido
   al hacer scroll, creando sensación de profundidad.
============================================================ */

const heroContent = document.querySelector('.hero .container');

if (heroContent) {
  let ticking = false; // Evita llamadas redundantes con requestAnimationFrame

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Mueve el contenido del hero a la mitad de la velocidad del scroll
        heroContent.style.transform = `translateY(${scrollY * 0.28}px)`;
        heroContent.style.opacity   = Math.max(0, 1 - scrollY / 520) + '';
        ticking = false;
      });
      ticking = true;
    }
  });
}


/* ============================================================
   9. HIGHLIGHT DE SECCIÓN ACTIVA EN EL MENÚ
   Agrega un indicador visual (línea cian) debajo del ítem
   activo del menú, que se desliza suavemente entre ítems.
============================================================ */

const navStyles = document.createElement('style');
navStyles.textContent = `
  /* Línea indicadora que se mueve bajo el ítem activo */
  .nav-indicator {
    position: absolute;
    bottom: -2px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00bcd4, transparent);
    border-radius: 1px;
    transition: left 0.35s cubic-bezier(0.22, 0.68, 0, 1.2),
                width 0.35s cubic-bezier(0.22, 0.68, 0, 1.2);
    pointer-events: none;
    box-shadow: 0 0 8px rgba(0,188,212,0.7);
  }
`;
document.head.appendChild(navStyles);

const navList = document.querySelector('.nav-list');

if (navList) {
  navList.style.position = 'relative';

  // Crea el indicador y lo agrega a la lista de navegación
  const indicator = document.createElement('div');
  indicator.className = 'nav-indicator';
  navList.appendChild(indicator);

  // Mueve el indicador al ítem activo
  function moveIndicator(activeLink) {
    if (!activeLink) return;
    const listRect = navList.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    indicator.style.left  = (linkRect.left - listRect.left) + 'px';
    indicator.style.width = linkRect.width + 'px';
  }

  // Observa cambios en la clase "active" de los enlaces del menú
  const linkObserver = new MutationObserver(() => {
    const activeLink = navList.querySelector('a.active');
    moveIndicator(activeLink);
  });

  document.querySelectorAll('.nav-list a').forEach(link => {
    linkObserver.observe(link, { attributes: true, attributeFilter: ['class'] });
  });
}


/* ============================================================
   10. MENÚ HAMBURGUESA PARA MÓVIL
   En pantallas pequeñas, el menú se oculta y se muestra
   un botón de hamburguesa que despliega los enlaces.
============================================================ */

const hamburgerStyles = document.createElement('style');
hamburgerStyles.textContent = `
  /* Botón hamburguesa: solo visible en móvil */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: none;
    padding: 6px;
    z-index: 1001;
  }

  /* Cada línea del ícono hamburguesa */
  .hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #b0bec5;
    border-radius: 1px;
    transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease;
  }

  /* Transforma el ícono en X cuando el menú está abierto */
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: #00bcd4; }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: #00bcd4; }

  /* En móvil, el menú se convierte en panel lateral */
  @media (max-width: 900px) {
    .hamburger { display: flex; }

    .main-nav {
      display: block !important;
      position: fixed;
      top: 68px;
      right: 0;
      bottom: 0;
      width: 260px;
      background: rgba(10,13,15,0.96);
      backdrop-filter: blur(30px) saturate(160%);
      -webkit-backdrop-filter: blur(30px) saturate(160%);
      border-left: 1px solid rgba(255,255,255,0.08);
      padding: 2rem 1.5rem;
      transform: translateX(100%);
      transition: transform 0.38s cubic-bezier(0.22, 0.68, 0, 1.2);
      z-index: 900;
    }

    /* Estado abierto del menú móvil */
    .main-nav.nav-open {
      transform: translateX(0);
    }

    /* Ítems del menú en vertical */
    .nav-list {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .nav-list > li > a {
      font-size: 1rem;
      padding: 0.75rem 1rem;
      width: 100%;
    }

    /* El submenú se muestra siempre en móvil, no al hover */
    .dropdown {
      position: static;
      transform: none !important;
      opacity: 1 !important;
      pointer-events: all !important;
      background: rgba(255,255,255,0.03);
      border: none;
      box-shadow: none;
      padding: 0 0 0 1rem;
      margin-top: 0.25rem;
    }
  }
`;
document.head.appendChild(hamburgerStyles);

// Crea el botón hamburguesa
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.setAttribute('aria-label', 'Abrir menu');
hamburger.innerHTML = '<span></span><span></span><span></span>';

// Lo inserta en el header-inner antes del nav
const headerInner = document.querySelector('.header-inner');
const mainNav     = document.querySelector('.main-nav');

if (headerInner && mainNav) {
  headerInner.insertBefore(hamburger, mainNav);

  // Alterna el estado del menú al hacer clic
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('nav-open');
  });

  // Cierra el menú al hacer clic en un enlace
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mainNav.classList.remove('nav-open');
    });
  });
}


/* ============================================================
   11. GLITCH EFFECT EN EL LOGO AL HOVER
   Al pasar el cursor sobre el logo, el texto tiene un
   efecto glitch cian por 400ms, como un fallo de señal.
============================================================ */

const glitchStyles = document.createElement('style');
glitchStyles.textContent = `
  /* Animación de glitch: desplazamiento horizontal rápido */
  @keyframes glitch {
    0%   { text-shadow: none; transform: none; }
    20%  { text-shadow: -2px 0 #00bcd4, 2px 0 rgba(0,188,212,0.4); transform: skewX(-3deg); }
    40%  { text-shadow: 2px 0 #00e5ff, -2px 0 rgba(0,151,167,0.6); transform: skewX(3deg); }
    60%  { text-shadow: -1px 0 #00bcd4; transform: skewX(-1deg); }
    80%  { text-shadow: 1px 0 #00e5ff; transform: skewX(0deg); }
    100% { text-shadow: none; transform: none; }
  }

  .glitch-active {
    animation: glitch 0.4s steps(2, end) both;
  }
`;
document.head.appendChild(glitchStyles);

const siteTitle = document.querySelector('.site-title');

if (siteTitle) {
  const logoArea = siteTitle.closest('.logo-area') || siteTitle;

  logoArea.addEventListener('mouseenter', () => {
    siteTitle.classList.add('glitch-active');
    // Quita la clase al terminar la animación para que se pueda repetir
    siteTitle.addEventListener('animationend', () => {
      siteTitle.classList.remove('glitch-active');
    }, { once: true }); // "once: true" elimina el listener automáticamente
  });
}


/* ============================================================
   12. TOAST DE BIENVENIDA
   Aparece en la esquina inferior izquierda al cargar la
   página y se desvanece automáticamente después de 4s.
============================================================ */

const toastStyles = document.createElement('style');
toastStyles.textContent = `
  /* Panel de notificación toast */
  .welcome-toast {
    position: fixed;
    bottom: 1.75rem;
    left: 1.75rem;
    z-index: 9000;
    background: rgba(10,13,15,0.88);
    border: 1px solid rgba(0,188,212,0.25);
    border-radius: 14px;
    padding: 0.9rem 1.25rem;
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
    max-width: 280px;
    transform: translateY(20px);
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,0.68,0,1.2);
  }

  /* Estado visible del toast */
  .welcome-toast.toast-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Punto verde de estado activo */
  .toast-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00bcd4;
    box-shadow: 0 0 8px #00bcd4;
    animation: pulse 1.5s ease-in-out infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  .toast-title {
    font-size: 0.78rem;
    font-weight: 600;
    color: #e8ecef;
    letter-spacing: 0.04em;
    display: block;
    margin-bottom: 4px;
  }

  .toast-body {
    font-size: 0.75rem;
    color: #546e7a;
    line-height: 1.5;
  }
`;
document.head.appendChild(toastStyles);

// Crea el toast
const toast = document.createElement('div');
toast.className = 'welcome-toast';
toast.innerHTML = `
  <span class="toast-title">
    <span class="toast-dot"></span>Modulo cargado
  </span>
  <span class="toast-body">Mantenimiento y Aseguramiento de Sistemas Informaticos</span>
`;
document.body.appendChild(toast);

// Muestra el toast 800ms después de cargar la página
setTimeout(() => toast.classList.add('toast-visible'), 800);

// Lo oculta después de 4s y lo elimina del DOM
setTimeout(() => {
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  setTimeout(() => toast.remove(), 500);
}, 4500);