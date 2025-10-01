const { initDatabase, Experience, Project, Skill } = require('../models');

const seedData = async () => {
  try {
    await initDatabase();

    // Limpiar datos existentes
    await Experience.destroy({ where: {} });
    await Project.destroy({ where: {} });
    await Skill.destroy({ where: {} });

    // Seed Experiences
    const experiences = await Experience.bulkCreate([
      {
        company: 'TechCorp Solutions',
        position: 'Senior Full Stack Developer',
        description: 'Lideré el desarrollo de aplicaciones web escalables usando React y Node.js. Implementé arquitecturas microservicios y optimicé el rendimiento de bases de datos.',
        startDate: '2022-01-15',
        endDate: null,
        technologies: 'React, Node.js, PostgreSQL, Docker, AWS'
      },
      {
        company: 'Digital Innovations Inc',
        position: 'Frontend Developer',
        description: 'Desarrollé interfaces de usuario interactivas y responsivas. Colaboré con equipos UX/UI para implementar diseños modernos y accesibles.',
        startDate: '2020-06-01',
        endDate: '2021-12-31',
        technologies: 'React, TypeScript, Redux, Tailwind CSS, Jest'
      },
      {
        company: 'StartupHub',
        position: 'Junior Web Developer',
        description: 'Participé en el desarrollo de múltiples proyectos web. Aprendí buenas prácticas de desarrollo y metodologías ágiles.',
        startDate: '2019-03-10',
        endDate: '2020-05-30',
        technologies: 'JavaScript, HTML, CSS, Bootstrap, Git'
      }
    ]);

    // Seed Projects
    const projects = await Project.bulkCreate([
      {
        title: 'E-Commerce Platform',
        description: 'Plataforma completa de comercio electrónico con carrito de compras, sistema de pagos integrado y panel de administración. Incluye gestión de inventario en tiempo real.',
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
        demoUrl: 'https://demo-ecommerce.example.com',
        githubUrl: 'https://github.com/usuario/ecommerce',
        technologies: 'React, Node.js, MongoDB, Stripe, Redux',
        featured: true
      },
      {
        title: 'Task Management App',
        description: 'Aplicación de gestión de tareas con tableros Kanban, colaboración en tiempo real y notificaciones. Permite organizar proyectos de forma eficiente.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        demoUrl: 'https://demo-tasks.example.com',
        githubUrl: 'https://github.com/usuario/task-app',
        technologies: 'React, Firebase, Material-UI, WebSockets',
        featured: true
      },
      {
        title: 'Weather Dashboard',
        description: 'Dashboard interactivo del clima con pronósticos de 7 días, mapas interactivos y alertas meteorológicas. Consume APIs de servicios meteorológicos.',
        imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
        demoUrl: 'https://demo-weather.example.com',
        githubUrl: 'https://github.com/usuario/weather-app',
        technologies: 'React, OpenWeather API, Chart.js, Tailwind',
        featured: false
      },
      {
        title: 'Social Media Dashboard',
        description: 'Panel de análisis para redes sociales con métricas en tiempo real, gráficos interactivos y exportación de reportes.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        demoUrl: null,
        githubUrl: 'https://github.com/usuario/social-dashboard',
        technologies: 'React, D3.js, Express, PostgreSQL',
        featured: true
      },
      {
        title: 'Portfolio CMS',
        description: 'Sistema de gestión de contenidos personalizado para portfolios con editor WYSIWYG y optimización SEO.',
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
        demoUrl: 'https://demo-cms.example.com',
        githubUrl: null,
        technologies: 'Next.js, Prisma, MySQL, TipTap',
        featured: false
      }
    ]);

    // Seed Skills
    const skills = await Skill.bulkCreate([
      // Frontend
      { name: 'React', category: 'Frontend', level: 95, icon: '⚛️' },
      { name: 'JavaScript', category: 'Frontend', level: 90, icon: '📜' },
      { name: 'TypeScript', category: 'Frontend', level: 85, icon: '🔷' },
      { name: 'HTML5', category: 'Frontend', level: 95, icon: '🌐' },
      { name: 'CSS3', category: 'Frontend', level: 90, icon: '🎨' },
      { name: 'Tailwind CSS', category: 'Frontend', level: 88, icon: '💨' },
      { name: 'Redux', category: 'Frontend', level: 80, icon: '🔄' },
      { name: 'Next.js', category: 'Frontend', level: 82, icon: '▲' },
      
      // Backend
      { name: 'Node.js', category: 'Backend', level: 90, icon: '🟢' },
      { name: 'Express', category: 'Backend', level: 88, icon: '🚂' },
      { name: 'PostgreSQL', category: 'Backend', level: 85, icon: '🐘' },
      { name: 'MongoDB', category: 'Backend', level: 80, icon: '🍃' },
      { name: 'REST APIs', category: 'Backend', level: 92, icon: '🔌' },
      { name: 'GraphQL', category: 'Backend', level: 75, icon: '◈' },
      
      // Tools & Others
      { name: 'Git', category: 'Tools', level: 90, icon: '📦' },
      { name: 'Docker', category: 'Tools', level: 78, icon: '🐳' },
      { name: 'AWS', category: 'Tools', level: 72, icon: '☁️' },
      { name: 'Jest', category: 'Tools', level: 80, icon: '🃏' },
      { name: 'Webpack', category: 'Tools', level: 75, icon: '📦' },
      { name: 'Figma', category: 'Tools', level: 70, icon: '🎨' }
    ]);

    console.log('✅ Base de datos poblada exitosamente!');
    console.log(`   - ${experiences.length} experiencias creadas`);
    console.log(`   - ${projects.length} proyectos creados`);
    console.log(`   - ${skills.length} habilidades creadas`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedData();