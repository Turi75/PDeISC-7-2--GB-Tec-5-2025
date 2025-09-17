import { gameState } from '../state.js';
import { applyPowerUp, trySpawnPowerUp } from './powerup.js';
import { damagePlayer } from './player.js';

const explosionSound = new Audio('/explosion.wav');

// Función AABB (Axis-Aligned Bounding Box) para detectar colisiones mejorada
function checkCollision(obj1, obj2) {
    // Verificar que ambos objetos existan y tengan las propiedades necesarias
    if (!obj1 || !obj2 || 
        obj1.x === undefined || obj1.y === undefined || obj1.width === undefined || obj1.height === undefined ||
        obj2.x === undefined || obj2.y === undefined || obj2.width === undefined || obj2.height === undefined) {
        return false;
    }
    
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Gestiona todas las posibles colisiones en el juego.
export function handleCollisions() {
    // Balas de jugadores vs. Enemigos
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        if (!bullet) continue;
        
        for (let j = gameState.enemies.length - 1; j >= 0; j--) {
            const enemy = gameState.enemies[j];
            if (!enemy) continue;
            
            if (checkCollision(bullet, enemy)) {
                // Sonido de explosión
                explosionSound.currentTime = 0;
                explosionSound.play().catch(() => {}); // Ignorar errores de audio
                
                // Intentar generar un power-up en la ubicación del enemigo
                trySpawnPowerUp(enemy.x, enemy.y);

                // Asignar puntos al jugador que disparó
                const shootingPlayer = gameState.players.find(p => p.id === bullet.playerId && p.isActive);
                if (shootingPlayer) {
                    shootingPlayer.score += 100;
                    console.log(`${shootingPlayer.name} ganó 100 puntos. Score: ${shootingPlayer.score}`);
                }
                
                // Eliminar bala y enemigo
                gameState.bullets.splice(i, 1);
                gameState.enemies.splice(j, 1);
                gameState.enemiesDefeated++;
                break; // La bala ya colisionó, no necesita seguir comprobando
            }
        }
    }

    // Balas enemigas vs. Jugadores - NUEVO SISTEMA DE VIDAS
    for (let i = gameState.enemyBullets.length - 1; i >= 0; i--) {
        const enemyBullet = gameState.enemyBullets[i];
        if (!enemyBullet) continue;
        
        for (let j = 0; j < gameState.players.length; j++) {
            const player = gameState.players[j];
            if (!player || !player.isActive || player.invulnerable) continue;
            
            if (checkCollision(enemyBullet, player)) {
                console.log(`¡BALA ENEMIGA IMPACTÓ! ${player.name} recibió daño`);
                
                // Aplicar daño al jugador (sistema de vidas)
                const wasEliminated = damagePlayer(player);
                
                // Eliminar la bala enemiga
                gameState.enemyBullets.splice(i, 1);
                
                if (wasEliminated) {
                    console.log(`${player.name} ha sido eliminado - sin vidas restantes`);
                }
                
                break; // Ya impactó, no seguir checkeando
            }
        }
    }

    // Jugadores vs. Enemigos (colisión directa) - NUEVO SISTEMA DE VIDAS
    gameState.players.forEach(player => {
        if (!player || !player.isActive || player.invulnerable) return;
        
        for (let i = gameState.enemies.length - 1; i >= 0; i--) {
            const enemy = gameState.enemies[i];
            if (!enemy) continue;
            
            if (checkCollision(player, enemy)) {
                console.log(`¡COLISIÓN DIRECTA! ${player.name} chocó con enemigo`);
                
                // Aplicar daño al jugador (sistema de vidas)
                const wasEliminated = damagePlayer(player);
                
                // Eliminar el enemigo tras la colisión
                gameState.enemies.splice(i, 1);
                
                if (wasEliminated) {
                    console.log(`${player.name} ha sido eliminado - sin vidas restantes`);
                }
            }
        }
    });

    // Jugadores vs. Power-ups
    gameState.players.forEach(player => {
        if (!player || !player.isActive) return;
        
        for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
            const powerUp = gameState.powerUps[i];
            if (!powerUp) continue;
            
            if (checkCollision(player, powerUp)) {
                console.log(`${player.name} recogió power-up: ${powerUp.type}`);
                applyPowerUp(player, powerUp);
                gameState.powerUps.splice(i, 1);
            }
        }
    });
}