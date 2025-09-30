import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import adminStyles from '../pages/AdminPage.module.css'; 

function GestionarExperiencia() {
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [puesto, setPuesto] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [editando, setEditando] = useState(false);
  const [experienciaActualId, setExperienciaActualId] = useState(null);

  useEffect(() => {
    getExperiencias();
  }, []);

  async function getExperiencias() {
    setLoading(true);
    const { data, error } = await supabase.from('experiencia').select('*').order('id');
    if (error) console.error('Error fetching experiencias:', error);
    else setExperiencias(data);
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!puesto || !empresa) return;

    const experienciaData = { puesto, empresa, descripcion };
    let error;

    if (editando) {
      ({ error } = await supabase.from('experiencia').update(experienciaData).match({ id: experienciaActualId }));
    } else {
      ({ error } = await supabase.from('experiencia').insert(experienciaData));
    }

    if (error) {
      alert(error.message);
    } else {
      cancelarEdicion();
      getExperiencias();
    }
  };

  const iniciarEdicion = (exp) => {
    setEditando(true);
    setExperienciaActualId(exp.id);
    setPuesto(exp.puesto);
    setEmpresa(exp.empresa);
    setDescripcion(exp.descripcion || '');
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setExperienciaActualId(null);
    setPuesto('');
    setEmpresa('');
    setDescripcion('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿seguro?')) {
      const { error } = await supabase.from('experiencia').delete().match({ id });
      if (error) alert(error.message);
      else getExperiencias();
    }
  };

  if (loading) return <p>cargando experiencias...</p>;

  return (
    <div>
      <h3>{editando ? 'editando experiencia' : 'agregar nueva experiencia'}</h3>
      {}
      <form onSubmit={handleSubmit} className={adminStyles.form} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <input type="text" placeholder="puesto" value={puesto} onChange={e => setPuesto(e.target.value)} className={adminStyles.input} />
        <input type="text" placeholder="empresa" value={empresa} onChange={e => setEmpresa(e.target.value)} className={adminStyles.input} />
        <textarea placeholder="descripción..." value={descripcion} onChange={e => setDescripcion(e.target.value)} className={adminStyles.input} />
       <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}> {}
            <button type="submit" className={adminStyles.button}>{editando ? 'guardar cambios' : 'agregar'}</button>
            {editando && <button type="button" onClick={cancelarEdicion} className={adminStyles.button}>cancelar</button>}
        </div>
      </form>

      <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #3a3a3c' }} />

      <h3>experiencias actuales</h3>
      <ul className={adminStyles.itemList}>
        {experiencias.map(exp => (
          <li key={exp.id} className={adminStyles.item}>
            <div>
                <strong>{exp.puesto}</strong> en {exp.empresa}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{exp.descripcion}</p>
            </div>
            <div className={adminStyles.itemActions}>
              <button onClick={() => iniciarEdicion(exp)} className={adminStyles.editButton}>editar</button>
              <button onClick={() => handleDelete(exp.id)} className={adminStyles.deleteButton}>eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestionarExperiencia;