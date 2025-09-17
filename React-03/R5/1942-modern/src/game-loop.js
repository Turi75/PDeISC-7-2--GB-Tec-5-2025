import { gameState, resetGameState } from './state.js';
import { renderGame } from './render.js';
import { updatePlayers, createPlayer } from './components/player.js';
import { spawnEnemies, updateEnemies } from './components/enemy.js';
import { updateBullets, updateEnemyBullets } from './components/bullet.js';
import { updatePowerUps } from './components/powerup.js';
import { handleCollisions } from './components/collisions.js';
import { checkGameConditions } from './components/ui.js';

// guarda el ID de la animación para poder detenerla cuando sea necesario.
let animationFrameId;

/* El bucle principal del juego. Se llama a sí mismo recursivamente unas 60 veces por segundo. Actualiza el estado de todos los elementos, maneja colisiones, renderiza y comprueba las condiciones de fin de partida.
 */
function gameLoop() {
    // Si el juego no está en estado 'playing', detiene el bucle.
    if (gameState.gameStatus !== 'playing') {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        return;
    }

    // Actualiza la lógica de cada componente del juego.
    updatePlayers();
    updateEnemies();
    updateBullets();
    updateEnemyBullets();
    updatePowerUps();
    spawnEnemies();
    
    // Verifica si hay colisiones entre los elementos.
    handleCollisions();
    
    // Renderiza todo en la pantalla.
    renderGame();
    
    // Comprueba si algún jugador ha perdido todas sus vidas.
    checkGameConditions();
    
    // Solicita al navegador que vuelva a llamar a gameLoop en el próximo fotograma.
    animationFrameId = requestAnimationFrame(gameLoop);
}

/* Prepara e inicia una nueva partida.
 */
export function startGame() {
    // Detiene cualquier bucle de juego anterior que pudiera estar activo.
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Limpia y restablece el estado del juego.
    resetGameState(gameState.numPlayers);

    // Crea los objetos de los jugadores con los nombres ingresados.
    if (gameState.playerNames.length > 0) {
        createPlayer(1, gameState.playerNames[0]);
        if (gameState.numPlayers === 2 && gameState.playerNames.length > 1) {
            createPlayer(2, gameState.playerNames[1]);
        }
    } else {
        // Usa nombres por defecto si no se proporcionaron.
        createPlayer(1, 'Jugador 1');
        if (gameState.numPlayers === 2) {
            createPlayer(2, 'Jugador 2');
        }
    }
    
    // Inicia el bucle principal del juego.
    gameLoop();
}

/* Detiene el bucle del juego y cambia el estado a 'menu'.
 */
export function stopGame() {
    gameState.gameStatus = 'menu';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}