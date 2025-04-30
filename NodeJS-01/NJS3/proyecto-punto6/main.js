// main.js
// configura el servidor Express y maneja el endpoint de registro en memoria.

const expres = require('express');
const app = expres();

// sirve archivos estáticos desde la carpeta 'public'
app.use(expres.static('public'));

// permite parsear cuerpos JSON en las peticiones
app.use(expres.json());

// array en memoria para almacenar los registros de usuarios
const registros = [];

/*
  POST /registro
  recibe los datos del formulario en formato JSON, los almacena en memoria
  y responde con estado 201 y confirmación.
 */
app.post('/registro', (req, res) => {
  const datos = req.body;
  registros.push(datos);
  res.status(201).json({ mensaje: 'Registrado correctamente', datos });
});

/*
  GET /
  envía el archivo HTML principal al cliente.
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PUERTO1 = 3000;
const PUERTO2 = 8081;

/*
  iniciarServidor(port)
  intenta arrancar el servidor en el puerto indicado. Si ocurre un error
  (por ejemplo, puerto ocupado), alterna al otro puerto definido.
  @param {number} port - Puerto en el que iniciar el servidor.
 */
function iniciarServidor(port) {
  const server = app.listen(port, () =>
    console.log(`Servidor corriendo en http://localhost:${port}`)
  );
  server.on('error', () => {
    const siguiente = port === PUERTO1 ? PUERTO2 : PUERTO1;
    console.error(`Puerto ${port} ocupado. Intentando ${siguiente}...`);
    iniciarServidor(siguiente);
  });
}

// inicia el servidor con fallback de puertos
iniciarServidor(PUERTO1);
