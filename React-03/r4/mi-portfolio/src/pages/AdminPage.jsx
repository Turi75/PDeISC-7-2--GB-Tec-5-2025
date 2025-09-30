import React, { useState } from 'react';
import GestionarHabilidades from '../components/GestionarHabilidades';
import GestionarExperiencia from '../components/GestionarExperiencia';
import GestionarProyectos from '../components/GestionarProyectos';
import styles from './AdminPage.module.css'; 

function AdminPage() {
  const [vista, setVista] = useState('habilidades');

  return (
    <section>
      <h2>panel de administración</h2>
      <p>bienvenido! desde aquí podés editar tu portfolio.</p>
      
      <nav className={styles.nav}>
        <button 
          onClick={() => setVista('habilidades')} 
          className={`${styles.navButton} ${vista === 'habilidades' ? styles.active : ''}`}
        >
          gestionar habilidades
        </button>
        <button 
          onClick={() => setVista('experiencia')}
          className={`${styles.navButton} ${vista === 'experiencia' ? styles.active : ''}`}
        >
          gestionar experiencia
        </button>
        <button 
          onClick={() => setVista('proyectos')}
          className={`${styles.navButton} ${vista === 'proyectos' ? styles.active : ''}`}
        >
          gestionar proyectos
        </button>
      </nav>

      {vista === 'habilidades' && <GestionarHabilidades />}
      {vista === 'experiencia' && <GestionarExperiencia />}
      {vista === 'proyectos' && <GestionarProyectos />}
      
    </section>
  );
}

export default AdminPage;