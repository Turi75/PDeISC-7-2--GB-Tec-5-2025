const expres = require('express');
const app = expres();

// Servir archivos estáticos de /public
app.use(expres.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PUERTO1 = 3000;
const PUERTO2 = 8081;

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