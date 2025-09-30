import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import adminStyles from '../pages/AdminPage.module.css';

function GestionarProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tecnologias, setTecnologias] = useState(''); 
  
  const [editando, setEditando] = useState(false);
  const [proyectoActualId, setProyectoActualId] = useState(null);

  useEffect(() => {
    getProyectos();
  }, []);

  async function getProyectos() {
    setLoading(true);
    const { data, error } = await supabase.from('proyectos').select('*').order('id');
    if (error) console.error('error fetching proyectos:', error);
    else setProyectos(data);
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) return;
    
    const tecnologiasArray = tecnologias.split(',').map(tech => tech.trim());
    const proyectoData = { nombre, descripcion, tecnologias: tecnologiasArray };
    let error;

    if (editando) {
      ({ error } = await supabase.from('proyectos').update(proyectoData).match({ id: proyectoActualId }));
    } else {
      ({ error } = await supabase.from('proyectos').insert(proyectoData));
    }

    if (error) {
      alert(error.message);
    } else {
      cancelarEdicion();
      getProyectos();
    }
  };

  const iniciarEdicion = (pro) => {
    setEditando(true);
    setProyectoActualId(pro.id);
    setNombre(pro.nombre);
    setDescripcion(pro.descripcion || '');
    setTecnologias(pro.tecnologias.join(', ')); 
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setProyectoActualId(null);
    setNombre('');
    setDescripcion('');
    setTecnologias('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿seguro?')) {
      const { error } = await supabase.from('proyectos').delete().match({ id });
      if (error) alert(error.message);
      else getProyectos();
    }
  };

  if (loading) return <p>cargando proyectos...</p>;

  return (
    <div>
      <h3>{editando ? 'editando proyecto' : 'agregar nuevo proyecto'}</h3>
      <form onSubmit={handleSubmit} className={adminStyles.form} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <input type="text" placeholder="nombre del proyecto" value={nombre} onChange={e => setNombre(e.target.value)} className={adminStyles.input} />
        <textarea placeholder="descripción..." value={descripcion} onChange={e => setDescripcion(e.target.value)} className={adminStyles.input} />
        <input type="text" placeholder="tecnologías (separadas por coma)" value={tecnologias} onChange={e => setTecnologias(e.target.value)} className={adminStyles.input} />
     <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}> {/* Nuevo div con estilos inline */}
            <button type="submit" className={adminStyles.button}>{editando ? 'guardar cambios' : 'agregar'}</button>
            {editando && <button type="button" onClick={cancelarEdicion} className={adminStyles.button}>cancelar</button>}
        </div>
      </form>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #3a3a3c' }} />

      <h3>proyectos actuales</h3>
      <ul className={adminStyles.itemList}>
        {proyectos.map(pro => (
          <li key={pro.id} className={adminStyles.item}>
            <div>
              <strong>{pro.nombre}</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{pro.descripcion}</p>
            </div>
            <div className={adminStyles.itemActions}>
              <button onClick={() => iniciarEdicion(pro)} className={adminStyles.editButton}>editar</button>
              <button onClick={() => handleDelete(pro.id)} className={adminStyles.deleteButton}>eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestionarProyectos;