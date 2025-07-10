// script.js
// Clase en español para obtener y mostrar usuarios

class GestorUsuarios {
  constructor(idContenedor) {
    this.contenedor = document.getElementById(idContenedor);
    this.usuarios = [];
  }

  limpiar() {
    this.contenedor.innerHTML = '';
  }

  mostrar(lista) {
    this.limpiar();
    lista.forEach(u => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'tarjeta';
      tarjeta.innerHTML = `<p><strong>${u.name}</strong></p><p>${u.email}</p>`;
      this.contenedor.appendChild(tarjeta);
    });
  }

  descargarJSON() {
    const blob = new Blob([JSON.stringify(this.usuarios, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'usuarios.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  cargarConFetch() {
    fetch('/api/fetch')
      .then(r => r.json())
      .then(datos => {
        this.usuarios = datos;
        this.mostrar(datos);
      })
      .catch(e => console.error('Error Fetch:', e));
  }

  cargarConAxios() {
    axios.get('/api/axios')
      .then(resp => {
        this.usuarios = resp.data;
        this.mostrar(resp.data);
      })
      .catch(e => console.error('Error Axios:', e));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const gestor = new GestorUsuarios('contenedorUsuarios');
  document.getElementById('btnFetch').onclick     = () => gestor.cargarConFetch();
  document.getElementById('btnAxios').onclick     = () => gestor.cargarConAxios();
  document.getElementById('btnDescargar').onclick = () => gestor.descargarJSON();
});