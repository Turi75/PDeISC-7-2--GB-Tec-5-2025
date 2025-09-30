import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import adminStyles from '../pages/AdminPage.module.css'; 

function GestionarHabilidades() {
  const [habilidades, setHabilidades] = useState([]);
  const [nuevaHabilidad, setNuevaHabilidad] = useState('');
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [habilidadActual, setHabilidadActual] = useState(null);

  useEffect(() => {
    getHabilidades();
  }, []);

  async function getHabilidades() {
    setLoading(true);
    const { data, error } = await supabase.from('habilidades').select('*').order('id');
    if (error) console.error(error);
    else setHabilidades(data);
    setLoading(false);
  }

  const handleAddOrUpdateSkill = async (e) => {
    e.preventDefault();
    if (nuevaHabilidad.trim() === '') return;

    let error;
    if (editando) {
      ({ error } = await supabase.from('habilidades').update({ nombre: nuevaHabilidad }).match({ id: habilidadActual.id }));
    } else {
      ({ error } = await supabase.from('habilidades').insert({ nombre: nuevaHabilidad }));
    }

    if (error) alert(error.message);
    else {
      setNuevaHabilidad('');
      setEditando(false);
      setHabilidadActual(null);
      getHabilidades();
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm('¿seguro?')) {
      const { error } = await supabase.from('habilidades').delete().match({ id });
      if (error) alert(error.message);
      else getHabilidades();
    }
  };

  const iniciarEdicion = (habilidad) => {
    setEditando(true);
    setHabilidadActual(habilidad);
    setNuevaHabilidad(habilidad.nombre);
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setHabilidadActual(null);
    setNuevaHabilidad('');
  };

  if (loading) return <p>cargando...</p>;

  return (
    <div>
      <h3>gestionar habilidades</h3>
      <form onSubmit={handleAddOrUpdateSkill} className={adminStyles.form}>
        <input 
          type="text"
          className={adminStyles.input}
          placeholder="nombre de la habilidad"
          value={nuevaHabilidad}
          onChange={(e) => setNuevaHabilidad(e.target.value)}
        />
        <button type="submit" className={adminStyles.button}>
          {editando ? 'guardar cambios' : 'agregar'}
        </button>
        {editando && (
          <button type="button" onClick={cancelarEdicion} className={adminStyles.button}>
            cancelar
          </button>
        )}
      </form>

      <ul className={adminStyles.itemList}>
        {habilidades.map(habilidad => (
          <li key={habilidad.id} className={adminStyles.item}>
            <span>{habilidad.nombre}</span>
            <div className={adminStyles.itemActions}>
              <button onClick={() => iniciarEdicion(habilidad)} className={adminStyles.editButton}>
                editar
              </button>
              <button onClick={() => handleDeleteSkill(habilidad.id)} className={adminStyles.deleteButton}>
                eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestionarHabilidades;