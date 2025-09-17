import { gameState } from '../state.js';
import { createEnemyBullet } from './bullet.js';

// Aumenta la dificultad con el tiempo
function updateDifficulty() {
    const elapsedTime = (Date.now() - gameState.gameStartTime) / 1000; // en segundos
    const { difficulty } = gameState;

    // Ajustar la dificultad base según el número de jugadores
    const difficultyMultiplier = gameState.numPlayers === 2 ? 1.3 : 1.0;
    
    // Aumentar la velocidad de aparición cada 15 segundos
    if (elapsedTime > 15 && difficulty.spawnInterval > 600) {
        const baseReduction = Math.floor(elapsedTime / 15) * 200;
        difficulty.spawnInterval = Math.max(600, 2000 - baseReduction * difficultyMultiplier);
    }
    
    // Aumentar la cantidad de enemigos por oleada cada 20 segundos
    if (elapsedTime > 20 && difficulty.waveSize < 12) {
        const baseWaveSize = 2 + Math.floor(elapsedTime / 20);
        difficulty.waveSize = Math.min(12, Math.floor(baseWaveSize * difficultyMultiplier));
    }
    
    // Aumentar la velocidad de los enemigos cada 30 segundos
    if (elapsedTime > 30 && difficulty.enemySpeed < 8) {
        const baseSpeed = 2 + Math.floor(elapsedTime / 30);
        difficulty.enemySpeed = Math.min(8, baseSpeed * difficultyMultiplier);
    }
}

// Crea y añade enemigos al estado del juego.
export function spawnEnemies() {
    updateDifficulty();
    const now = Date.now();
    if (now - gameState.lastSpawnTime > gameState.difficulty.spawnInterval) {
        gameState.lastSpawnTime = now;
        
        let waveCount = gameState.difficulty.waveSize;
        
        // En modo 2 jugadores, aumentar significativamente la cantidad de enemigos
        if (gameState.numPlayers === 2) {
            waveCount = Math.floor(waveCount * 1.7); // Aumento del 70%
            
            // Añadir oleadas extra ocasionalmente
            if (Math.random() < 0.3) {
                waveCount += Math.floor(Math.random() * 3) + 1; // 1-3 enemigos extra
            }
        }

        for (let i = 0; i < waveCount; i++) {
            // Probabilidades ajustadas para más variedad en 2 jugadores
            const rand = Math.random();
            let shooterProbability = gameState.numPlayers === 2 ? 0.3 : 0.2;
            
            if (rand < 0.4) {
                gameState.enemies.push(createDiverEnemy());
            } else if (rand < 0.7) {
                gameState.enemies.push(createPatrolEnemy());
            } else if (rand < 0.7 + shooterProbability) {
                gameState.enemies.push(createShooterEnemy());
            } else {
                // Añadir enemigos más agresivos en modo 2 jugadores
                gameState.enemies.push(createAggressiveEnemy());
            }
        }
    }
}

// Mueve y actualiza el estado de todos los enemigos.
export function updateEnemies() {
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        enemy.move();
        
        // Manejar disparo de enemigos
        if (enemy.canShoot) {
            enemy.handleShooting();
        }
        
        // Eliminar enemigo si sale de la pantalla
        if (enemy.y > 600 || enemy.x < -50 || enemy.x > 850) {
            gameState.enemies.splice(i, 1);
        }
    }
}

// Enemigo que baja en picada con movimiento serpenteante
function createDiverEnemy() {
    return {
        x: Math.random() * 750,
        y: -30,
        width: 28,
        height: 28,
        type: 'diver',
        className: 'enemy-diver',
        moveCounter: 0,
        horizontalDirection: Math.random() > 0.5 ? 1 : -1,
        canShoot: false,
        move: function() {
            this.y += gameState.difficulty.enemySpeed;
            
            // Movimiento serpenteante más pronunciado en modo 2 jugadores
            this.moveCounter += gameState.numPlayers === 2 ? 0.15 : 0.1;
            const serpentineIntensity = gameState.numPlayers === 2 ? 3 : 2;
            this.x += Math.sin(this.moveCounter) * serpentineIntensity * this.horizontalDirection;
            
            // Mantener dentro de los límites
            if (this.x < 0 || this.x > 772) {
                this.horizontalDirection *= -1;
            }
        }
    };
}

// Enemigo que patrulla horizontalmente
function createPatrolEnemy() {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    return {
        x: side === 'left' ? -30 : 830,
        y: 50 + Math.random() * 200,
        width: 28,
        height: 28,
        type: 'patrol',
        className: 'enemy-patrol',
        patrolDirection: side === 'left' ? 2 : -2,
        verticalDirection: Math.random() > 0.5 ? 1 : -1,
        moveCounter: 0,
        lastShotTime: 0,
        shotInterval: gameState.numPlayers === 2 ? 2000 + Math.random() * 1500 : 2500 + Math.random() * 2000,
        canShoot: true,
        move: function() {
            // Movimiento horizontal más rápido en modo 2 jugadores
            const speedMultiplier = gameState.numPlayers === 2 ? 1.5 : 1;
            this.x += this.patrolDirection * speedMultiplier;
            
            // Movimiento vertical ondulante
            this.moveCounter += 0.05;
            this.y += Math.sin(this.moveCounter) * 1.5 * this.verticalDirection;
            
            // Mantener dentro de los límites verticales
            if (this.y < 30) {
                this.y = 30;
                this.verticalDirection = 1;
            } else if (this.y > 300) {
                this.y = 300;
                this.verticalDirection = -1;
            }
        },
        handleShooting: function() {
            const now = Date.now();
            if (this.x > 0 && this.x < 800 && now - this.lastShotTime > this.shotInterval) {
                this.lastShotTime = now;
                
                // Disparo hacia abajo con ángulo
                const vx = this.patrolDirection * 0.5;
                const vy = gameState.numPlayers === 2 ? 3 : 2.5;
                
                createEnemyBullet(
                    this.x + this.width / 2 - 6,
                    this.y + this.height,
                    vx,
                    vy
                );
            }
        }
    };
}

// Enemigo que dispara (shooter)
function createShooterEnemy() {
    return {
        x: Math.random() * 700 + 50,
        y: -30,
        width: 28,
        height: 28,
        type: 'shooter',
        className: 'enemy-patrol',
        targetY: 80 + Math.random() * 100,
        state: 'descending',
        lastShotTime: 0,
        shotInterval: gameState.numPlayers === 2 ? 1200 + Math.random() * 800 : 1500 + Math.random() * 1000,
        horizontalDirection: Math.random() > 0.5 ? 1 : -1,
        canShoot: true,
        move: function() {
            if (this.state === 'descending') {
                this.y += gameState.difficulty.enemySpeed * 0.8;
                if (this.y >= this.targetY) {
                    this.state = 'hovering';
                }
            } else if (this.state === 'hovering') {
                // Movimiento horizontal más errático en modo 2 jugadores
                const horizontalSpeed = gameState.numPlayers === 2 ? 0.8 : 0.5;
                this.x += this.horizontalDirection * horizontalSpeed;
                
                // Cambiar dirección si llega a los bordes
                if (this.x < 50 || this.x > 750) {
                    this.horizontalDirection *= -1;
                }
                
                // Movimiento vertical sutil
                this.y += Math.sin(Date.now() * 0.003) * 0.5;
            }
        },
        handleShooting: function() {
            const now = Date.now();
            if (this.state === 'hovering' && now - this.lastShotTime > this.shotInterval) {
                this.lastShotTime = now;
                
                // Encontrar el jugador más cercano para apuntar
                let targetPlayer = null;
                let minDistance = Infinity;
                
                gameState.players.forEach(player => {
                    if (player.isActive) {
                        const distance = Math.sqrt(
                            Math.pow(player.x - this.x, 2) + 
                            Math.pow(player.y - this.y, 2)
                        );
                        if (distance < minDistance) {
                            minDistance = distance;
                            targetPlayer = player;
                        }
                    }
                });
                
                if (targetPlayer) {
                    // Calcular dirección hacia el jugador
                    const dx = targetPlayer.x - this.x;
                    const dy = targetPlayer.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Normalizar y aplicar velocidad (más rápida en modo 2 jugadores)
                    const speed = gameState.numPlayers === 2 ? 4.5 : 4;
                    const vx = (dx / distance) * speed;
                    const vy = (dy / distance) * speed;
                    
                    createEnemyBullet(
                        this.x + this.width / 2 - 6,
                        this.y + this.height,
                        vx,
                        vy
                    );
                }
            }
        }
    };
}

// Nuevo enemigo agresivo (solo en modo 2 jugadores)
function createAggressiveEnemy() {
    return {
        x: Math.random() * 600 + 100,
        y: -30,
        width: 28,
        height: 28,
        type: 'aggressive',
        className: 'enemy-diver', // Usar sprite de diver pero con filtro diferente
        targetY: 150 + Math.random() * 100,
        state: 'descending',
        lastShotTime: 0,
        shotInterval: 1000 + Math.random() * 500, // Dispara muy frecuentemente
        moveCounter: 0,
        canShoot: true,
        move: function() {
            if (this.state === 'descending') {
                this.y += gameState.difficulty.enemySpeed * 1.2;
                this.moveCounter += 0.2;
                this.x += Math.sin(this.moveCounter) * 4; // Movimiento errático
                
                if (this.y >= this.targetY) {
                    this.state = 'aggressive';
                }
            } else if (this.state === 'aggressive') {
                // Movimiento hacia los jugadores
                let closestPlayer = null;
                let minDistance = Infinity;
                
                gameState.players.forEach(player => {
                    if (player.isActive) {
                        const distance = Math.sqrt(
                            Math.pow(player.x - this.x, 2) + 
                            Math.pow(player.y - this.y, 2)
                        );
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestPlayer = player;
                        }
                    }
                });
                
                if (closestPlayer) {
                    const dx = closestPlayer.x - this.x;
                    const dy = closestPlayer.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Moverse hacia el jugador pero lentamente
                    const speed = 1.5;
                    this.x += (dx / distance) * speed;
                    this.y += (dy / distance) * speed * 0.3; // Movimiento vertical más lento
                }
            }
        },
        handleShooting: function() {
            const now = Date.now();
            if (this.state === 'aggressive' && now - this.lastShotTime > this.shotInterval) {
                this.lastShotTime = now;
                
                // Disparo en múltiples direcciones
                const angles = [-0.5, 0, 0.5]; // Tres direcciones
                angles.forEach(angle => {
                    const speed = 3.5;
                    const vx = Math.sin(angle) * speed;
                    const vy = Math.cos(angle) * speed;
                    
                    createEnemyBullet(
                        this.x + this.width / 2 - 6,
                        this.y + this.height,
                        vx,
                        vy
                    );
                });
            }
        }
    };
}