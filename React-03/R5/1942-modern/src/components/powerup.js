import { gameState } from '../state.js';

const POWERUP_SPAWN_RATE_1P = 5;
const POWERUP_SPAWN_RATE_2P = 7; // Reducido de 10 para que aparezcan más frecuentemente
const POWERUP_SPEED = 2;

// Intenta generar un power-up cuando un enemigo es derrotado.
export function trySpawnPowerUp(x, y) {
    gameState.enemiesDefeated++;
    const spawnThreshold = gameState.numPlayers === 1 ? POWERUP_SPAWN_RATE_1P : POWERUP_SPAWN_RATE_2P;

    // Probabilidad mejorada: siempre que se alcance el threshold O aleatoriamente con menor probabilidad
    if (gameState.enemiesDefeated % spawnThreshold === 0 || Math.random() < 0.08) {
        const type = Math.random() > 0.5 ? 'weapon_level' : 'diagonal_shot';
        gameState.powerUps.push({
            x,
            y,
            width: 20,
            height: 20,
            type,
            className: `power-up-${type}`,
        });
        console.log(`Power-up spawned: ${type} at (${x}, ${y}) - Enemies defeated: ${gameState.enemiesDefeated}`);
    }
}

// Mueve los power-ups hacia abajo y los elimina si salen de la pantalla.
export function updatePowerUps() {
    for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
        const powerUp = gameState.powerUps[i];
        powerUp.y += POWERUP_SPEED;
        
        if (powerUp.y > 600) {
            gameState.powerUps.splice(i, 1);
        }
    }
}

export function applyPowerUp(player, powerUp) {
    console.log(`Power-up ${powerUp.type} applied to ${player.name}`);
    
    if (powerUp.type === 'weapon_level') {
        player.weaponLevel++;
        if (player.weaponLevel > 4) {
            player.weaponLevel = 4; // Máximo 4 niveles
            // Bonus de puntos si ya tiene el nivel máximo
            player.score += 500;
        }
    } else if (powerUp.type === 'diagonal_shot') {
        // Este power-up específicamente mejora el arma
        if (player.weaponLevel < 4) {
            player.weaponLevel = Math.max(2, player.weaponLevel + 1);
        } else {
            // Bonus de puntos si ya tiene el nivel máximo
            player.score += 300;
        }
    }
    
    // Feedback visual - podríamos añadir efectos aquí
    player.score += 50; // Bonus por recoger power-up
}