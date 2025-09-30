import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import styles from './Proyectos.module.css';

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProyectos() {
      setLoading(true);
      const { data, error } = await supabase.from('proyectos').select('*');
      if (error) console.error('Error fetching proyectos:', error);
      else setProyectos(data);
      setLoading(false);
    }
    getProyectos();
  }, []);

  if (loading) {
    return <section id="proyectos"><p>Cargando proyectos...</p></section>;
  }

  return (
    <section id="proyectos">
      <h2 className={styles.sectionTitle}>mis proyectos</h2>
      <div className={styles.proyectosGrid}>
        {}
        {proyectos.map(proyecto => (
          <div key={proyecto.id} className={styles.card}>
            <h3>{proyecto.nombre}</h3>
            <p>{proyecto.descripcion}</p>
            <ul className={styles.tecnologias}>
              {proyecto.tecnologias.map(tech => (
                <li key={tech} className={styles.tag}>{tech}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Proyectos;