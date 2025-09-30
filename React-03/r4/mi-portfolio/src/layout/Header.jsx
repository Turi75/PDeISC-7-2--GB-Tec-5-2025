
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './Header.module.css'; 

function Header({ session }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); 
  };

  return (
    <header className={styles.header}>
      {}
      <Link to="/" className={styles.logo}>mi portfolio</Link>
      
      <nav className={styles.nav}>
        {}
        <a href="/#proyectos">proyectos</a>
        <a href="/#experiencia">experiencia</a>
        <a href="/#contacto">contacto</a>
        
        {}
        {session ? (
          <button onClick={handleLogout} className={styles.loginButton}>
            cerrar sesión
          </button>
        ) : (
          <Link to="/login" className={styles.loginButton}>
            login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;