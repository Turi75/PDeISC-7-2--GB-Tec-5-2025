import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // La lógica para el efecto de scroll se mantiene
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'about', label: 'Sobre mí' },
    { id: 'contact', label: 'Contacto' },
    { id: 'experience', label: 'Experiencia' },
  ];

  // El estado 'isMobileMenuOpen' y su lógica han sido eliminados.

  return (
    <header className={`navbar-sticky ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="w-full flex items-center justify-between">
        
        {/* Izquierda: Logo "Portfolio" */}
        <a href="#hero" className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          Portfolio
        </a>

        {/* Derecha: Navegación siempre visible */}
        {/* Se quitaron las clases 'hidden md:flex' y se reemplazaron por 'flex' */}
        <nav className="flex items-center gap-2">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="nav-button">
              {link.label}
            </a>
          ))}
        </nav>
        {}
      </div>
      {}
    </header>
  );
};

export default Navbar;