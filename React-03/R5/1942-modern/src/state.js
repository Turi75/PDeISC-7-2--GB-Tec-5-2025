/* Define el estado global del juego, que actúa como la "memoria" central
 para todos los componentes del programa. Contiene información sobre jugadores,
 enemigos, estado del juego y dificultad.
 */

// Objeto principal que almacena toda la información del estado actual del juego.
export const gameState = {
    gameStatus: 'menu', 
    numPlayers: 1, 
    playerNames: [], 
    players: [], 
    enemies: [], 
    bullets: [], 
    enemyBullets: [],
    powerUps: [], 
    keysPressed: {},
    difficulty: {
        spawnInterval: 2000, 
        enemySpeed: 1.2, 
        waveSize: 1.5,
    },
    lastSpawnTime: 0, 
    enemiesDefeated: 0,
    gameStartTime: 0, 
};

/**
 * Reinicia todas las variables del estado del juego a sus valores iniciales
 * para preparar una nueva partida.
 * @param {number} numPlayers - El número de jugadores para la nueva partida.
 */
export function resetGameState(numPlayers) {
    gameState.gameStatus = 'playing';
    gameState.numPlayers = numPlayers;
    gameState.players = [];
    gameState.enemies = [];
    gameState.bullets = [];
    gameState.enemyBullets = [];
    gameState.powerUps = [];
    gameState.keysPressed = {};
    gameState.lastSpawnTime = 0;
    gameState.enemiesDefeated = 0;
    gameState.gameStartTime = Date.now(); // Marca el tiempo de inicio de la partida.
    
    // Restablece los valores de dificultad iniciales.
    gameState.difficulty.spawnInterval = 2000;
    gameState.difficulty.enemySpeed = 1.2;
    gameState.difficulty.waveSize = 1.5;
}