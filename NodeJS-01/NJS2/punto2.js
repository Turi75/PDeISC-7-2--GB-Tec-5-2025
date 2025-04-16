var http = require('http');
var fs   = require('fs');
const modulo = require('./calculo.js');

const htmlPath = 'index.html';
const logPath  = 'access.log';

// Crear o actualizar el archivo HTML (si no existe, lo crea; si existe, añade al final)
const contenidoHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Punto 2</title>
</head>
<body>
  <h1>Resultados y hora</h1>
  <div id="resultados"></div>
</body>
</html>
`;
fs.appendFile(htmlPath, contenidoHTML, err => {
  if (err && err.code !== 'EEXIST') {
    console.error('Error al crear o actualizar index.html:', err);
  }
});

const server = http.createServer((req, res) => {
    
  // Leer el HTML base
  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      return res.end('Error al leer el archivo HTML');
    }

    // Generar datos dinámicos
    const hora     = modulo.obtenerHora();
    const fecha    = modulo.obtenerFecha();
    const suma     = modulo.sumar(7, 8);
    const division = modulo.dividir(10, 2);

    // Insertar los resultados en el DIV
    const htmlConDatos = data.replace(
      '<div id="resultados"></div>',
      `<div id="resultados">
         <p>La hora es: ${hora} – ${fecha}</p>
         <p>7 + 8 = ${suma}</p>
         <p>10 / 2 = ${division}</p>
       </div>`
    );

    // Registrar la petición en un archivo de log
    const logEntry = `${new Date().toISOString()} – ${req.method} ${req.url}\n`;
    fs.appendFile(logPath, logEntry, errLog => {
      if (errLog) console.error('Error al escribir en access.log:', errLog);
    });

    // Enviar la respuesta al cliente
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlConDatos);
  });
});

server.listen(8085, '127.0.0.1', () => {
  console.log('Servidor escuchando en 127.0.0.1:8085');
});