// src/components/Footer.jsx
import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer id="contacto" className={styles.footer}>
      <div className={styles.footerContent}>
        <h3>contacto</h3>
        <p>¿interesado en colaborar? ¡hablemos!</p>
        <ul className={styles.socialLinks}>
          <li><a href="mailto:joaquin.turi@example.com">email</a></li>
          <li><a href="https://www.linkedin.com/in/ianolejnik/" target="_blank" rel="noopener noreferrer">linkedin</a></li>
          <li><a href="https://github.com/428hz" target="_blank" rel="noopener noreferrer">github</a></li>
        </ul>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {anioActual} Joaquín Turi. todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;