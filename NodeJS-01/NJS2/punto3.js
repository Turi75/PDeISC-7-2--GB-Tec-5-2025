var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host); //muesttra 'localhost:8080'
console.log(q.pathname); //muestra '/default.htm'
console.log(q.search); //muestra '?year=2017&month=february'

var qdata = q.query; //muestra como objeto: { year: 2017, month: 'february' }
console.log(qdata.month); //muestra 'february'