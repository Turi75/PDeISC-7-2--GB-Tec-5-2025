// script.js
// Decodificador de mensajes secretos: invierte cada grupo entre paréntesis

document.getElementById('formMensaje').addEventListener('submit', function(e) {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje').value;
    // Invierte el contenido de cada paréntesis
    const decodificado = mensaje.replace(/\(([^()]+)\)/g, (match, contenido) =>
      contenido.split('').reverse().join('')
    );
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.textContent = decodificado;
    resultadoDiv.style.display = 'block';
  });