// src/components/ui.js
import { gameState } from '../state.js';
import { guardarPuntaje, obtenerTop, borrarTodos } from '../dbLocal.js';

// Referencias a los elementos del DOM
const startMenu = document.getElementById('start-menu');
const inGameUI = document.getElementById('in-game-ui');
const endScreen = document.getElementById('end-screen');
const endMessage = document.getElementById('end-message');
const p1ScoreDisplay = document.getElementById('player1-score');
const p2ScoreDisplay = document.getElementById('player2-score');
const finalScoresDisplay = document.getElementById('final-scores');
const gameControls = document.getElementById('game-controls');

export function showStartMenu() {
    const allScreens = [
        startMenu,
        inGameUI,
        endScreen,
        document.getElementById('player-form-1'),
        document.getElementById('player-form-2'),
        document.getElementById('high-scores-screen'),
        gameControls
    ];

    allScreens.forEach(screen => {
        if (screen) {
            screen.classList.add('hidden');
        }
    });
    
    if (startMenu) {
      startMenu.classList.remove('hidden');
    }

    gameState.gameStatus = 'menu';
    
    const player1Input = document.getElementById('player1-name');
    const player1Input2P = document.getElementById('player1-name-2p');
    const player2Input2P = document.getElementById('player2-name-2p');
    
    if (player1Input) player1Input.value = '';
    if (player1Input2P) player1Input2P.value = '';
    if (player2Input2P) player2Input2P.value = '';
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }
    }
}

export function showEndScreen(message) {
    if (endMessage) endMessage.textContent = message;
    if (inGameUI) inGameUI.classList.add('hidden');
    if (endScreen) endScreen.classList.remove('hidden');
    if (gameControls) gameControls.classList.add('hidden');
    if (finalScoresDisplay) finalScoresDisplay.innerHTML = '';
    
    if (gameState.numPlayers === 1) {
        const player = gameState.players[0];
        if (player) {
            const scoreCard = document.createElement('div');
            scoreCard.className = 'score-card single-player';
            scoreCard.innerHTML = `
                <div class="player-info">
                    <h3>${player.name}</h3>
                    <div class="score">${player.score.toLocaleString()}</div>
                    <div class="enemies-defeated">Enemigos derrotados: ${gameState.enemiesDefeated}</div>
                </div>
            `;
            if (finalScoresDisplay) finalScoresDisplay.appendChild(scoreCard);
        }
    } else {
        const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
        
        sortedPlayers.forEach((player, index) => {
            if (!player) return;
            const scoreCard = document.createElement('div');
            scoreCard.className = `score-card ${index === 0 ? 'winner' : 'second-place'}`;
            scoreCard.innerHTML = `
                <div class="rank">${index === 0 ? '🏆' : '🥈'}</div>
                <div class="player-info">
                    <h3>${player.name}</h3>
                    <div class="score">${player.score.toLocaleString()}</div>
                </div>
            `;
            if (finalScoresDisplay) finalScoresDisplay.appendChild(scoreCard);
        });
        
        const statsCard = document.createElement('div');
        statsCard.className = 'stats-card';
        statsCard.innerHTML = `
            <div class="game-stats">
                <p>Enemigos derrotados: ${gameState.enemiesDefeated}</p>
                <p>Tiempo de juego: ${Math.floor((Date.now() - gameState.gameStartTime) / 1000)}s</p>
            </div>
        `;
        if (finalScoresDisplay) finalScoresDisplay.appendChild(statsCard);
    }

    addSaveScorePrompt();
    gameState.gameStatus = message.includes('VICTORIA') ? 'victory' : 'gameOver';
}

function addSaveScorePrompt() {
    const endScreenContent = endScreen.querySelector('.end-screen-content');
    if (!endScreenContent) return;
    
    const oldPrompt = document.getElementById('save-score-container');
    if (oldPrompt) oldPrompt.remove();

    const savePromptContainer = document.createElement('div');
    savePromptContainer.id = 'save-score-container';
    savePromptContainer.style.cssText = `
        margin: 20px 0;
        text-align: center;
        color: #ffd700;
    `;
    
    savePromptContainer.innerHTML = `
        <p style="font-size: 1.3rem; margin-bottom: 15px;">¿Deseas guardar tu puntaje?</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="save-score-yes" style="
                font-size: 1.2rem;
                padding: 10px 25px;
                cursor: pointer;
                background: linear-gradient(45deg, #28a745, #34ce57);
                border: 2px solid #fff;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                text-transform: uppercase;
                transition: all 0.3s ease;
            ">Sí</button>
            <button id="save-score-no" style="
                font-size: 1.2rem;
                padding: 10px 25px;
                cursor: pointer;
                background: linear-gradient(45deg, #dc3545, #e74c3c);
                border: 2px solid #fff;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                text-transform: uppercase;
                transition: all 0.3s ease;
            ">No</button>
        </div>
    `;

    const endButtons = endScreenContent.querySelector('.end-buttons');
    if (endButtons) {
        endScreenContent.insertBefore(savePromptContainer, endButtons);
    } else {
        endScreenContent.appendChild(savePromptContainer);
    }

    const saveYesButton = document.getElementById('save-score-yes');
    const saveNoButton = document.getElementById('save-score-no');
    
    if (saveYesButton) {
        saveYesButton.addEventListener('click', async () => {
            savePromptContainer.innerHTML = '<p style="color: #28a745; font-size: 1.2rem;">Guardando puntaje...</p>';
            
            try {
                await savePlayerScores();
                savePromptContainer.innerHTML = '<p style="color: #28a745; font-size: 1.2rem;">¡Puntaje guardado exitosamente!</p>';
            } catch (error) {
                console.error('Error al guardar:', error);
                savePromptContainer.innerHTML = '<p style="color: #dc3545; font-size: 1.2rem;">Error al guardar el puntaje</p>';
            }
        });
    }

    if (saveNoButton) {
        saveNoButton.addEventListener('click', () => {
            savePromptContainer.innerHTML = '<p style="color: #888; font-size: 1.2rem;">Puntaje no guardado</p>';
        });
    }
}

async function savePlayerScores() {
    console.log('Iniciando proceso de guardado de puntajes...');
    
    for (const player of gameState.players) {
        if (player && player.score > 0) {
            const registro = {
                nombre: player.name,
                puntaje: player.score,
                created_at: new Date().toISOString()
            };
            
            try {
                try {
                    const { supabase } = await import('../superbaseClient.js');
                    const { error } = await supabase.from('highscores').insert([registro]);
                    if (error) {
                        console.warn('Error al guardar en Supabase:', error.message);
                        throw error;
                    }
                    console.log('Puntaje guardado exitosamente en Supabase.');
                } catch (supabaseError) {
                    console.warn('Supabase no disponible, guardando solo localmente...');
                }
                
                await guardarPuntaje(registro);
                console.log('Puntaje guardado localmente.');
                
            } catch (error) {
                console.error('Error al guardar puntaje:', error);
                throw error;
            }
        }
    }
}

export async function showHighScores() {
    if (startMenu) startMenu.classList.add('hidden');
    
    let highScoresScreen = document.getElementById('high-scores-screen');
    if (!highScoresScreen) {
        highScoresScreen = document.createElement('div');
        highScoresScreen.id = 'high-scores-screen';
        highScoresScreen.className = 'ui-overlay';
        document.body.appendChild(highScoresScreen);
    }
    
    // *** INICIO DE LA MODIFICACIÓN: Nuevo HTML con contenedor para confirmación ***
    highScoresScreen.innerHTML = `
        <div class="high-scores-content">
            <h2>MEJORES PUNTAJES</h2>
            <div id="scores-list" class="scores-list">
                <div class="loading">Cargando puntajes...</div>
            </div>
            <div id="high-scores-actions" class="high-scores-buttons">
                <button id="back-to-menu">Volver al Menú</button>
                <button id="clear-scores">Limpiar Puntajes</button>
            </div>
            <div id="confirm-clear-actions" class="high-scores-buttons hidden" style="flex-direction: column; align-items: center; gap: 10px;">
                <p style="color: #ff6b6b; font-weight: bold; font-size: 1.2rem;">¿Estás seguro de que quieres borrar todos los puntajes?</p>
                <div>
                    <button id="confirm-clear-yes">Sí, Borrar</button>
                    <button id="confirm-clear-no">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    // *** FIN DE LA MODIFICACIÓN ***
    
    highScoresScreen.classList.remove('hidden');
    
    let puntajes = [];
    try {
        console.log('Intentando cargar puntajes desde Supabase...');
        const { supabase } = await import('../superbaseClient.js');
        const { data, error } = await supabase
            .from('highscores')
            .select('*')
            .order('puntaje', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error al cargar puntajes de Supabase:', error.message);
            throw new Error(error.message);
        }
        
        puntajes = data;
        console.log('Puntajes cargados desde Supabase:', puntajes);

    } catch (supabaseError) {
        console.warn('Fallo al cargar de Supabase. Cargando desde la base de datos local...');
        try {
            puntajes = await obtenerTop(10);
            console.log('Puntajes cargados desde IndexedDB:', puntajes);
        } catch (localError) {
            console.error('Error al cargar puntajes locales:', localError);
            const scoresList = document.getElementById('scores-list');
            if (scoresList) {
                scoresList.innerHTML = '<div class="error">Error al cargar puntajes</div>';
            }
            return;
        }
    }
    
    displayScores(puntajes);
    
    // *** INICIO DE LA MODIFICACIÓN: Nueva lógica para los botones ***
    const backButton = document.getElementById('back-to-menu');
    const clearButton = document.getElementById('clear-scores');
    const highScoresActions = document.getElementById('high-scores-actions');
    const confirmClearActions = document.getElementById('confirm-clear-actions');
    const confirmClearYes = document.getElementById('confirm-clear-yes');
    const confirmClearNo = document.getElementById('confirm-clear-no');
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            highScoresScreen.classList.add('hidden');
            showStartMenu();
        });
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            highScoresActions.classList.add('hidden');
            confirmClearActions.classList.remove('hidden');
        });
    }

    if (confirmClearNo) {
        confirmClearNo.addEventListener('click', () => {
            confirmClearActions.classList.add('hidden');
            highScoresActions.classList.remove('hidden');
        });
    }
    
    if (confirmClearYes) {
        confirmClearYes.addEventListener('click', async () => {
            try {
                try {
                    const { supabase } = await import('../superbaseClient.js');
                    await supabase.from('highscores').delete().gt('puntaje', -1);
                } catch (supabaseError) {
                    console.warn('No se pudo conectar con Supabase para borrar.');
                }
                await borrarTodos();
                displayScores([]);
            } catch (error) {
                alert('Error al borrar los puntajes.'); // Se podría reemplazar por un mensaje en la UI
            } finally {
                confirmClearActions.classList.add('hidden');
                highScoresActions.classList.remove('hidden');
            }
        });
    }
    // *** FIN DE LA MODIFICACIÓN ***
}

function displayScores(puntajes) {
    const scoresList = document.getElementById('scores-list');
    
    if (!scoresList) return;
    
    if (puntajes.length === 0) {
        scoresList.innerHTML = '<div class="no-scores">No hay puntajes guardados</div>';
        return;
    }
    
    scoresList.innerHTML = puntajes.map((puntaje, index) => `
        <div class="score-entry ${index < 3 ? 'top-score' : ''}">
            <div class="rank">#${index + 1}</div>
            <div class="player-name">${puntaje.nombre}</div>
            <div class="player-score">${puntaje.puntaje.toLocaleString()}</div>
            <div class="score-date">${new Date(puntaje.created_at).toLocaleDateString()}</div>
        </div>
    `).join('');
}

export function setupUIEventListeners(startGameCallback, showMenuCallback) {
    const restartButton = document.getElementById('restart-button');
    const menuButton = document.getElementById('menu-button');
    
    if (restartButton) {
        const newRestartButton = restartButton.cloneNode(true);
        restartButton.parentNode.replaceChild(newRestartButton, restartButton);
        
        newRestartButton.addEventListener('click', () => {
            if (endScreen) endScreen.classList.add('hidden');
            if (inGameUI) inGameUI.classList.remove('hidden');
            showGameControls(gameState.numPlayers);
            startGameCallback();
        });
    }

    if (menuButton) {
        const newMenuButton = menuButton.cloneNode(true);
        menuButton.parentNode.replaceChild(newMenuButton, menuButton);
        
        newMenuButton.addEventListener('click', () => {
            showMenuCallback();
        });
    }
}

export function showGameControls(numPlayers) {
    if (!gameControls) return;
    
    const controlsDisplay = document.getElementById('controls-display');
    if (!controlsDisplay) return;
    
    controlsDisplay.innerHTML = '';
    controlsDisplay.className = numPlayers === 1 ? 'controls-grid single-player' : 'controls-grid two-players';
    
    const player1Controls = document.createElement('div');
    player1Controls.className = 'player-controls';
    player1Controls.innerHTML = `
        <h4>${gameState.playerNames[0] || 'Jugador 1'}</h4>
        <div class="control-item">
            <span>Mover:</span>
            <span class="control-key">↑ ↓ ← →</span>
        </div>
        <div class="control-item">
            <span>Disparar:</span>
            <span class="control-key">Enter</span>
        </div>
    `;
    controlsDisplay.appendChild(player1Controls);
    
    if (numPlayers === 2) {
        const player2Controls = document.createElement('div');
        player2Controls.className = 'player-controls';
        player2Controls.innerHTML = `
            <h4>${gameState.playerNames[1] || 'Jugador 2'}</h4>
            <div class="control-item">
                <span>Mover:</span>
                <span class="control-key">W A S D</span>
            </div>
            <div class="control-item">
                <span>Disparar:</span>
                <span class="control-key">Espacio</span>
            </div>
        `;
        controlsDisplay.appendChild(player2Controls);
    }
    
    gameControls.classList.remove('hidden');
}

export function hideGameControls() {
    if (gameControls) gameControls.classList.add('hidden');
}

export function updateScoreUI() {
    gameState.players.forEach(player => {
        if (player.id === 1 && player.isActive && p1ScoreDisplay) {
            p1ScoreDisplay.innerHTML = `
                <div>${player.name}: ${player.score.toLocaleString()}</div>
                <div style="font-size: 0.9rem; color: #ff6b6b;">❤️ ${player.lives}</div>
            `;
            p1ScoreDisplay.style.display = 'block';
        } else if (player.id === 2 && player.isActive && p2ScoreDisplay) {
            p2ScoreDisplay.innerHTML = `
                <div>${player.name}: ${player.score.toLocaleString()}</div>
                <div style="font-size: 0.9rem; color: #ff6b6b;">❤️ ${player.lives}</div>
            `;
            p2ScoreDisplay.style.display = 'block';
        }
    });
    
    if (gameState.numPlayers < 2 && p2ScoreDisplay) {
        p2ScoreDisplay.style.display = 'none';
    }
}

export function checkGameConditions() {
    updateScoreUI();
    
    const activePlayers = gameState.players.filter(p => p.isActive);
    
    if (activePlayers.length === 0) {
        showEndScreen('GAME OVER - Todos los jugadores han perdido sus vidas');
    } else if (gameState.numPlayers === 2 && activePlayers.length === 1) {
        const survivor = activePlayers[0];
        showEndScreen(`¡${survivor.name} es el último superviviente!`);
    }
}