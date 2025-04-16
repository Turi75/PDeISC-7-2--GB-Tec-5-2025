var http = require('http');
const modulo = require('./calculo.js');
const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('La hora es: ' + modulo.obtenerHora() + ' - ' + modulo.obtenerFecha() + '<br>');// utilzamos el '+' para poder concatenar
    res.write('7 + 8 = ' + modulo.sumar(7, 8) + '<br>'); // utilzamos el '+' para poder concatenar
    res.write('10 / 2 = ' + modulo.dividir(10, 2) + '<br>'); // utilzamos el '+' para poder concatenar
    res.end(); // finaliza 
  })
server.listen(8085, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:8085');
});