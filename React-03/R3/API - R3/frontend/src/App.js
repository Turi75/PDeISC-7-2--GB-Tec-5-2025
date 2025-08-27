import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', apellido: '', email: '', celular: '' });
  const [errores, setErrores] = useState({});

  const [editandoId, setEditandoId] = useState(null);
  const [datosEditados, setDatosEditados] = useState({});
  const [erroresEdicion, setErroresEdicion] = useState({});

  const fetchUsuarios = () => {
    axios.get('http://localhost:5000/usuarios')
      .then(response => { setUsuarios(response.data); })
      .catch(error => { console.error('¡hubo un error al obtener los usuarios!', error); });
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'celular' ? value : value.toLowerCase();
    setNuevoUsuario({ ...nuevoUsuario, [name]: finalValue });
  };

  const validarFormulario = (datos) => {
    let erroresFormulario = {};
    const soloLetras = /^[a-zA-Z\s]+$/;

    if (!datos.nombre?.trim()) erroresFormulario.nombre = "el nombre es obligatorio.";
    else if (datos.nombre.trim().length < 2) erroresFormulario.nombre = "debe tener al menos 2 letras.";
    else if (!soloLetras.test(datos.nombre)) erroresFormulario.nombre = "el nombre solo puede contener letras.";

    if (!datos.apellido?.trim()) erroresFormulario.apellido = "el apellido es obligatorio.";
    else if (datos.apellido.trim().length < 2) erroresFormulario.apellido = "debe tener al menos 2 letras.";
    else if (!soloLetras.test(datos.apellido)) erroresFormulario.apellido = "el apellido solo puede contener letras.";

    if (!datos.email?.trim()) erroresFormulario.email = "el email es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(datos.email)) erroresFormulario.email = "el formato del email no es válido.";

    if (datos.celular && datos.celular.length < 8) erroresFormulario.celular = "debe tener al menos 8 caracteres.";
    
    return erroresFormulario;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresDetectados = validarFormulario(nuevoUsuario);
    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    setErrores({});
    axios.post('http://localhost:5000/usuarios', nuevoUsuario)
      .then(() => {
        fetchUsuarios();
        setNuevoUsuario({ nombre: '', apellido: '', email: '', celular: '' });
      })
      .catch(error => { console.error('¡hubo un error al crear el usuario!', error); });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/usuarios/${id}`)
      .then(() => { fetchUsuarios(); })
      .catch(error => { console.error('¡hubo un error al eliminar el usuario!', error); });
  };

  const handleEditClick = (usuario) => {
    setEditandoId(usuario.id);
    setDatosEditados(usuario);
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
    setErroresEdicion({});
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'celular' ? value : value.toLowerCase();
    setDatosEditados({ ...datosEditados, [name]: finalValue });
  };

  const handleUpdate = (id) => {
    const erroresDetectados = validarFormulario(datosEditados);
    if (Object.keys(erroresDetectados).length > 0) {
      setErroresEdicion(erroresDetectados);
      return;
    }

    axios.put(`http://localhost:5000/usuarios/${id}`, datosEditados)
      .then(() => {
        fetchUsuarios();
        setEditandoId(null);
        setErroresEdicion({});
      })
      .catch(error => { console.error('¡hubo un error al actualizar el usuario!', error); });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>gestión de usuarios</h1>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <input type="text" name="nombre" placeholder="nombre" value={nuevoUsuario.nombre} onChange={handleInputChange}/>
            {errores.nombre && <p className="error-message">{errores.nombre}</p>}
          </div>
          <div className="form-group">
            <input type="text" name="apellido" placeholder="apellido" value={nuevoUsuario.apellido} onChange={handleInputChange}/>
            {errores.apellido && <p className="error-message">{errores.apellido}</p>}
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="email" value={nuevoUsuario.email} onChange={handleInputChange}/>
            {errores.email && <p className="error-message">{errores.email}</p>}
          </div>
          <div className="form-group">
            <input type="text" name="celular" placeholder="celular" value={nuevoUsuario.celular} onChange={handleInputChange}/>
            {errores.celular && <p className="error-message">{errores.celular}</p>}
          </div>
          <button type="submit">agregar usuario</button>
        </form>

        <h2>lista de usuarios</h2>
        <ul className="user-list">
          {usuarios.map(usuario => (
            <li key={usuario.id} className="user-item">
              {editandoId === usuario.id ? (
                <div className="edit-form">
                  <div className="form-group">
                    <input type="text" name="nombre" value={datosEditados.nombre} onChange={handleEditInputChange} className="edit-input"/>
                    {erroresEdicion.nombre && <p className="error-message">{erroresEdicion.nombre}</p>}
                  </div>
                  <div className="form-group">
                    <input type="text" name="apellido" value={datosEditados.apellido} onChange={handleEditInputChange} className="edit-input"/>
                    {erroresEdicion.apellido && <p className="error-message">{erroresEdicion.apellido}</p>}
                  </div>
                  <div className="form-group">
                    <input type="email" name="email" value={datosEditados.email} onChange={handleEditInputChange} className="edit-input"/>
                    {erroresEdicion.email && <p className="error-message">{erroresEdicion.email}</p>}
                  </div>
                  <div className="form-group">
                    <input type="text" name="celular" value={datosEditados.celular} onChange={handleEditInputChange} className="edit-input"/>
                    {erroresEdicion.celular && <p className="error-message">{erroresEdicion.celular}</p>}
                  </div>
                  <div className="button-group">
                    <button onClick={() => handleUpdate(usuario.id)} className="save-button">guardar</button>
                    <button onClick={handleCancelEdit} className="cancel-button">cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <span>{usuario.nombre} {usuario.apellido} ({usuario.email})</span>
                  <div className="button-group">
                    <button onClick={() => handleEditClick(usuario)} className="edit-button">editar</button>
                    <button onClick={() => handleDelete(usuario.id)} className="delete-button">borrar</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;