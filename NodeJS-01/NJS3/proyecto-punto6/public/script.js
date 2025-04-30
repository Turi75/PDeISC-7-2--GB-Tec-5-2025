// script.js
// gestiona el envío del formulario, muestra cada campo completado
// y limpia automáticamente el formulario.

/*
  obtenerCheckboxes(nodes)
  extrae los valores de una lista de inputs type=checkbox.
  @param {NodeList} nodes - Inputs de tipo checkbox.
  @returns {string[]} Array con los valores seleccionados.
 */
function obtenerCheckboxes(nodes) {
    return Array.from(nodes)
      .filter(chk => chk.checked)
      .map(chk => chk.value);
  }
  
  /*
    mostrarCampos(datos)
    Genera un <li> por cada campo del objeto datos,
    mostrando nombre de campo y su valor.
    @param {Object} datos - Valores del formulario.
   */
  function mostrarCampos(datos) {
    const ul = document.getElementById('listaCampos');
    ul.innerHTML = ''; // limpia cualquier entrada previa
  
    Object.entries(datos).forEach(([campo, valor]) => {
      const li = document.createElement('li');
      if (Array.isArray(valor)) {
        valor = valor.length ? valor.join(', ') : 'Ninguno';
      }
      li.textContent = `Campo "${campo}": ${valor}`;
      ul.appendChild(li);
    });
  }
  
  // espera a que el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistro');
  
    form.addEventListener('submit', event => {
      event.preventDefault(); // Evita recarga de página
  
      // recopila los valores del formulario
      const datos = {
        nombre: form.nombre.value.trim(),
        genero: form.genero.value,
        pais: form.pais.value,
        intereses: obtenerCheckboxes(
          form.querySelectorAll('input[name="intereses"]')
        ),
        edad: form.edad.value,
        email: form.email.value.trim()
      };
  
      // muestra los campos completados
      mostrarCampos(datos);
  
      // envía los datos al servidor
      fetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
        .then(res => res.json())
        .then(() => {
          // limpia el formulario para un nuevo registro
          form.reset();
        })
        .catch(console.error);
    });
  });