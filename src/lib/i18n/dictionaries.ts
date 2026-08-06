export type Locale = 'es' | 'en';

export interface ExpertiseItem {
  title: string;
  description: string;
  tags: string[];
  area: string;
  featured?: boolean;
  row: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  gradient: string;
  featured?: boolean;
  href?: string;
  images?: string[];
}

export interface Dictionary {
  header: {
    nav: {
      about: string;
      expertise: string;
      work: string;
      contact: string;
    };
    cta: string;
  };
  hero: {
    tagline: string;
    cta: string;
    scroll: string;
  };
  manifesto: {
    label: string;
    text: string;
  };
  expertise: {
    label: string;
    heading: string;
    items: ExpertiseItem[];
  };
  caseStudies: {
    label: string;
    heading: string;
    endText: string;
    projects: ProjectItem[];
  };
  footer: {
    ctaHeadingLine1: string;
    ctaHeadingLine2: string;
    ctaButton: string;
    labelEmail: string;
    labelPhone: string;
    labelSocials: string;
    founderName: string;
    founderRole: string;
    founderBio: string;
    credit: string;
  };
  hora: {
    back: string;
    category: string;
    subtitle: string;
    demoCta: string;
    tags: string[];
    cards: {
      dashboard: {
        title: string;
        desc: string;
      };
      canvas: {
        title: string;
        part1: string;
        code: string;
        part2: string;
      };
      localFirst: {
        title: string;
        part1: string;
        code1: string;
        part2: string;
        code2: string;
        part3: string;
      };
      config: {
        title: string;
        desc: string;
      };
    };
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    header: {
      nav: {
        about: 'Nosotros',
        expertise: 'Expertise',
        work: 'Trabajo',
        contact: 'Contacto',
      },
      cta: 'Hablemos',
    },
    hero: {
      tagline: 'Software a medida, de la idea al detalle.',
      cta: 'Iniciemos un proyecto',
      scroll: 'Scroll',
    },
    manifesto: {
      label: 'Nuestro enfoque',
      text: 'No construimos software genérico. Diseñamos sistemas que resuelven problemas reales con arquitecturas sólidas, código que escala y experiencias que las personas recuerdan.',
    },
    expertise: {
      label: 'Lo que hacemos',
      heading: 'Expertise',
      items: [
        {
          title: 'Arquitectura Backend',
          description:
            'Sistemas robustos y escalables. APIs REST y GraphQL, microservicios, colas de mensajes, y bases de datos optimizadas para cargas de trabajo reales.',
          tags: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis'],
          area: 'backend',
          featured: true,
          row: 0,
        },
        {
          title: 'Frontend Interactivo',
          description:
            'Interfaces que trascienden lo convencional. Animaciones fluidas, WebGL, canvas, y experiencias que los usuarios recuerdan.',
          tags: ['React', 'Next.js', 'Three.js', 'GSAP', 'WebGL'],
          area: 'frontend',
          featured: true,
          row: 0,
        },
        {
          title: 'Sistemas de Gestión',
          description:
            'ERPs, control de stock, facturación, punto de venta. Software que maneja la complejidad real del negocio.',
          tags: ['ERP', 'POS', 'Inventario', 'Facturación'],
          area: 'erp',
          row: 1,
        },
        {
          title: 'Infraestructura',
          description:
            'Deploy automatizado, CI/CD, monitoreo. Infraestructura que no deja de funcionar.',
          tags: ['Docker', 'AWS', 'CI/CD', 'Linux'],
          area: 'infra',
          row: 1,
        },
        {
          title: 'Diseño de Producto',
          description:
            'Desde la investigación de usuario hasta el pixel final. Diseño que resuelve, no que decora.',
          tags: ['UI/UX', 'Figma', 'Design Systems', 'Prototipado'],
          area: 'design',
          row: 1,
        },
      ],
    },
    caseStudies: {
      label: 'Casos de estudio',
      heading: 'El trabajo',
      endText: 'Más proyectos próximamente',
      projects: [
        {
          id: '01',
          title: 'HORA',
          category: 'SaaS / Aplicación Web',
          description:
            'Sistema premium de gestión para playas de estacionamiento. Arquitectura Local-First, editor Canvas 2D.',
          year: '2026',
          gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          featured: true,
          href: '/work/hora',
          images: ['/images/hora_dashboard.png', '/images/hora_map.png', '/images/hora_mobile.png'],
        },
        {
          id: '02',
          title: 'Sistema de Gestión Retail',
          category: 'ERP / Punto de Venta',
          description:
            'Control de stock, ventas, facturación y reportes en tiempo real. Diseñado para la complejidad real del retail.',
          year: '2024',
          gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        },
        {
          id: '03',
          title: 'Tercer Proyecto',
          category: 'Aplicación Web',
          description:
            'Interfaz interactiva con lógica de negocio compleja. Backend escalable, frontend memorable.',
          year: '2024',
          gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1f1f2e 50%, #0d0d1a 100%)',
        },
      ],
    },
    footer: {
      ctaHeadingLine1: '¿Tenés un proyecto',
      ctaHeadingLine2: 'en mente?',
      ctaButton: 'Iniciemos un proyecto',
      labelEmail: 'Email directo',
      labelPhone: 'Teléfono / WhatsApp',
      labelSocials: 'GitHub / Código',
      founderName: 'ENZO FERNANDEZ',
      founderRole: 'Fundador & Desarrollador Full Stack',
      founderBio: 'Diseño e ingeniería de alto rendimiento para negocios que exigen excelencia.',
      credit: 'Diseñado y desarrollado por Mara Studio',
    },
    hora: {
      back: 'Volver',
      category: 'SaaS / Aplicación Web B2B',
      subtitle:
        'Sistema premium de gestión integral para playas de estacionamiento. Reemplazando sistemas obsoletos con una interfaz moderna, fluida y altamente visual.',
      demoCta: 'Visitar Demo en Vivo ↗',
      tags: ['React 19', 'Vite', 'Canvas 2D', 'Local-First'],
      cards: {
        dashboard: {
          title: 'Dashboard Táctico',
          desc: 'Control de ingresos y egresos en tiempo real. Validación de patentes, cobro dinámico (fraccionado u horas) y visualización de vehículos activos en tarjetas responsivas.',
        },
        canvas: {
          title: 'Diseñador Visual (Canvas 2D)',
          part1: 'Un lienzo interactivo drag-and-drop renderizado con ',
          code: 'react-konva',
          part2: ' donde el dueño puede dibujar su playa, añadir cocheras, calles y paredes. Las plazas dibujadas se sincronizan con la base de datos de cobro al instante.',
        },
        localFirst: {
          title: 'Arquitectura Local-First',
          part1: 'Construida con React 19 y Javascript puro. La persistencia se maneja localmente abstrayendo ',
          code1: 'localStorage',
          part2: ' vía ',
          code2: 'dbService.js',
          part3: ', logrando tiempos de respuesta de 0ms y resiliencia total frente a cortes de conexión.',
        },
        config: {
          title: 'Configuración Dinámica',
          desc: 'Motor de reglas comerciales complejas (horas pico, tolerancia en minutos, tarifas por categoría de vehículo) aplicables en tiempo real, junto con gestión de abonados y alertas visuales.',
        },
      },
    },
  },

  en: {
    header: {
      nav: {
        about: 'About',
        expertise: 'Expertise',
        work: 'Work',
        contact: 'Contact',
      },
      cta: "Let's talk",
    },
    hero: {
      tagline: 'Custom software engineering, from concept to craftsmanship.',
      cta: 'Start a project',
      scroll: 'Scroll',
    },
    manifesto: {
      label: 'Our approach',
      text: "We don't build generic software. We design resilient systems that solve real problems with solid architectures, scalable code, and digital experiences people remember.",
    },
    expertise: {
      label: 'What we do',
      heading: 'Expertise',
      items: [
        {
          title: 'Backend Architecture',
          description:
            'Robust and scalable engineering. REST and GraphQL APIs, microservices, messaging queues, and databases architected for demanding real-world workloads.',
          tags: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis'],
          area: 'backend',
          featured: true,
          row: 0,
        },
        {
          title: 'Interactive Frontend',
          description:
            'Interfaces that transcend the conventional. Fluid animations, WebGL, 2D canvas, and sensory digital experiences users never forget.',
          tags: ['React', 'Next.js', 'Three.js', 'GSAP', 'WebGL'],
          area: 'frontend',
          featured: true,
          row: 0,
        },
        {
          title: 'Management Systems',
          description:
            'ERPs, intelligent stock control, billing, and point of sale. Enterprise software engineered to untangle real operational complexity.',
          tags: ['ERP', 'POS', 'Inventory', 'Billing'],
          area: 'erp',
          row: 1,
        },
        {
          title: 'Cloud & Infrastructure',
          description:
            'Automated deployments, bulletproof CI/CD pipelines, and active monitoring. Infrastructure engineered for continuous uptime.',
          tags: ['Docker', 'AWS', 'CI/CD', 'Linux'],
          area: 'infra',
          row: 1,
        },
        {
          title: 'Product Design',
          description:
            'From thorough user research down to the final micro-interaction. Strategic design that solves structural challenges rather than mere decoration.',
          tags: ['UI/UX', 'Figma', 'Design Systems', 'Prototyping'],
          area: 'design',
          row: 1,
        },
      ],
    },
    caseStudies: {
      label: 'Case studies',
      heading: 'Selected work',
      endText: 'More releases coming soon',
      projects: [
        {
          id: '01',
          title: 'HORA',
          category: 'SaaS / Web Application',
          description:
            'Premium management platform for parking facilities. Powered by a resilient Local-First architecture and an interactive 2D Canvas editor.',
          year: '2026',
          gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          featured: true,
          href: '/work/hora',
          images: ['/images/hora_dashboard.png', '/images/hora_map.png', '/images/hora_mobile.png'],
        },
        {
          id: '02',
          title: 'Retail Management ERP',
          category: 'ERP / Point of Sale',
          description:
            'Real-time stock control, omnichannel sales, automated billing, and actionable analytics. Tailored for the intense pace of contemporary retail.',
          year: '2024',
          gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        },
        {
          id: '03',
          title: 'Enterprise Web Application',
          category: 'Web Application',
          description:
            'An expressive interface driven by deeply complex business rules. Scalable backend architecture matched with a memorable frontend experience.',
          year: '2024',
          gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1f1f2e 50%, #0d0d1a 100%)',
        },
      ],
    },
    footer: {
      ctaHeadingLine1: 'Have a project',
      ctaHeadingLine2: 'in mind?',
      ctaButton: 'Start a project',
      labelEmail: 'Direct Email',
      labelPhone: 'Phone / WhatsApp',
      labelSocials: 'GitHub / Code',
      founderName: 'ENZO FERNANDEZ',
      founderRole: 'Founder & Full Stack Developer',
      founderBio: 'High-performance engineering and product design for ambitious ventures.',
      credit: 'Designed and engineered by Mara Studio',
    },
    hora: {
      back: 'Back to overview',
      category: 'SaaS / B2B Web Application',
      subtitle:
        'A premium, comprehensive management platform for modern parking facilities. Replacing legacy software with a sleek, responsive, and highly visual operational dashboard.',
      demoCta: 'Visit Live Demo ↗',
      tags: ['React 19', 'Vite', 'Canvas 2D', 'Local-First'],
      cards: {
        dashboard: {
          title: 'Tactical Operational Dashboard',
          desc: 'Real-time vehicle check-in and transit monitoring. Automated license plate validation, dynamic fee computation (fractional or hourly rates), and reactive vehicle cards.',
        },
        canvas: {
          title: 'Visual Layout Engineer (2D Canvas)',
          part1: 'An interactive drag-and-drop canvas rendered via ',
          code: 'react-konva',
          part2: ' allowing operators to graphically draw parking slots, aisles, and perimeter walls. Custom drawn spaces instantly synchronize with the core billing engine.',
        },
        localFirst: {
          title: 'Local-First Architecture',
          part1: 'Built on React 19 and modern Javascript. Data persistence is engineered locally by abstracting ',
          code1: 'localStorage',
          part2: ' via ',
          code2: 'dbService.js',
          part3: ', delivering consistent 0ms query latency and total operational resilience during network interruptions.',
        },
        config: {
          title: 'Dynamic Rule Engine',
          desc: 'A sophisticated commercial rules engine supporting peak hour multipliers, grace periods in minutes, and vehicle tier categorizations applied in real-time alongside visual alerts.',
        },
      },
    },
  },
};
