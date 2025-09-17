import { gameState } from '../state.js';

// Añade una nueva bala del jugador al juego.
export function createBullet(x, y, vx, vy, playerId = 1) {
    const bullet = { 
        x, 
        y, 
        vx, 
        vy, 
        width: 18, 
        height: 18, 
        playerId // Para saber qué jugador disparó
    };
    gameState.bullets.push(bullet);
}

// Añade una nueva bala enemiga al juego - MEJORADO CON DEBUG
export function createEnemyBullet(x, y, vx, vy) {
    const bullet = { 
        x, 
        y, 
        vx, 
        vy, 
        width: 12, 
        height: 12
    };
    
    gameState.enemyBullets.push(bullet);
    
    // Debug: confirmar que se creó la bala
    console.log(`Bala enemiga creada en (${x}, ${y}) con velocidad (${vx}, ${vy}). Total balas enemigas: ${gameState.enemyBullets.length}`);
}

// Mueve todas las balas de los jugadores y las elimina si salen de la pantalla.
export function updateBullets() {
    // Iteramos en reversa para poder eliminar elementos sin afectar el índice.
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        if (!bullet) {
            gameState.bullets.splice(i, 1);
            continue;
        }
        
        bullet.y += bullet.vy;
        bullet.x += bullet.vx;
        
        if (bullet.y < -20 || bullet.x < -20 || bullet.x > 820) {
            gameState.bullets.splice(i, 1);
        }
    }
}

// Mueve todas las balas enemigas y las elimina si salen de la pantalla - MEJORADO
export function updateEnemyBullets() {
    const initialCount = gameState.enemyBullets.length;
    
    for (let i = gameState.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = gameState.enemyBullets[i];
        if (!bullet) {
            gameState.enemyBullets.splice(i, 1);
            continue;
        }
        
        // Actualizar posición
        bullet.y += bullet.vy;
        bullet.x += bullet.vx;
        
        // Verificar límites de pantalla - más generoso para debug
        if (bullet.y > 650 || bullet.y < -50 || bullet.x < -50 || bullet.x > 850) {
            gameState.enemyBullets.splice(i, 1);
        }
    }
    
    // Debug: mostrar si se eliminaron balas
    const finalCount = gameState.enemyBullets.length;
    if (initialCount > finalCount && finalCount === 0 && initialCount > 0) {
        console.log(`Se eliminaron ${initialCount - finalCount} balas enemigas que salieron de pantalla`);
    }
}