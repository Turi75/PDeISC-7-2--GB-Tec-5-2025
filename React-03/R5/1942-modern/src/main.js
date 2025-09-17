import { showStartMenu, setupUIEventListeners, showGameControls, hideGameControls, showHighScores } from './components/ui.js';
import { startGame } from './game-loop.js';
import { gameState } from './state.js';
import { inicializarBD } from './dbLocal.js';

// Define las teclas que usarán los jugadores para controlar sus aviones.
export const controls = {
    player1: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', fire: 'Enter' },
    player2: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', fire: 'Space' }
};

// Se ejecuta cuando el contenido HTML de la página ha cargado completamente.
document.addEventListener('DOMContentLoaded', () => {
    
    // Prepara la base de datos local al iniciar.
    inicializarBD().catch(console.error);

    // Referencias a los elementos de la interfaz de usuario.
    const startButton1P = document.getElementById('start-1p');
    const startButton2P = document.getElementById('start-2p');
    const highScoresButton = document.getElementById('high-scores-button');
    const playerForm1 = document.getElementById('player-form-1');
    const playerForm2 = document.getElementById('player-form-2');
    const form1P = document.getElementById('form-1p');
    const form2P = document.getElementById('form-2p');
    const backButton1P = document.getElementById('back-1p');
    const backButton2P = document.getElementById('back-2p');
    
    // Registra qué teclas se están presionando para el movimiento continuo.
    window.addEventListener('keydown', (e) => {
        gameState.keysPressed[e.code] = true;
    });

    // Registra cuándo se sueltan las teclas.
    window.addEventListener('keyup', (e) => {
        gameState.keysPressed[e.code] = false;
    });

    // Asigna la funcionalidad a los botones del menú principal.
    startButton1P.addEventListener('click', () => {
        document.getElementById('start-menu').classList.add('hidden');
        playerForm1.classList.remove('hidden');
    });

    startButton2P.addEventListener('click', () => {
        document.getElementById('start-menu').classList.add('hidden');
        playerForm2.classList.remove('hidden');
    });

    highScoresButton.addEventListener('click', () => {
        showHighScores();
    });

    backButton1P.addEventListener('click', () => {
        playerForm1.classList.add('hidden');
        document.getElementById('start-menu').classList.remove('hidden');
    });

    backButton2P.addEventListener('click', () => {
        playerForm2.classList.add('hidden');
        document.getElementById('start-menu').classList.remove('hidden');
    });

    // Procesa el formulario de 1 jugador para iniciar la partida.
    form1P.addEventListener('submit', (e) => {
        e.preventDefault();
        const playerName = document.getElementById('player1-name').value.trim();
        if (playerName) {
            playerForm1.classList.add('hidden');
            document.getElementById('in-game-ui').classList.remove('hidden');
            showGameControls(1);
            startGameWithPlayers(1, [playerName]);
        }
    });

    // Procesa el formulario de 2 jugadores para iniciar la partida.
    form2P.addEventListener('submit', (e) => {
        e.preventDefault();
        const player1Name = document.getElementById('player1-name-2p').value.trim();
        const player2Name = document.getElementById('player2-name-2p').value.trim();
        if (player1Name && player2Name) {
            playerForm2.classList.add('hidden');
            document.getElementById('in-game-ui').classList.remove('hidden');
            showGameControls(2);
            startGameWithPlayers(2, [player1Name, player2Name]);
        }
    });

    /**
     Inicia el bucle de juego con la configuración de jugadores seleccionada.
    @param {number} numPlayers - Número de jugadores.
    1@param {string[]} playerNames - Nombres de los jugadores.
     */
    function startGameWithPlayers(numPlayers, playerNames) {
        gameState.numPlayers = numPlayers;
        gameState.playerNames = playerNames;
        startGame();
    }

    /* Reinicia la partida manteniendo los mismos jugadores.
     */
    function restartGameWithSamePlayers() {
        startGame();
    }

    /**
     * Detiene el juego y regresa al menú principal, reseteando el estado.
     */
    function backToMainMenu() {
        gameState.gameStatus = 'menu';
        // Limpia toda la información de la partida anterior.
        gameState.numPlayers = 1;
        gameState.playerNames = [];
        gameState.players = [];
        gameState.enemies = [];
        gameState.bullets = [];
        gameState.enemyBullets = [];
        gameState.powerUps = [];
        gameState.keysPressed = {};
        gameState.lastSpawnTime = 0;
        gameState.enemiesDefeated = 0;
        gameState.gameStartTime = 0;
        
        hideGameControls();
        showStartMenu();
    }

    // Configura los botones de la pantalla final ("Nueva Partida", "Volver al Menú").
    setupUIEventListeners(restartGameWithSamePlayers, backToMainMenu);
    
    // Muestra el menú principal al cargar la página por primera vez.
    showStartMenu();
});