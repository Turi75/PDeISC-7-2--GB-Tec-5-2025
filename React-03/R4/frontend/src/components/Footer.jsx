import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Columna 1: Logo y Descripción */}
          <div className="footer-column">
            <a href="#hero" className="text-2xl font-bold gradient-text mb-4 inline-block">Portfolio</a>
            <p>Full Stack Developer creando soluciones digitales, elegantes y funcionales.</p>
          </div>
          {/* Columna 2: Navegación */}
          <div className="footer-column">
            <h4>Navegación</h4>
            <a href="#about">Sobre Mí</a>
            <a href="#projects">Proyectos</a>
            <a href="#experience">Experiencia</a>
            <a href="#contact">Contacto</a>
          </div>
          {/* Columna 3: Social */}
          <div className="footer-column">
            <h4>Social</h4>
            <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          {/* Columna 4: Contacto */}
          <div className="footer-column">
            <h4>Contacto</h4>
            <a href="mailto:alex.rivera@example.com">RamiroGarcia@example.com</a>
          </div>
        </div>
        <div className="footer-copyright">
          <p>© {currentYear} Ramiro Garcia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;