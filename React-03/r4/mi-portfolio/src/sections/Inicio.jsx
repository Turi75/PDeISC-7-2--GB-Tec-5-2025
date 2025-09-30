import React from 'react';
import styles from './Inicio.module.css'; 

function Inicio() {
  return (
    
    <section id="inicio" className={styles.inicio}>
      <h2 className={styles.titulo}>Joaquín Turi</h2>
      <p className={styles.subtitulo}>desarrollador web | apasionado por la tecnología</p>
    </section>
  );
}

export default Inicio;