import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import styles from './Experiencia.module.css';

function Experiencia() {
  const [experiencias, setExperiencias] = useState([]);
  
  useEffect(() => {
    async function getExperiencias() {
      const { data } = await supabase.from('experiencia').select('*').order('fecha_inicio', { ascending: false });
      if (data) setExperiencias(data);
    }
    getExperiencias();
  }, []);

  return (
    <section id="experiencia">
      <h2>experiencia</h2>
      <div className={styles.timeline}>
        {experiencias.map((exp, index) => (
          <div key={exp.id} className={`${styles.container} ${index % 2 === 0 ? styles.left : styles.right}`}>
            <div className={styles.content}>
              <h3>{exp.puesto} en {exp.empresa}</h3>
              {}
              <p>{exp.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experiencia;