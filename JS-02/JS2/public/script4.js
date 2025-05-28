// PRIMERA LÍNEA ABSOLUTA DE script4.js
console.log('===== script4.js COMENZÓ A EJECUTARSE =====');

document.addEventListener('DOMContentLoaded', () => {
    console.log('===== DOMContentLoaded SE DISPARÓ en script4.js =====');

    // --- Código del Menú Hamburguesa (ahora inofensivo, ya que el CSS muestra el menú siempre) ---
    console.log('Intentando configurar menú hamburguesa...');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            console.log('¡CLIC en navToggle detectado!');
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('open');
        });
    } else {
        console.error('ERROR CRÍTICO MENÚ: No se encontró .nav-toggle o .nav-links.');
    }
    // --- Fin del Código del Menú ---

    // --- INICIO DEL CÓDIGO DEL JUEGO TATETI ---
    console.log('Iniciando configuración del juego TaTeTi...');

    const nombreJugadorPrincipalSpan = document.getElementById('nombreJugadorPrincipalTateti');
    console.log('Span para nombre principal TaTeTi:', nombreJugadorPrincipalSpan);

    // Verificar nombre de usuario
    let nombreJugadorGlobal; // Declarar aquí para que esté disponible en todo el scope de DOMContentLoaded
    if (typeof verificarNombreUsuario === 'function') {
        nombreJugadorGlobal = verificarNombreUsuario('index4.html');
        console.log('verificarNombreUsuario ejecutado. Nombre obtenido:', nombreJugadorGlobal);
    } else {
        console.error('La función verificarNombreUsuario NO ESTÁ DISPONIBLE. Revisa script1.js');
        nombreJugadorGlobal = null; // o un valor por defecto
    }

    if (!nombreJugadorGlobal && window.location.pathname.includes('index4.html')) {
        console.warn("ADVERTENCIA: Nombre de usuario global no encontrado o es vacío.");
    }

    // Variables del juego TaTeTi
    let nombreJugadorX = nombreJugadorGlobal || "Jugador X"; // Usar el global o un fallback
    console.log('Nombre para Jugador X (TaTeTi):', nombreJugadorX);

    if (nombreJugadorPrincipalSpan) {
        nombreJugadorPrincipalSpan.textContent = nombreJugadorX;
        console.log('Nombre del jugador principal asignado al H1.');
    } else {
        console.warn('Span nombreJugadorPrincipalTateti no encontrado en el H1.');
    }

    const setupJuegoDiv = document.getElementById('setupJuegoTateti');
    const formTateti = document.getElementById('formularioTateti');
    const areaJuegoDiv = document.getElementById('area-juego-tateti');
    const tableroDiv = document.getElementById('tableroTateti');
    const turnoTexto = document.getElementById('turnoTateti');
    const resultadoDiv = document.getElementById('resultadoTateti');
    const botonReiniciar = document.getElementById('boton-reiniciar-tateti');
    const botonMenuJuego = document.getElementById('boton-menu-tateti-juego');
    const botonPcInicia = document.getElementById('boton-pc-inicia-tateti');
    const campoNombreJugadorODiv = document.getElementById('campoNombreJugadorOTateti');
    const nombreJugadorOInput = document.getElementById('nombreJugadorOTatetiInput');

    let celdas = [];
    let tableroEstado = Array(9).fill('');
    let jugadorActual = 'X';
    let nombreJugadorO = 'Computadora';
    let modo = 'pvp';
    let jugando = false;

    if (formTateti && formTateti.modoTateti) {
        modo = formTateti.modoTateti.value;
        if (modo === 'pvp') {
            if(campoNombreJugadorODiv) campoNombreJugadorODiv.classList.remove('hidden');
        } else {
            if(campoNombreJugadorODiv) campoNombreJugadorODiv.classList.add('hidden');
        }

        Array.from(formTateti.modoTateti).forEach(radio => {
            radio.addEventListener('change', function() {
                modo = this.value;
                if (this.value === 'pvp') {
                    if(campoNombreJugadorODiv) campoNombreJugadorODiv.classList.remove('hidden');
                    if(nombreJugadorOInput) {
                        nombreJugadorOInput.value = "";
                        nombreJugadorOInput.placeholder = "Nombre Jugador O";
                    }
                } else {
                    if(campoNombreJugadorODiv) campoNombreJugadorODiv.classList.add('hidden');
                }
            });
        });
    } else if (formTateti) {
        console.warn("Elemento 'modoTateti' no encontrado dentro del formularioTateti.");
    }

    if (formTateti) {
        formTateti.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('EVENTO SUBMIT: Formulario TaTeTi enviado / Botón Comenzar Juego presionado.');

            if (formTateti.modoTateti) modo = formTateti.modoTateti.value;
            jugadorActual = 'X';

            if (modo === 'pvp') {
                nombreJugadorO = (nombreJugadorOInput && nombreJugadorOInput.value.trim()) || 'Jugador O';
                if (nombreJugadorO.toLowerCase() === nombreJugadorX.toLowerCase() && nombreJugadorO !== "Jugador O" && nombreJugadorX !== "Jugador X") {
                    alert("Jugador O no puede tener el mismo nombre que Jugador X. Elige otro.");
                    if(nombreJugadorOInput) nombreJugadorOInput.focus();
                    return;
                }
            } else {
                nombreJugadorO = 'Computadora';
            }

            if (setupJuegoDiv) setupJuegoDiv.style.display = 'none';
            if (areaJuegoDiv) areaJuegoDiv.style.display = 'flex';

            iniciarJuego();
        });
    } else {
        console.error("ERROR CRÍTICO JUEGO: El formulario 'formularioTateti' NO fue encontrado.");
    }

    function iniciarJuego(pcInicia = false) {
        if (!tableroDiv || !resultadoDiv || !turnoTexto) return;
        
        tableroDiv.innerHTML = '';
        tableroEstado = Array(9).fill('');
        resultadoDiv.textContent = '';
        resultadoDiv.className = 'msg-resultado-tateti';
        jugando = true;

        for (let i = 0; i < 9; i++) {
            const celda = document.createElement('div');
            celda.classList.add('celda-tateti');
            celda.dataset.index = i;
            celda.addEventListener('click', manejarTurno);
            tableroDiv.appendChild(celda);
        }
        celdas = Array.from(tableroDiv.querySelectorAll('.celda-tateti'));

        if(botonPcInicia) botonPcInicia.classList.toggle('hidden', !(modo === 'pvc' && jugadorActual === 'X'));

        if (modo === 'pvc' && pcInicia && jugadorActual === 'X') {
            jugadorActual = 'O';
            actualizarTurno();
            setTimeout(turnoPC, 300);
        } else {
            jugadorActual = 'X';
            actualizarTurno();
        }
    }

    function manejarTurno(e) {
        if (!jugando || !e.target.dataset.index) return;
        const index = parseInt(e.target.dataset.index);

        if (modo === 'pvc' && jugadorActual === 'O') return;
        
        if (tableroEstado[index] === '') {
            hacerMovimiento(index, jugadorActual);
            if (verificarGanador()) {
                jugando = false;
                if(botonPcInicia) botonPcInicia.classList.add('hidden');
                return;
            }
            cambiarTurno();
            if (modo === 'pvc' && jugadorActual === 'O' && jugando) {
                if(botonPcInicia) botonPcInicia.classList.add('hidden');
                setTimeout(turnoPC, 500);
            }
        }
    }

    function hacerMovimiento(index, jugador) {
        if (tableroEstado[index] === '' && jugando && celdas[index]) {
            tableroEstado[index] = jugador;
            celdas[index].textContent = jugador;
            celdas[index].classList.remove('jugador-x', 'jugador-o');
            celdas[index].classList.add(jugador === 'X' ? 'jugador-x' : 'jugador-o');
        }
    }

    function cambiarTurno() {
        jugadorActual = (jugadorActual === 'X') ? 'O' : 'X';
        actualizarTurno();
    }

    function actualizarTurno() {
        if (!turnoTexto) return;
        let nombreTurnoVisual = (jugadorActual === 'X') ? nombreJugadorX : nombreJugadorO;
        turnoTexto.textContent = `Turno de ${nombreTurnoVisual} (${jugadorActual})`;
    }

    function verificarGanador() {
        if (!resultadoDiv) return false;
        const combinaciones = [[0, 1, 2], [3, 4, 5], [6, 7, 8],[0, 3, 6], [1, 4, 7], [2, 5, 8],[0, 4, 8], [2, 4, 6]];
        for (const combinacion of combinaciones) {
            const [a, b, c] = combinacion;
            if (tableroEstado[a] && tableroEstado[a] === tableroEstado[b] && tableroEstado[a] === tableroEstado[c]) {
                const ganadorSimbolo = tableroEstado[a];
                let nombreGanadorVisual = (ganadorSimbolo === 'X') ? nombreJugadorX : nombreJugadorO;
                resultadoDiv.textContent = `¡${nombreGanadorVisual} (${ganadorSimbolo}) ha ganado!`;
                resultadoDiv.classList.add('visible');
                jugando = false; return true;
            }
        }
        if (!tableroEstado.includes('')) {
            resultadoDiv.textContent = '¡Es un empate!';
            resultadoDiv.classList.add('visible');
            jugando = false; return true;
        }
        return false;
    }

    function turnoPC() {
        if (!jugando || jugadorActual !== 'O') return;
        const ganarBloquear = (jugadorConsiderado) => {
            const combinaciones = [[0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            for (const [a,b,c] of combinaciones) {
                const casillas = [tableroEstado[a], tableroEstado[b], tableroEstado[c]];
                const vaciosIndices = [a,b,c].filter(i => tableroEstado[i] === '');
                const cuentaLetra = casillas.filter(v => v === jugadorConsiderado).length;
                if (cuentaLetra === 2 && vaciosIndices.length === 1) { return vaciosIndices[0]; }
            }
            return null;
        };
        let indiceMovimiento = ganarBloquear('O');
        if (indiceMovimiento === null) { indiceMovimiento = ganarBloquear('X'); }
        if (indiceMovimiento === null) { if (tableroEstado[4] === '') { indiceMovimiento = 4; } else { const esquinas = [0, 2, 6, 8].filter(i => tableroEstado[i] === ''); if (esquinas.length > 0) { indiceMovimiento = esquinas[Math.floor(Math.random() * esquinas.length)]; } } }
        if (indiceMovimiento === null) { const lados = [1, 3, 5, 7].filter(i => tableroEstado[i] === ''); if (lados.length > 0) { indiceMovimiento = lados[Math.floor(Math.random() * lados.length)]; } }
        if (indiceMovimiento === null) { const disponibles = tableroEstado.map((v, i) => (v === '') ? i : null).filter(i => i !== null); if (disponibles.length > 0) { indiceMovimiento = disponibles[Math.floor(Math.random() * disponibles.length)]; } else { return; } }
        if (indiceMovimiento !== null && tableroEstado[indiceMovimiento] === '') {
            hacerMovimiento(indiceMovimiento, 'O');
            if (!verificarGanador()) { cambiarTurno(); if (jugando && botonPcInicia) botonPcInicia.classList.remove('hidden'); }
            else { jugando = false; if (botonPcInicia) botonPcInicia.classList.add('hidden'); }
        }
    }

    if (botonReiniciar) {
        botonReiniciar.addEventListener('click', () => {
            jugadorActual = 'X';
            iniciarJuego(false);
        });
    }

    if (botonMenuJuego) {
        botonMenuJuego.addEventListener('click', () => {
            if (setupJuegoDiv) setupJuegoDiv.style.display = 'block';
            if (areaJuegoDiv) areaJuegoDiv.style.display = 'none';
            jugando = false;
        });
    }

    if (botonPcInicia) {
        botonPcInicia.addEventListener('click', () => {
            if (modo === 'pvc' && jugando && jugadorActual === 'X') {
                jugadorActual = 'O';
                actualizarTurno();
                botonPcInicia.classList.add('hidden');
                setTimeout(turnoPC, 300);
            }
        });
    }

}); // Fin del DOMContentLoaded