
import { inicializarBD, guardarHistorial, guardarMejor, obtenerMejores, borrarTodosMejores } from './dbLocal.js';

/* --- Refs DOM --- */
const canvas = document.getElementById('pantalla');
const ctx = canvas.getContext('2d');

const textoJugador = document.getElementById('texto-jugador');
const textoVidas = document.getElementById('texto-vidas');
const textoPuntaje = document.getElementById('texto-puntaje');
const textoNivel = document.getElementById('texto-nivel');

const btnIniciar = document.getElementById('btn-iniciar');
const btnPausar = document.getElementById('btn-pausar');
const btnMostrarGuardar = document.getElementById('btn-mostrar-guardar');

const listaMejores = document.getElementById('lista-mejores');
const btnRefrescar = document.getElementById('btn-refrescar');
const btnBorrarTop = document.getElementById('btn-borrar-top');

const modalNombre = document.getElementById('modal-nombre');
const inputNombreModal = document.getElementById('input-nombre-modal');
const btnConfirmarNombre = document.getElementById('btn-confirmar-nombre');

const tablaMejoresWrapper = document.getElementById('tabla-mejores-wrapper');

const ANCHO = canvas.width;
const ALTO = canvas.height;

/* --- Estado global --- */
let jugadorActual = null;
let juegoActivo = false;
let pausado = false;
let animId = null;

/* Controles */
let teclaIzq = false, teclaDer = false;

/* --- Bloquear clic derecho en toda la página --- */
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

/* --- Clases y utilidades --- */
class Jugador {
  constructor() {
    this.ancho = 100; this.alto = 22;
    this.x = ANCHO/2 - this.ancho/2;
    this.y = ALTO - 160;
    this.color = '#00ffea';
    this.vel = 7;
    this.vidas = 3;
  }
  dibujar(){
    ctx.fillStyle = this.color;
    roundRect(ctx,this.x,this.y,this.ancho,this.alto,8,true,false);
    ctx.fillStyle = '#bafcff';
    ctx.beginPath();
    ctx.moveTo(this.x + 18, this.y);
    ctx.lineTo(this.x + this.ancho - 18, this.y);
    ctx.lineTo(this.x + this.ancho/2, this.y - 14);
    ctx.fill();
  }
  mover(){
    if (teclaIzq) this.x -= this.vel;
    if (teclaDer) this.x += this.vel;
    this.x = clamp(this.x, 0, ANCHO - this.ancho);
  }
}

class Proyectil {
  constructor(x,y){ this.x=x; this.y=y; this.r=6; this.vel=11; this.color='#ffd86b'; this.activo=true; }
  actualizar(){ this.y -= this.vel; if (this.y < -10) this.activo=false; }
  dibujar(){ ctx.fillStyle=this.color; circle(ctx,this.x,this.y,this.r,true); }
}

class BalaEnemiga {
  constructor(x,y,vel){
    this.x=x; this.y=y; this.r=6; this.vel = vel || 1.8; this.color='#88d3ff'; this.activa=true;
  }
  actualizar(){ this.y += this.vel; if (this.y > ALTO + 20) this.activa=false; }
  dibujar(){ ctx.fillStyle=this.color; circle(ctx,this.x,this.y,this.r,true); }
}

class Alien {
  constructor(x,y,fila,col){
    this.x=x; this.y=y; this.ancho=48; this.alto=34; this.alive=true;
    this.fila=fila; this.col=col;
    // apariencia hostil: color base y detalles
    this.colorBase = '#036610ff';
    this.ojos = '#ff2020';
    this.detalle = '#fff2f2';
  }
  dibujar(){
    if(!this.alive) return;
    // cuerpo oscuro
    ctx.fillStyle = this.colorBase;
    roundRect(ctx,this.x,this.y,this.ancho,this.alto,8,true,false);
    // ojos rojos (hostiles)
    circle(ctx,this.x+12,this.y+12,4,true);
    circle(ctx,this.x+this.ancho-12,this.y+12,4,true);
    // colmillos/picos
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(this.x+this.ancho/2 - 8, this.y + this.alto - 2);
    ctx.lineTo(this.x+this.ancho/2 - 2, this.y + this.alto - 14);
    ctx.lineTo(this.x+this.ancho/2 + 4, this.y + this.alto - 2);
    ctx.closePath();
    ctx.fill();
    // sombra inferior
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(this.x+4, this.y+this.alto-6, this.ancho-8, 4);
  }
  move(dx,dy){ this.x+=dx; this.y+=dy; }
}

/* utilidades dibujo y colisión */
function circle(ctx,x,y,r,fill=true){ ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); if(fill) ctx.fill(); else ctx.stroke(); }
function roundRect(ctx,x,y,w,h,r,fill,stroke){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); if(fill) ctx.fill(); if(stroke) ctx.stroke(); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function colisionRectCircle(rx,ry,rw,rh,cx,cy,cr){ const closestX = clamp(cx, rx, rx+rw); const closestY = clamp(cy, ry, ry+rh); const dx = cx - closestX; const dy = cy - closestY; return (dx*dx + dy*dy) <= cr*cr; }

/* --- Clase Juego (dificultad aumenta con nivel) --- */
class Juego {
  constructor(){
    this.jugador = new Jugador();
    this.proyectiles = [];
    this.balasEnemigas = [];
    this.invasores = [];
    this.dir = 1;
    // base velocidad movimiento; se reducirá (más rápido) por nivel mediante multiplicador
    this.velMovimientoBase = 0.025;
    this.velMovimiento = this.velMovimientoBase;
    this.tiempoPaso = 0;
    this.puntaje = 0;
    this.nivel = 1;
    this.tiempoUltimoDisparo = 0;
    this.tiempoUltimoDisparoEnemigo = performance.now();
    // parámetros que escalan con el nivel
    this.factorVelocidadNivel = 1.0;
    this.factorFrecuenciaDisparo = 1.0;
    this.initInvasores();
  }

  initInvasores(){
    this.invasores = [];
    const filas = 4; const cols = 8;
    const margenX = 110; const espX = 95; const espY = 110;
    for(let f=0; f<filas; f++){
      const fila = [];
      for(let c=0;c<cols;c++){
        const x = margenX + c*espX;
        const y = 40 + f*espY;
        fila.push(new Alien(x,y,f,c));
      }
      this.invasores.push(fila);
    }
    // recalcula factores según nivel actual
    this.recalcularDificultad();
  }

  // recalcula parámetros que suben con cada nivel
  recalcularDificultad(){
    // factor aumenta lentamente con el nivel (ajustar coeficiente para balance)
    this.factorVelocidadNivel = 1 + (this.nivel - 1) * 0.20; // cada nivel ~+20% velocidad base
    this.velMovimiento = Math.max(0.008, this.velMovimientoBase / this.factorVelocidadNivel);
    // frecuencia de disparo enemigo: menor intervalo = más frecuencias
    this.factorFrecuenciaDisparo = 1 + (this.nivel - 1) * 0.15;
  }

  actualizar(delta){
    this.jugador.mover();
    this.proyectiles.forEach(p => p.actualizar());
    this.proyectiles = this.proyectiles.filter(p => p.activo);

    this.balasEnemigas.forEach(b => b.actualizar());
    this.balasEnemigas = this.balasEnemigas.filter(b => b.activa);

    // movimiento invasores (velocidad influida por nivel)
    this.tiempoPaso += this.velMovimiento * delta;
    const avance = Math.floor(this.tiempoPaso);
    if(avance >= 1){
      const pasoX = Math.max(1, Math.round(2 * this.factorVelocidadNivel)); // paso horizontal aumenta con nivel
      this.invasores.forEach(fila => fila.forEach(al => { if(al.alive) al.move(this.dir * pasoX, 0); }));
      let bordeDerecha = 0, bordeIzquierda = ANCHO, maxY = 0;
      this.invasores.forEach(fila => fila.forEach(al => {
        if(!al.alive) return;
        if (al.x + al.ancho > bordeDerecha) bordeDerecha = al.x + al.ancho;
        if (al.x < bordeIzquierda) bordeIzquierda = al.x;
        if (al.y + al.alto > maxY) maxY = al.y + al.alto;
      }));
      const margen = 18;
      if (bordeDerecha > ANCHO - margen || bordeIzquierda < margen || maxY > this.jugador.y - 110){
        this.invasores.forEach(fila => fila.forEach(al => al.move(0,40)));
        this.dir *= -1;
      }
      this.tiempoPaso = 0;
    }

    // colisiones proyectiles contra aliens
    for (let p of this.proyectiles){
      for (let fila of this.invasores){
        for (let al of fila){
          if(!al.alive) continue;
          if(colisionRectCircle(al.x,al.y,al.ancho,al.alto,p.x,p.y,p.r)){
            al.alive = false; p.activo=false; this.puntaje += 15;
          }
        }
      }
    }

    // colisiones balas enemigas con jugador
    for (let b of this.balasEnemigas){
      if(colisionRectCircle(this.jugador.x,this.jugador.y,this.jugador.ancho,this.jugador.alto,b.x,b.y,b.r)){
        b.activa=false; this.jugador.vidas -=1;
        if(this.jugador.vidas <= 0){ this.terminarJuego(); return; }
      }
    }

    // si todos muertos -> subir nivel (más difícil)
    if (this.invasores.flat().every(a => !a.alive)){
      this.nivel++;
      this.puntaje += 80;
      // cuando sube de nivel, recalculamos la dificultad (velocidad+frecuencia)
      this.recalcularDificultad();
      // regenerar invasores con parámetros del nuevo nivel
      this.initInvasores();
    }

    // disparo enemigo aleatorio: intervalo se reduce con factorFrecuenciaDisparo
    const ahora = performance.now();
    const intervaloBase = 900; // ms
    const intervalo = Math.max(300, intervaloBase / this.factorFrecuenciaDisparo); // mínimo 300ms
    if (ahora - this.tiempoUltimoDisparoEnemigo > intervalo) {
      this.tiempoUltimoDisparoEnemigo = ahora;
      // la velocidad de la bala enemiga se incrementa con nivel
      const velocidadBala = 1.4 + (this.nivel - 1) * 0.25; // cada nivel +0.25
      this.disparoEnemigoAleatorio(velocidadBala);
    }

    // actualizar UI
    textoVidas.textContent = `Vidas: ${this.jugador.vidas}`;
    textoPuntaje.textContent = `Puntaje: ${this.puntaje}`;
    textoNivel.textContent = `Nivel: ${this.nivel}`;
  }

  disparar(){
    const ahora = performance.now();
    if (ahora - this.tiempoUltimoDisparo < 300) return;
    this.tiempoUltimoDisparo = ahora;
    const x = this.jugador.x + this.jugador.ancho/2;
    const y = this.jugador.y - 10;
    this.proyectiles.push(new Proyectil(x,y));
  }

  disparoEnemigoAleatorio(velBala=1.8){
    const vivos = this.invasores.flat().filter(a => a.alive);
    if (vivos.length === 0) return;
    // elegir entre los aliens más bajos para que exista línea de fuego
    vivos.sort((a,b) => (b.y - a.y));
    const candidatos = vivos.slice(0, Math.min(12, vivos.length));
    const elegido = candidatos[Math.floor(Math.random()*candidatos.length)];
    if (elegido){
      const bx = elegido.x + elegido.ancho/2;
      const by = elegido.y + elegido.alto + 6;
      this.balasEnemigas.push(new BalaEnemiga(bx,by,velBala));
    }
  }

  dibujar(){
    ctx.clearRect(0,0,ANCHO,ALTO);
    dibujarFondoEstrellas();
    this.jugador.dibujar();
    this.proyectiles.forEach(p => p.dibujar());
    this.balasEnemigas.forEach(b => b.dibujar());
    this.invasores.forEach(fila => fila.forEach(al => al.dibujar()));
  }

  terminarJuego(){
    juegoActivo = false;
    pausado = false;
    detenerBucle();
    if (jugadorActual) {
      const registro = { nombre: jugadorActual, puntaje: this.puntaje, nivel: this.nivel };
      guardarHistorial(registro).catch(console.error);
      guardarMejor(registro.nombre, registro.puntaje, registro.nivel).catch(console.error);
      cargarMejores();
    }
    btnMostrarGuardar.disabled = false;
    btnIniciar.disabled = false;
    btnPausar.disabled = true;
    mensajeEstado('Juego terminado. Puntaje guardado (si ingresaste nombre).');
  }
}

/* fondo estrellado */
function dibujarFondoEstrellas(){
  ctx.save();
  ctx.globalAlpha = 0.06;
  for (let i=0;i<12;i++){
    ctx.fillStyle = '#ffffff';
    const x = Math.random() * ANCHO;
    const y = Math.random() * (ALTO - 40);
    ctx.fillRect(x, y, 1 + Math.random()*2, 1 + Math.random()*2);
  }
  ctx.restore();
}

/* bucle principal */
let ultimoTime = 0;
let juego = null;

function bucle(t){
  if(!ultimoTime) ultimoTime = t;
  const delta = t - ultimoTime;
  ultimoTime = t;
  if (juegoActivo && juego && !pausado){
    juego.actualizar(delta);
    juego.dibujar();
  } else {
    // cuando no hay juego activo: solo dibujar fondo
    ctx.clearRect(0,0,ANCHO,ALTO);
    dibujarFondoEstrellas();
  }
  animId = requestAnimationFrame(bucle);
}
function iniciarBucle(){ if (!animId) animId = requestAnimationFrame(bucle); }
function detenerBucle(){ if (animId){ cancelAnimationFrame(animId); animId = null; ultimoTime = 0; } }

/* teclado: evitar scroll con Space salvo inputs */
window.addEventListener('keydown', (e)=>{
  if (e.code === 'Space') {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    const editable = (tag === 'input' || tag === 'textarea' || e.target.isContentEditable);
    if (!editable) e.preventDefault();
  }
  if (e.code === 'ArrowLeft') teclaIzq = true;
  if (e.code === 'ArrowRight') teclaDer = true;
  if (e.code === 'Space') { if (juegoActivo && juego) juego.disparar(); }
  if (e.code === 'KeyP') togglePausa();
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') teclaIzq = false;
  if (e.code === 'ArrowRight') teclaDer = false;
});

/* UI botones */
btnIniciar.addEventListener('click', iniciarJuego);
btnPausar.addEventListener('click', togglePausa);
btnRefrescar.addEventListener('click', cargarMejores);
btnBorrarTop.addEventListener('click', async ()=>{
  if(!confirm('Borrar todos los mejores puntajes?')) return;
  await borrarTodosMejores();
  cargarMejores();
});
btnMostrarGuardar.addEventListener('click', async ()=>{
  if(!juego) return;
  if(!jugadorActual){ alert('Ingresa primero tu nombre.'); return; }
  const r = { nombre: jugadorActual, puntaje: juego.puntaje, nivel: juego.nivel };
  await guardarHistorial(r);
  await guardarMejor(r.nombre, r.puntaje, r.nivel);
  cargarMejores();
  mensajeEstado('Guardado manual correcto.');
});

/* Modal nombre */
btnConfirmarNombre.addEventListener('click', ()=>{
  const nombre = inputNombreModal.value.trim();
  if (!nombre){ alert('Ingresa un nombre válido.'); inputNombreModal.focus(); return; }
  jugadorActual = nombre;
  textoJugador.textContent = `Jugador: ${jugadorActual}`;
  modalNombre.style.display = 'none';
  btnIniciar.disabled = false;
  btnPausar.disabled = true;
  btnMostrarGuardar.disabled = true;
  cargarMejores();
});

/* iniciar/pausar */
function iniciarJuego(){
  juego = new Juego();
  juego.jugador.vidas = 3;
  juegoActivo = true;
  pausado = false;
  detenerBucle(); iniciarBucle();
  btnIniciar.disabled = false;
  btnPausar.disabled = false;
  btnPausar.textContent = 'Pausar';
  btnMostrarGuardar.disabled = true;
  mensajeEstado('Jugando...');
}
function togglePausa(){
  if (!juegoActivo) return;
  pausado = !pausado;
  btnPausar.textContent = pausado ? 'Reanudar' : 'Pausar';
  mensajeEstado(pausado ? 'Pausado' : 'Jugando...');
  if (!pausado && !animId) iniciarBucle();
}

/* util estado */
function mensajeEstado(txt){
  const ms = document.getElementById('mensaje-estado');
  if(ms) ms.textContent = txt;
}

/* cargar mejores y construir UI (NO mostrar updated_at) */
async function cargarMejores(){
  try {
    const top = await obtenerMejores(50);
    listaMejores.innerHTML = '';
    if (!top || top.length === 0) {
      listaMejores.innerHTML = '<li>— sin puntajes —</li>';
    } else {
      top.slice(0,10).forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.nombre} — ${r.puntaje} pts (niv ${r.nivel})`;
        listaMejores.appendChild(li);
      });
    }
    // tabla completa sin mostrar updated_at
    tablaMejoresWrapper.innerHTML = '';
    if (top && top.length > 0){
      const tbl = document.createElement('table');
      const thead = document.createElement('thead');
      thead.innerHTML = `<tr><th>Jugador</th><th>Puntaje</th><th>Nivel</th></tr>`;
      tbl.appendChild(thead);
      const tbody = document.createElement('tbody');
      top.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.nombre}</td><td>${r.puntaje}</td><td>${r.nivel}</td>`;
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody);
      tablaMejoresWrapper.appendChild(tbl);
    } else {
      tablaMejoresWrapper.innerHTML = '<p class="muted">Sin puntajes aún.</p>';
    }
  } catch(err){
    console.error('Error al cargar mejores:', err);
  }
}

/* Inicialización */
(async function init(){
  await inicializarBD();
  modalNombre.style.display = 'flex';
  inputNombreModal.focus();
  textoVidas.textContent = `Vidas: 0`;
  textoPuntaje.textContent = `Puntaje: 0`;
  textoNivel.textContent = `Nivel: 0`;
  if (!animId) iniciarBucle();
  cargarMejores();
})();