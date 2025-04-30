const expres = require('express');
const app = expres();

// Servir archivos estáticos desde 'public'
app.use(expres.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PUERTO1 = 3000;
const PUERTO2 = 8081;

/**
  inicia el servidor en el puerto indicado. Si el puerto está ocupado,
   cambia automáticamente al otro puerto.
  @param {number} port - puerto donde intentar levantar el servidor.
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

iniciarServidor(PUERTO1);