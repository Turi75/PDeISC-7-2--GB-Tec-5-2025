
// esto espera a que se cargue toda la página antes de hacer cualquier cosa
document.addEventListener('DOMContentLoaded', () => {

  // agarramos el botón para después poder usarlo
  const botonCargar = document.getElementById('cargarAlumnosBtn');
  // y también agarramos el cuerpo de la tabla, donde van a ir los datos
  const tablaBody = document.getElementById('alumnosTbody');

  // acá le decimos que se quede """escuchando""" a ver cuándo le hacen clic al botón
  botonCargar.addEventListener('click', async () => {
    // intentamos hacer todo esto
    try {
      tablaBody.innerHTML = '<tr><td colspan="7" data-label="Estado">Cargando datos... 👨‍🚀</td></tr>';

      // acá le pedimos los datos a nuestro propio servidor, al que hicimos en node
      const response = await fetch('/api/alumnos');

      // si la respuesta no es buena, cortamos todo
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // si esta bien, convertimos la respuesta en algo que podamos usar
      const users = await response.json();

      // mostramos en la consola del navegador lo que nos llegó, para chusmear
      console.log('[Navegador] Datos completos de usuarios recibidos:', users);

      // limpiamos la tabla por si había algo de antes
      tablaBody.innerHTML = '';

      // si no vino ningún usuario, avisamos en la tabla
      if (users.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="7" data-label="Error">No se encontraron usuarios</td></tr>';
        return;
      }
      
      // ahora sí, por cada usuario que recibimos, hacemos lo siguiente
      users.forEach(user => {
        // creamos una fila nueva para la tabla
        const fila = document.createElement('tr');
        
        // le mandamos el html de una con los datos de la persona
        fila.innerHTML = `
          <td data-label="ID">${user.id}</td>
          <td data-label="Nombre">${user.name}</td>
          <td data-label="Email"><a href="mailto:${user.email}">${user.email}</a></td>
          <td data-label="Teléfono">${user.phone}</td>
          <td data-label="Ciudad">${user.address.city}</td>
          <td data-label="Calle">${user.address.street}, ${user.address.suite}</td>
          <td data-label="Compañía">${user.company.name}</td>
        `;
        // y metemos la fila que acabamos de crear adentro de la tabla
        tablaBody.appendChild(fila);
      });

    // si en algún momento se rompió algo de lo de arriba, caemos acá
    } catch (error) {
      // mostramos el error en la consola para saber qué onda
      console.error('[Navegador] Error al cargar los usuarios:', error);
      // y mostramos un mensaje de error en la tabla
      tablaBody.innerHTML = `<tr><td colspan="7" data-label="Error">Error al cargar los datos</td></tr>`;
    }
  });
});