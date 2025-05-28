document.addEventListener('DOMContentLoaded', () => {
    const nombreJugador1Global = verificarNombreUsuario('index3.html');
    if (!nombreJugador1Global) {
        return;
    }

    // --- Lógica para el menú hamburguesa ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mainNavbar = document.querySelector('.navbar');

    if (navToggle && navLinks && mainNavbar) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mainNavbar.classList.toggle('nav-open');
            const isExpanded = navLinks.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // --- Resto del código del juego PPT ---
    const startScreen = document.getElementById('startScreenPpt');
    const saludoGlobalElemento = document.getElementById('saludoGlobalPpt');
    const selectVsPlayerBtn = document.getElementById('selectVsPlayerBtnPpt');
    const selectVsComputerBtn = document.getElementById('selectVsComputerBtnPpt');
    const playerNamesForm = document.getElementById('playerNamesFormPpt');
    const player2NameInputContainer = document.getElementById('player2NameInputContainerPpt');
    const player2NameInput = document.getElementById('player2NameInputPpt');
    const startGameWithNameBtn = document.getElementById('startGameWithNameBtnPpt');

    const gameContainer = document.getElementById('gameContainerPpt');
    const timerDisplay = document.getElementById('timerDisplayPpt');
    const player1Panel = document.getElementById('player1PanelPpt');
    const player1NameDisplayElement = document.getElementById('player1NameDisplayPpt');
    const player1ChoiceButtons = player1Panel.querySelectorAll('.player1-choice-ppt');
    const player1ChoiceDisplay = document.getElementById('player1ChoiceDisplayPpt');
    const player2Panel = document.getElementById('player2PanelPpt');
    const player2NameDisplayElement = document.getElementById('player2NameDisplayPpt');
    const player2ChoiceButtons = player2Panel.querySelectorAll('.player2-choice-ppt');
    const player2ChoiceDisplay = document.getElementById('player2ChoiceDisplayPpt');
    const player2KeyboardHint = document.getElementById('player2KeyboardHintPpt');
    const computerPanel = document.getElementById('computerPanelPpt');
    const computerChoiceDisplay = document.getElementById('computerChoiceDisplayPpt');
    const roundResultDisplay = document.getElementById('roundResultPpt');
    const turnIndicator = document.getElementById('turnIndicatorPpt');
    const player1ScoreDisplay = document.getElementById('player1ScorePpt');
    const player2ScoreDisplay = document.getElementById('player2ScorePpt');
    const tiesDisplay = document.getElementById('tiesPpt');
    const nextRoundBtn = document.getElementById('nextRoundBtnPpt');
    const revealBtnPVP = document.getElementById('revealBtnPVPPpt');
    const endGameBtn = document.getElementById('endGameBtnPpt');
    const resetGameBtn = document.getElementById('resetGameBtnPpt');
    const changeModeBtn = document.getElementById('changeModeBtnPpt');

    const finalScoreDisplay = document.getElementById('finalScoreDisplayPpt');
    const finalPlayer1ScoreDisplay = document.getElementById('finalPlayer1ScorePpt');
    const finalPlayer2ScoreDisplay = document.getElementById('finalPlayer2ScorePpt');
    const finalTiesDisplay = document.getElementById('finalTiesPpt');
    const winnerMessageDisplay = document.getElementById('winnerMessagePpt');

    const TIMER_DURATION = 10;
    let timerInterval;
    let timeLeft;
    let player1Choice = null;
    let player2Choice = null;
    let computerChoice = null;
    let gameMode = null;
    let currentPlayerTurn = null;
    let player1Name = nombreJugador1Global;
    let player2Name = "Jugador 2";
    let player1Score = 0;
    let player2Score = 0;
    let ties = 0;
    let gameEnded = false;

    const CHOICES = ['piedra', 'papel', 'tijeras'];
    const CHOICE_EMOJIS = { piedra: '✊', papel: '✋', tijeras: '✌️' };
    const KEY_MAP_P1 = { 'a': 'piedra', 's': 'papel', 'd': 'tijeras' };
    const KEY_MAP_P2 = { '4': 'piedra', '5': 'papel', '6': 'tijeras' };

    if (saludoGlobalElemento) {
        saludoGlobalElemento.textContent = `Hola ${player1Name}, bienvenido. Elige un modo para PPT.`;
    }

    if (selectVsPlayerBtn) selectVsPlayerBtn.addEventListener('click', () => prepareNameEntry('pvp'));
    if (selectVsComputerBtn) selectVsComputerBtn.addEventListener('click', () => prepareNameEntry('pvc'));

    function prepareNameEntry(mode) {
        gameMode = mode;
        if (playerNamesForm) playerNamesForm.classList.remove('hidden-ppt');

        if (mode === 'pvp') {
            if (player2NameInputContainer) player2NameInputContainer.classList.remove('hidden-ppt');
            if (player2NameInput) {
                player2NameInput.placeholder = "Alias Jugador 2";
                player2NameInput.value = "";
                player2NameInput.focus();
            }
        } else {
            if (player2NameInputContainer) player2NameInputContainer.classList.add('hidden-ppt');
            if (startGameWithNameBtn) startGameWithNameBtn.focus();
        }
    }

    if (startGameWithNameBtn) {
        startGameWithNameBtn.addEventListener('click', () => {
            if (gameMode === 'pvp') {
                player2Name = player2NameInput.value.trim() || "Operador 2";
                if (player2Name.toLowerCase() === player1Name.toLowerCase()) {
                    alert("El Jugador 2 no puede tener el mismo nombre que el Jugador 1.");
                    if (player2NameInput) player2NameInput.focus();
                    return;
                }
            } else {
                player2Name = "IA Némesis";
            }
            startGame();
        });
    }

    function startGame() {
        if (startScreen) startScreen.classList.add('hidden-ppt');
        if (gameContainer) gameContainer.classList.remove('hidden-ppt');
        if (finalScoreDisplay) finalScoreDisplay.classList.add('hidden-ppt');
        gameEnded = false;
        if (endGameBtn) endGameBtn.classList.remove('hidden-ppt');

        if (player1NameDisplayElement) player1NameDisplayElement.textContent = player1Name;
        if (player1ScoreDisplay) player1ScoreDisplay.querySelector('span').textContent = player1Name;
        if (player2NameDisplayElement) player2NameDisplayElement.textContent = player2Name;
        if (player2ScoreDisplay) player2ScoreDisplay.querySelector('span').textContent = player2Name;
        
        const player1ScoreTextElement = document.getElementById('player1ScorePpt');
        if(player1ScoreTextElement) player1ScoreTextElement.childNodes[0].nodeValue = `${player1Name}`;

        const player2ScoreTextElement = document.getElementById('player2ScorePpt');
         if(player2ScoreTextElement) player2ScoreTextElement.childNodes[0].nodeValue = `${player2Name}`;

        if (gameMode === 'pvc') {
            if (computerPanel) {
                computerPanel.querySelector('h2').textContent = player2Name;
                computerPanel.classList.remove('hidden-ppt');
            }
            if (player2Panel) player2Panel.classList.add('hidden-ppt');
            if (player2KeyboardHint) player2KeyboardHint.classList.add('hidden-ppt');
            currentPlayerTurn = 1;
            if (turnIndicator) turnIndicator.classList.add('hidden-ppt');
        } else {
            if (player2Panel) player2Panel.classList.remove('hidden-ppt');
            if (computerPanel) computerPanel.classList.add('hidden-ppt');
            if (player2KeyboardHint) player2KeyboardHint.classList.remove('hidden-ppt');
            currentPlayerTurn = 1;
            updateTurnIndicator();
            enablePlayerControls(player2ChoiceButtons, false);
        }
        if (player1Panel) player1Panel.classList.remove('inactive-turn-ppt');
        if (player2Panel) player2Panel.classList.remove('inactive-turn-ppt');
        if (gameMode === 'pvp' && currentPlayerTurn === 1 && player2Panel) {
             player2Panel.classList.add('inactive-turn-ppt');
        }

        resetScores();
        resetRoundState();
    }

    function startTimer() {
        if (gameEnded || !timerDisplay) return;
        timeLeft = TIMER_DURATION;
        timerDisplay.textContent = timeLeft;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeOut();
            }
        }, 1000);
    }

    function stopTimer() { clearInterval(timerInterval); }

    function handleTimeOut() {
        if (gameEnded || !roundResultDisplay) return;
        roundResultDisplay.textContent = `¡Tiempo agotado para ${currentPlayerTurn === 1 ? player1Name : player2Name}!`;
        roundResultDisplay.className = 'result-text-ppt lose-ppt';
        disableAllChoiceButtons();

        if (gameMode === 'pvc') {
            updateScores('player2');
            displayResult( 'player2', player1Choice, computerChoice || CHOICES[Math.floor(Math.random() * CHOICES.length)]);
        } else if (gameMode === 'pvp') {
            if (currentPlayerTurn === 1 && !player1Choice) {
                updateScores('player2');
                roundResultDisplay.textContent = `${player1Name} no eligió. ¡${player2Name} gana la ronda!`;
            } else if (currentPlayerTurn === 2 && !player2Choice) {
                updateScores('player1');
                roundResultDisplay.textContent = `${player2Name} no eligió. ¡${player1Name} gana la ronda!`;
            }
        }
        if (nextRoundBtn) nextRoundBtn.classList.remove('hidden-ppt');
        if (revealBtnPVP) revealBtnPVP.classList.add('hidden-ppt');
    }

    function startPlayerTurn() {
        if (gameEnded) return;
        if (gameMode === 'pvp') {
            updateTurnIndicator();
            if (currentPlayerTurn === 1) {
                enablePlayerControls(player1ChoiceButtons, true);
                enablePlayerControls(player2ChoiceButtons, false);
                if (player1Panel) player1Panel.classList.remove('inactive-turn-ppt');
                if (player2Panel) player2Panel.classList.add('inactive-turn-ppt');
            } else {
                enablePlayerControls(player1ChoiceButtons, false);
                enablePlayerControls(player2ChoiceButtons, true);
                if (player1Panel) player1Panel.classList.add('inactive-turn-ppt');
                if (player2Panel) player2Panel.classList.remove('inactive-turn-ppt');
            }
        } else {
            enablePlayerControls(player1ChoiceButtons, true);
            if (turnIndicator) turnIndicator.classList.add('hidden-ppt');
            if (player1Panel) player1Panel.classList.remove('inactive-turn-ppt');
        }
        startTimer();
    }

    player1ChoiceButtons.forEach(button => button.addEventListener('click', () => handlePlayerChoice(1, button.dataset.choice, button)));
    player2ChoiceButtons.forEach(button => button.addEventListener('click', () => handlePlayerChoice(2, button.dataset.choice, button)));

    document.addEventListener('keydown', (event) => {
        if (gameEnded || !gameContainer || gameContainer.classList.contains('hidden-ppt')) return;
        const key = event.key.toLowerCase();
        if (gameMode === 'pvp') {
            if (currentPlayerTurn === 1 && KEY_MAP_P1[key] && !player1Choice) {
                handlePlayerChoice(1, KEY_MAP_P1[key], Array.from(player1ChoiceButtons).find(b => b.dataset.choice.toLowerCase() === KEY_MAP_P1[key]));
            } else if (currentPlayerTurn === 2 && KEY_MAP_P2[key] && !player2Choice) {
                handlePlayerChoice(2, KEY_MAP_P2[key], Array.from(player2ChoiceButtons).find(b => b.dataset.choice.toLowerCase() === KEY_MAP_P2[key]));
            }
        } else if (gameMode === 'pvc' && KEY_MAP_P1[key] && !player1Choice) {
            handlePlayerChoice(1, KEY_MAP_P1[key], Array.from(player1ChoiceButtons).find(b => b.dataset.choice.toLowerCase() === KEY_MAP_P1[key]));
        }
    });

    function handlePlayerChoice(playerNum, choice, buttonElement) {
        if (gameEnded) return;
        if (gameMode === 'pvp' && playerNum !== currentPlayerTurn) return;
        if (gameMode === 'pvc' && playerNum !== 1) return;

        stopTimer();
        if (buttonElement) {
            const parentButtons = playerNum === 1 ? player1ChoiceButtons : player2ChoiceButtons;
            parentButtons.forEach(btn => btn.classList.remove('selected-ppt'));
            buttonElement.classList.add('selected-ppt');
        }

        if (playerNum === 1) {
            player1Choice = choice.toLowerCase();
            if (player1ChoiceDisplay) player1ChoiceDisplay.textContent = `Elegiste: ${CHOICE_EMOJIS[player1Choice]}`;
            enablePlayerControls(player1ChoiceButtons, false);
            if (gameMode === 'pvc') {
                playRoundPVC();
            } else {
                if (player1ChoiceDisplay) player1ChoiceDisplay.textContent = `${player1Name} ha elegido.`;
                currentPlayerTurn = 2;
                startPlayerTurn();
            }
        } else if (playerNum === 2 && gameMode === 'pvp') {
            player2Choice = choice.toLowerCase();
            if (player2ChoiceDisplay) player2ChoiceDisplay.textContent = `Elegiste: ${CHOICE_EMOJIS[player2Choice]}`;
            enablePlayerControls(player2ChoiceButtons, false);
            if (player2ChoiceDisplay) player2ChoiceDisplay.textContent = `${player2Name} ha elegido.`;
            if (revealBtnPVP) revealBtnPVP.classList.remove('hidden-ppt');
            if (roundResultDisplay) roundResultDisplay.textContent = 'Ambos jugadores eligieron. ¡Mostrar jugadas!';
            if (turnIndicator) turnIndicator.textContent = `Presiona "Mostrar Jugadas"`;
        }
    }

    function enablePlayerControls(buttons, enable) {
        buttons.forEach(button => button.disabled = !enable);
    }
    function disableAllChoiceButtons() {
        enablePlayerControls(player1ChoiceButtons, false);
        enablePlayerControls(player2ChoiceButtons, false);
    }

    if (revealBtnPVP) {
        revealBtnPVP.addEventListener('click', () => {
            if (gameEnded) return;
            if (gameMode === 'pvp' && player1Choice && player2Choice) {
                if (player1ChoiceDisplay) player1ChoiceDisplay.textContent = `${player1Name}: ${CHOICE_EMOJIS[player1Choice]}`;
                if (player2ChoiceDisplay) player2ChoiceDisplay.textContent = `${player2Name}: ${CHOICE_EMOJIS[player2Choice]}`;
                playRoundPVP();
                revealBtnPVP.classList.add('hidden-ppt');
            }
        });
    }

    function getComputerChoice() {
        computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        if (computerChoiceDisplay) computerChoiceDisplay.textContent = CHOICE_EMOJIS[computerChoice];
    }

    function playRoundPVC() {
        if (!player1Choice) { handleTimeOut(); return; }
        getComputerChoice();
        const winner = determineWinner(player1Choice, computerChoice);
        updateScores(winner);
        displayResult(winner, player1Choice, computerChoice);
        if (nextRoundBtn) nextRoundBtn.classList.remove('hidden-ppt');
        disableAllChoiceButtons();
    }

    function playRoundPVP() {
        if (!player1Choice || !player2Choice) { handleTimeOut(); return; }
        const winner = determineWinner(player1Choice, player2Choice);
        updateScores(winner);
        displayResultPVP(winner, player1Choice, player2Choice);
        if (nextRoundBtn) nextRoundBtn.classList.remove('hidden-ppt');
        disableAllChoiceButtons();
    }

    function determineWinner(p1, p2) {
        if (!p1 && p2) return 'player2'; if (p1 && !p2) return 'player1';
        if (!p1 && !p2) return 'tie'; if (p1 === p2) return 'tie';
        if ((p1 === 'piedra' && p2 === 'tijeras') || (p1 === 'papel' && p2 === 'piedra') || (p1 === 'tijeras' && p2 === 'papel')) return 'player1';
        return 'player2';
    }

    function updateScores(winner) {
        if (winner === 'player1') player1Score++; else if (winner === 'player2') player2Score++; else if (winner === 'tie') ties++;
        
        const p1ScoreEl = player1ScoreDisplay.querySelector('span');
        if (p1ScoreEl && p1ScoreEl.nextSibling) p1ScoreEl.nextSibling.nodeValue = `: ${player1Score}`;
        
        const p2ScoreEl = player2ScoreDisplay.querySelector('span');
        if (p2ScoreEl && p2ScoreEl.nextSibling) p2ScoreEl.nextSibling.nodeValue = `: ${player2Score}`;
        
        const tiesEl = tiesDisplay.querySelector('span');
        if (tiesEl && tiesEl.nextSibling) tiesEl.nextSibling.nodeValue = `: ${ties}`;
    }

    function displayResult(winner, p1c, p2c) {
        if (!roundResultDisplay) return;
        roundResultDisplay.className = 'result-text-ppt';
        let p1cText = p1c ? capitalize(p1c) : "N/A";
        let p2cText = p2c ? capitalize(p2c) : "N/A";
        let p1cEmoji = p1c ? CHOICE_EMOJIS[p1c] : "X";
        let p2cEmoji = p2c ? CHOICE_EMOJIS[p2c] : "X";

        if (winner === 'tie') {
            roundResultDisplay.textContent = `¡Empate! ${player1Name} ${p1cEmoji} vs IA ${p2cEmoji}`;
            roundResultDisplay.classList.add('tie-ppt');
        } else if (winner === 'player1') {
            roundResultDisplay.textContent = `¡Gana ${player1Name}! ${p1cText} ${getVerb(p1c)} ${p2cText}. (${p1cEmoji} > ${p2cEmoji})`;
            roundResultDisplay.classList.add('win-ppt');
        } else {
            roundResultDisplay.textContent = `Gana la IA. ${p2cText} ${getVerb(p2c)} ${p1cText}. (${p2cEmoji} > ${p1cEmoji})`;
            roundResultDisplay.classList.add('lose-ppt');
        }
    }

    function displayResultPVP(winner, p1c, p2c) {
        if (!roundResultDisplay) return;
        roundResultDisplay.className = 'result-text-ppt';
        let p1cText = capitalize(p1c); let p2cText = capitalize(p2c);
        let p1cEmoji = CHOICE_EMOJIS[p1c]; let p2cEmoji = CHOICE_EMOJIS[p2c];

        if (winner === 'tie') {
            roundResultDisplay.textContent = `¡Empate! Ambos eligieron ${p1cEmoji}`;
            roundResultDisplay.classList.add('tie-ppt');
        } else if (winner === 'player1') {
            roundResultDisplay.textContent = `¡Gana ${player1Name}! ${p1cText} ${getVerb(p1c)} ${p2cText}. (${p1cEmoji} > ${p2cEmoji})`;
            roundResultDisplay.classList.add('win-ppt');
        } else {
            roundResultDisplay.textContent = `¡Gana ${player2Name}! ${p2cText} ${getVerb(p2c)} ${p1cText}. (${p2cEmoji} > ${p1cEmoji})`;
            roundResultDisplay.classList.add('win-ppt');
        }
    }

    function updateTurnIndicator() {
        if (gameEnded || !turnIndicator) { if (turnIndicator) turnIndicator.classList.add('hidden-ppt'); return; }
        if (gameMode === 'pvp') {
            turnIndicator.classList.remove('hidden-ppt');
            turnIndicator.textContent = `Turno de: ${currentPlayerTurn === 1 ? player1Name : player2Name}`;
        } else { turnIndicator.classList.add('hidden-ppt'); }
    }

    function resetRoundState() {
        if (gameEnded) return; stopTimer();
        player1Choice = null; player2Choice = null; computerChoice = null;
        if (player1ChoiceDisplay) player1ChoiceDisplay.textContent = 'Esperando elección...';
        if (player2ChoiceDisplay) player2ChoiceDisplay.textContent = 'Esperando elección...';
        if (gameMode === 'pvc' && computerChoiceDisplay) computerChoiceDisplay.textContent = '?';
        if (roundResultDisplay) { roundResultDisplay.textContent = 'Iniciando nueva ronda...'; roundResultDisplay.className = 'result-text-ppt'; }
        if (nextRoundBtn) nextRoundBtn.classList.add('hidden-ppt');
        if (revealBtnPVP) revealBtnPVP.classList.add('hidden-ppt');
        
        [...player1ChoiceButtons, ...player2ChoiceButtons].forEach(btn => {
            btn.classList.remove('selected-ppt');
            btn.disabled = false; 
        });
        
        if (gameMode === 'pvp') { currentPlayerTurn = 1; }
        startPlayerTurn();
    }

    if (nextRoundBtn) nextRoundBtn.addEventListener('click', resetRoundState);
    if (endGameBtn) {
        endGameBtn.addEventListener('click', () => {
            gameEnded = true; stopTimer(); disableAllChoiceButtons();
            
            const finalP1ScoreEl = finalPlayer1ScoreDisplay.querySelector('span');
            if(finalP1ScoreEl && finalP1ScoreEl.nextSibling) finalP1ScoreEl.nextSibling.nodeValue = `: ${player1Score}`;
            if(finalP1ScoreEl) finalP1ScoreEl.textContent = player1Name;

            const finalP2ScoreEl = finalPlayer2ScoreDisplay.querySelector('span');
            if(finalP2ScoreEl && finalP2ScoreEl.nextSibling) finalP2ScoreEl.nextSibling.nodeValue = `: ${player2Score}`;
            if(finalP2ScoreEl) finalP2ScoreEl.textContent = player2Name;

            const finalTiesEl = finalTiesDisplay.querySelector('span');
            if(finalTiesEl && finalTiesEl.nextSibling) finalTiesEl.nextSibling.nodeValue = `: ${ties}`;

            if (winnerMessageDisplay) {
                if (player1Score > player2Score) winnerMessageDisplay.textContent = `¡${player1Name} ha ganado la partida!`;
                else if (player2Score > player1Score) winnerMessageDisplay.textContent = `¡${player2Name} ha ganado la partida!`;
                else winnerMessageDisplay.textContent = "La partida termina en empate.";
            }
            if (finalScoreDisplay) finalScoreDisplay.classList.remove('hidden-ppt');
            if (roundResultDisplay) roundResultDisplay.textContent = "Partida Terminada";
            if (turnIndicator) turnIndicator.classList.add('hidden-ppt');
            if (nextRoundBtn) nextRoundBtn.classList.add('hidden-ppt');
            if (revealBtnPVP) revealBtnPVP.classList.add('hidden-ppt');
            endGameBtn.classList.add('hidden-ppt');
            if(resetGameBtn) resetGameBtn.classList.remove('hidden-ppt');
        });
    }

    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', () => {
            if (gameEnded || (gameContainer && !gameContainer.classList.contains('hidden-ppt'))) {
                startGame(); 
                if(resetGameBtn) resetGameBtn.classList.add('hidden-ppt');
            }
        });
    }
    if (changeModeBtn) {
        changeModeBtn.addEventListener('click', () => {
            stopTimer();
            if (gameContainer) gameContainer.classList.add('hidden-ppt');
            if (startScreen) startScreen.classList.remove('hidden-ppt');
            if (playerNamesForm) playerNamesForm.classList.add('hidden-ppt');
            if (player2NameInputContainer) player2NameInputContainer.classList.add('hidden-ppt');
            if (finalScoreDisplay) finalScoreDisplay.classList.add('hidden-ppt');
            if(resetGameBtn) resetGameBtn.classList.add('hidden-ppt');
            gameEnded = false;
        });
    }

    function resetScores() {
        player1Score = 0; player2Score = 0; ties = 0;
        
        const p1ScoreTextElement = document.getElementById('player1ScorePpt');
        if (p1ScoreTextElement) {
            const p1Span = p1ScoreTextElement.querySelector('span');
            if (p1Span) {
                p1Span.textContent = player1Name;
                if (p1Span.nextSibling) p1Span.nextSibling.nodeValue = `: ${player1Score}`;
            }
        }

        const p2ScoreTextElement = document.getElementById('player2ScorePpt');
        if (p2ScoreTextElement) {
            const p2Span = p2ScoreTextElement.querySelector('span');
            if (p2Span) {
                p2Span.textContent = player2Name;
                if (p2Span.nextSibling) p2Span.nextSibling.nodeValue = `: ${player2Score}`;
            }
        }
       
        const tiesTextElement = document.getElementById('tiesPpt');
        if(tiesTextElement) {
            const tiesSpan = tiesTextElement.querySelector('span');
            if(tiesSpan){
                tiesSpan.textContent = "Empates";
                if(tiesSpan.nextSibling) tiesSpan.nextSibling.nodeValue = `: ${ties}`;
            }
        }
    }

    function capitalize(string) { if (!string) return ''; return string.charAt(0).toUpperCase() + string.slice(1); }
    function getVerb(choice) { if (choice === 'piedra') return 'vence a'; if (choice === 'papel') return 'vence a'; if (choice === 'tijeras') return 'vence a'; return ''; }
});