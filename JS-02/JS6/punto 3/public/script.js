// script.js
// Obtiene todos los usuarios y filtra en vivo por nombre

class BuscadorUsuarios {
    constructor(idContenedor, idFiltro) {
      this.contenedor   = document.getElementById(idContenedor);
      this.entradaFiltro = document.getElementById(idFiltro);
      this.usuarios     = [];
      this.inicializar();
    }
  
    inicializar() {
      this.entradaFiltro.addEventListener('input', () => {
        const texto = this.entradaFiltro.value.trim().toLowerCase();
        const filtrados = this.usuarios.filter(usuario =>
          usuario.name.toLowerCase().includes(texto)
        );
        this.mostrar(filtrados);
      });
      this.cargarUsuarios();
    }
  
    async cargarUsuarios() {
      try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/users');
        this.usuarios = await resp.json();
        this.mostrar(this.usuarios);
      } catch {
        this.contenedor.innerHTML = '<p>Error al cargar usuarios.</p>';
      }
    }
  
    mostrar(lista) {
      this.contenedor.innerHTML = '';
      if (lista.length === 0) {
        this.contenedor.innerHTML = '<p>No se encontraron coincidencias.</p>';
        return;
      }
      lista.forEach(u => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        tarjeta.innerHTML = `<p><strong>${u.name}</strong></p><p>${u.email}</p>`;
        this.contenedor.appendChild(tarjeta);
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new BuscadorUsuarios('contenedorUsuarios', 'entradaFiltro');
  });