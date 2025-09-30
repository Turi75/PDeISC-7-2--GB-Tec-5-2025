// src/components/BotonEditar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BotonEditar.module.css';

// Este componente recibe la sesión para saber si mostrarse o no
function BotonEditar({ session }) {
  if (!session) {
    return null; // Si no hay sesión, no renderiza nada
  }

  return (
    <Link to="/admin" className={styles.editButton}>
      editar portfolio
    </Link>
  );
}

export default BotonEditar;