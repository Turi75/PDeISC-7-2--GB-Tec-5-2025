import React, { useState } from 'react';
import '../stylos/css.css';

// Componente contador que permite incrementar o decrementar un número
function Contador() {
  const [valor, setValor] = useState(0); // Estado que guarda el número actual

  return (
    <div className="contador">
      <h2>Contador</h2>
      <p className="valor-contador">{valor}</p>

      {/* Botones para modificar el valor */}
      <button onClick={() => setValor(valor + 1)}>Incrementar</button>
      <button onClick={() => setValor(valor - 1)}>Decrementar</button>
    </div>
  );
}

export default Contador;