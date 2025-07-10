// script.js
// Envío de formulario con Fetch y Axios, muestra el ID de respuesta

document.addEventListener('DOMContentLoaded', () => {
    const formFetch  = document.getElementById('formFetch');
    const formAxios  = document.getElementById('formAxios');
    const errorEnvio = document.getElementById('errorEnvio');
    const contResp   = document.getElementById('respuesta');
  
    formFetch.addEventListener('submit', async e => {
      e.preventDefault();
      errorEnvio.textContent = ''; contResp.textContent = '';
      const nombre = document.getElementById('entradaNombre').value.trim();
      const email  = document.getElementById('entradaEmail').value.trim();
      if (!nombre || !email) {
        errorEnvio.textContent = 'Completa ambos campos.';
        return;
      }
      try {
        const resp = await fetch('/api/usuarios', {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ name:nombre, email })
        });
        const datos = await resp.json();
        contResp.innerHTML = `<p>ID (Fetch): <strong>${datos.id}</strong></p>`;
      } catch {
        errorEnvio.textContent = 'Error al enviar con Fetch.';
      }
    });
  
    formAxios.addEventListener('submit', async e => {
      e.preventDefault();
      errorEnvio.textContent = ''; contResp.textContent = '';
      const nombre = document.getElementById('entradaNombreA').value.trim();
      const email  = document.getElementById('entradaEmailA').value.trim();
      if (!nombre || !email) {
        errorEnvio.textContent = 'Completa ambos campos.';
        return;
      }
      try {
        const resp = await axios.post('/api/usuarios', { name:nombre, email });
        contResp.innerHTML = `<p>ID (Axios): <strong>${resp.data.id}</strong></p>`;
      } catch {
        errorEnvio.textContent = 'Error al enviar con Axios.';
      }
    });
  });