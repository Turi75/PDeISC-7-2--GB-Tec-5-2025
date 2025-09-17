
import { gameState } from './state.js';

// Referencia al contenedor principal donde se representa visualmente el juego.
const gameContainer = document.getElementById('game-container');

/* Borra todos los elementos del fotograma anterior para evitar artefactos visuales y preparar el contenedor para la nueva representación.
 */
function clearGameContainer() {
    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }
}

/* Crea y posiciona los elementos HTML (divs) para cada objeto del juego (jugadores, enemigos, balas, etc.) basándose en el estado actual.
 */
function renderElements() {
    // Renderiza a los jugadores que estén activos.
    gameState.players.forEach(player => {
        if (player && player.isActive) {
            const playerElement = document.createElement('div');
            
            // *** INICIO DE LA MODIFICACIÓN ***
            // Asigna una clase base 'player' y una clase específica para cada jugador.
            playerElement.className = `player player-${player.id}`; 
            // *** FIN DE LA MODIFICACIÓN ***

            playerElement.id = `player-${player.id}`;
            playerElement.style.left = `${player.x}px`;
            playerElement.style.top = `${player.y}px`;
            playerElement.style.width = `${player.width}px`;
            playerElement.style.height = `${player.height}px`;
            
            // Si el jugador es invulnerable, aplica un efecto visual de parpadeo.
            if (player.invulnerable) {
                playerElement.style.opacity = Math.abs(Math.sin(Date.now() * 0.01));
            }
            
            gameContainer.appendChild(playerElement);
        }
    });

    // Renderiza a todos los enemigos.
    gameState.enemies.forEach(enemy => {
        if (enemy) {
            const enemyElement = document.createElement('div');
            enemyElement.className = `enemy ${enemy.className}`;
            enemyElement.style.left = `${enemy.x}px`;
            enemyElement.style.top = `${enemy.y}px`;
            enemyElement.style.width = `${enemy.width}px`;
            enemyElement.style.height = `${enemy.height}px`;
            
            // Aplica un filtro visual específico para el enemigo agresivo.
            if (enemy.type === 'aggressive') {
                enemyElement.style.filter = 'hue-rotate(270deg) brightness(1.3)';
            }

            gameContainer.appendChild(enemyElement);
        }
    });

    // Renderiza las balas de los jugadores.
    gameState.bullets.forEach(bullet => {
        if (bullet) {
            const bulletElement = document.createElement('div');
            bulletElement.className = 'bullet player-bullet';
            bulletElement.style.left = `${bullet.x}px`;
            bulletElement.style.top = `${bullet.y}px`;
            bulletElement.style.width = `${bullet.width}px`;
            bulletElement.style.height = `${bullet.height}px`;
            gameContainer.appendChild(bulletElement);
        }
    });

    // Renderiza las balas de los enemigos.
    gameState.enemyBullets.forEach((bullet) => {
        if (bullet) {
            const bulletElement = document.createElement('div');
            bulletElement.className = 'bullet enemy-bullet';
            bulletElement.style.left = `${bullet.x}px`;
            bulletElement.style.top = `${bullet.y}px`;
            bulletElement.style.width = `${bullet.width}px`;
            bulletElement.style.height = `${bullet.height}px`;
            gameContainer.appendChild(bulletElement);
        }
    });

    // Renderiza los power-ups.
    gameState.powerUps.forEach(powerUp => {
        if (powerUp) {
            const powerUpElement = document.createElement('div');
            powerUpElement.className = `power-up ${powerUp.className}`;
            powerUpElement.style.left = `${powerUp.x}px`;
            powerUpElement.style.top = `${powerUp.y}px`;
            powerUpElement.style.width = `${powerUp.width}px`;
            powerUpElement.style.height = `${powerUp.height}px`;
            gameContainer.appendChild(powerUpElement);
        }
    });
}

/* Función principal de renderizado que se llama en cada fotograma del bucle de juego, maneja la limpieza y la renderización de la pantalla.
 */
export function renderGame() {
    clearGameContainer();
    renderElements();
}