import { gameState } from '../state.js';
import { controls } from '../main.js';
import { createBullet } from './bullet.js';

// Constantes
const PLAYER_SPEED = 5;
const PLAYER_COOLDOWN = 200; // milisegundos
const INITIAL_LIVES = 3; // Cada jugador empieza con 3 vidas

// Crea un nuevo jugador y lo añade al estado del juego.
export function createPlayer(id, name) {
    const player = {
        id: id,
        name: name,
        x: id === 1 ? 350 : 420, // Posiciones iniciales para 2 jugadores
        y: 500,
        width: 28,
        height: 28,
        isActive: true,
        score: 0,
        lives: INITIAL_LIVES, // Sistema de vidas
        weaponLevel: 1,
        canShoot: true,
        lastShotTime: 0,
        invulnerable: false, // Para evitar daño múltiple rápido
        invulnerabilityTime: 0 // Timestamp de invulnerabilidad
    };
    
    // Ajustar posición para 1 jugador (centrado)
    if (gameState.numPlayers === 1) {
        player.x = 386;
    }
    
    gameState.players.push(player);
}

// Actualiza el estado de todos los jugadores.
export function updatePlayers() {
    gameState.players.forEach(player => {
        if (player.isActive) {
            handlePlayerMovement(player);
            handlePlayerShooting(player);
            updatePlayerInvulnerability(player);
        }
    });
}

// Actualiza la invulnerabilidad temporal del jugador
function updatePlayerInvulnerability(player) {
    if (player.invulnerable && Date.now() - player.invulnerabilityTime > 1500) {
        player.invulnerable = false; // 1.5 segundos de invulnerabilidad
    }
}

// Función para manejar daño al jugador
export function damagePlayer(player) {
    if (player.invulnerable || !player.isActive) return false;
    
    player.lives--;
    player.invulnerable = true;
    player.invulnerabilityTime = Date.now();
    
    console.log(`${player.name} perdió una vida. Vidas restantes: ${player.lives}`);
    
    if (player.lives <= 0) {
        player.isActive = false;
        console.log(`${player.name} ha sido eliminado - sin vidas`);
        return true; // Jugador eliminado
    }
    
    return false; // Jugador dañado pero sigue vivo
}

// Maneja el movimiento de un jugador basado en las teclas presionadas.
function handlePlayerMovement(player) {
    const playerControls = player.id === 1 ? controls.player1 : controls.player2;
    
    let dx = 0;
    let dy = 0;
    
    if (gameState.keysPressed[playerControls.up]) {
        dy -= PLAYER_SPEED;
    }
    if (gameState.keysPressed[playerControls.down]) {
        dy += PLAYER_SPEED;
    }
    if (gameState.keysPressed[playerControls.left]) {
        dx -= PLAYER_SPEED;
    }
    if (gameState.keysPressed[playerControls.right]) {
        dx += PLAYER_SPEED;
    }

    // Prevenir que el jugador salga del contenedor
    player.x = Math.max(0, Math.min(player.x + dx, 800 - player.width));
    player.y = Math.max(0, Math.min(player.y + dy, 600 - player.height));
}

// Maneja el disparo de un jugador.
function handlePlayerShooting(player) {
    const playerControls = player.id === 1 ? controls.player1 : controls.player2;
    const now = Date.now();

    if (gameState.keysPressed[playerControls.fire] && now - player.lastShotTime > PLAYER_COOLDOWN) {
        player.lastShotTime = now;
        
        // Sistema de power-ups:
        // Nivel 1: 1 bala (recta)
        // Nivel 2: 2 balas separadas (rectas)
        // Nivel 3: 3 balas en fila horizontal (rectas)
        // Nivel 4+: 3 balas dispersas (diagonal)
        if (player.weaponLevel === 1) {
            // 1 bala recta
            createBullet(player.x + player.width / 2 - 9, player.y, 0, -10, player.id);
        } else if (player.weaponLevel === 2) {
            // 2 balas separadas horizontalmente
            createBullet(player.x + player.width / 2 - 15, player.y, 0, -10, player.id); // Izquierda
            createBullet(player.x + player.width / 2 - 3, player.y, 0, -10, player.id);  // Derecha
        } else if (player.weaponLevel === 3) {
            // 3 balas en fila horizontal (lado a lado)
            createBullet(player.x + player.width / 2 - 9, player.y, 0, -10, player.id);   // Centro
            createBullet(player.x + player.width / 2 - 21, player.y, 0, -10, player.id); // Izquierda
            createBullet(player.x + player.width / 2 + 3, player.y, 0, -10, player.id);  // Derecha
        } else if (player.weaponLevel >= 4) {
            // 3 balas dispersas (diagonal) - nivel máximo
            createBullet(player.x + player.width / 2 - 9, player.y, 0, -10, player.id);  // Centro
            createBullet(player.x + player.width / 2 - 9, player.y, -3, -9, player.id);  // Diagonal izquierda
            createBullet(player.x + player.width / 2 - 9, player.y, 3, -9, player.id);   // Diagonal derecha
        }
    }
}