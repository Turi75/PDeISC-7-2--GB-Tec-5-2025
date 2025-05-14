document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const nuevoClienteInput = document.getElementById('nuevoCliente');
    const errorMensaje = document.getElementById('errorMensaje');
    const colaDiv = document.getElementById('cola');
    const atendidoDiv = document.getElementById('atendido');
    const atenderBtn = document.getElementById('atender');
  
    let cola = [];
  
    const renderCola = () => {
      colaDiv.innerHTML = '';
      cola.forEach(cliente => {
        const div = document.createElement('div');
        div.textContent = cliente;
        colaDiv.appendChild(div);
      });
    };
  
    const renderAtendido = (cliente) => {
      atendidoDiv.innerHTML = '';
      if (cliente) {
        const div = document.createElement('div');
        div.textContent = cliente;
        atendidoDiv.appendChild(div);
      }
    };
  
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = nuevoClienteInput.value.trim();
  
      if (nombre === '') {
        errorMensaje.textContent = 'Por favor ingrese un nombre.';
        return;
      }
  
      errorMensaje.textContent = '';
      cola.push(nombre); // agrega al final
      nuevoClienteInput.value = '';
      renderCola();
    });
  
    atenderBtn.addEventListener('click', () => {
      if (cola.length === 0) {
        renderAtendido('Ningún cliente en espera');
        return;
      }
      const atendido = cola.shift(); // quita el primero
      renderCola();
      renderAtendido(atendido);
    });
  
    renderCola();
  });