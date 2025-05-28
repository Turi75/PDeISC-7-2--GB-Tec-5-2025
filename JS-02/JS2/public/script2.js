// Script para Simón Dice (index2.html)
document.addEventListener('DOMContentLoaded', () => {
    const nombreJugadorGlobal = verificarNombreUsuario('index2.html');
    if (!nombreJugadorGlobal) {
        return; // Detener si no hay nombre (verificarNombreUsuario ya redirige)
    }

    // Elementos del Juego Principal (con sufijo -simon para evitar colisiones)
    const gameContainer = document.querySelector('.game-container-simon');
    const welcomeMessageDiv = document.getElementById('welcome-message-simon');
    const greenButton = document.getElementById('green');
    const redButton = document.getElementById('red');
    const yellowButton = document.getElementById('yellow');
    const blueButton = document.getElementById('blue');
    const startButton = document.getElementById('start-button-simon');
    const levelDisplay = document.getElementById('level-display-simon');
    const messageDisplay = document.getElementById('message-display-simon');
    const errorDetailsDisplay = document.getElementById('error-details-display-simon');

    const simonButtons = [greenButton, redButton, yellowButton, blueButton];
    const buttonColorNames = ["Verde", "Rojo", "Amarillo", "Azul"];

    let audioContext;
    const frequencies = [329.63, 261.63, 220.00, 164.81];
    const soundDurations = [200, 200, 200, 200];

    function initAudio() {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext && audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                if (!audioContext) {
                    messageDisplay.textContent = "Web Audio API no soportada.";
                    return false;
                }
            } catch (e) {
                messageDisplay.textContent = "Error al iniciar audio.";
                console.error("Error al iniciar AudioContext:", e);
                return false;
            }
        }
        return true;
    }

    function playTone(colorIndex, durationMs) {
        if (!audioContext || !frequencies[colorIndex] || !soundDurations[colorIndex]) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequencies[colorIndex], audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + (durationMs / 1000));
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + (durationMs / 1000));
    }

    let nombreJugador = nombreJugadorGlobal; // Usar el nombre global
    let sequence = [];
    let playerSequence = [];
    let level = 0;
    let playerTurn = false;
    let gameInProgress = false;

    let flashDuration = 350;
    let pauseBetweenFlashes = 200;

    // Preparar juego directamente
    if (welcomeMessageDiv) welcomeMessageDiv.textContent = `¡A jugar Simón, ${nombreJugador}!`;
    if (messageDisplay) messageDisplay.textContent = 'Presiona "Iniciar Juego"';
    if (errorDetailsDisplay) errorDetailsDisplay.classList.add('hidden');
    initAudio();


    if (startButton) startButton.addEventListener('click', startGame);
    simonButtons.forEach(button => {
        if (button) button.addEventListener('click', handlePlayerClick);
    });

    function startGame() {
        level = 0;
        sequence = [];
        playerSequence = [];
        gameInProgress = true;
        if (startButton) {
            startButton.disabled = true;
            startButton.textContent = "En Juego...";
        }
        if (messageDisplay) messageDisplay.textContent = "¡Atención!";
        if (errorDetailsDisplay) {
            errorDetailsDisplay.classList.add('hidden');
            errorDetailsDisplay.innerHTML = '';
        }
        adjustSpeed();
        nextRound();
    }

    function adjustSpeed() {
        flashDuration = Math.max(120, 350 - level * 12);
        pauseBetweenFlashes = Math.max(80, 200 - level * 8);
    }

    function nextRound() {
        level++;
        if (levelDisplay) levelDisplay.textContent = level;
        playerSequence = [];
        playerTurn = false;
        adjustSpeed();
        const randomNumber = Math.floor(Math.random() * 4);
        sequence.push(randomNumber);
        playSequence();
    }

    async function playSequence() {
        setButtonsClickable(false);
        if (messageDisplay) messageDisplay.textContent = `Memoriza, ${nombreJugador}...`;
        await new Promise(resolve => setTimeout(resolve, 600));

        for (let i = 0; i < sequence.length; i++) {
            const colorIndex = sequence[i];
            await flashButton(colorIndex, flashDuration);
            if (i < sequence.length - 1) {
                await new Promise(resolve => setTimeout(resolve, pauseBetweenFlashes));
            }
        }
        playerTurn = true;
        setButtonsClickable(true);
        if (messageDisplay) messageDisplay.textContent = `¡Tu Turno, ${nombreJugador}!`;
    }

    function flashButton(colorIndex, duration) {
        return new Promise(resolve => {
            const button = simonButtons[colorIndex];
            if (!button) { resolve(); return; }
            button.classList.add('lit');
            playTone(colorIndex, soundDurations[colorIndex]);
            setTimeout(() => {
                button.classList.remove('lit');
                resolve();
            }, duration);
        });
    }

    async function handlePlayerClick(event) {
        if (!playerTurn || !gameInProgress) return;
        const clickedButton = event.target;
        const colorIndex = parseInt(clickedButton.dataset.colorIndex);

        await flashButton(colorIndex, 120);
        playerSequence.push(colorIndex);
        const currentStep = playerSequence.length - 1;

        if (playerSequence[currentStep] !== sequence[currentStep]) {
            gameOver();
            return;
        }
        if (playerSequence.length === sequence.length) {
            if (messageDisplay) messageDisplay.textContent = `¡Correcto, ${nombreJugador}!`;
            setButtonsClickable(false);
            await new Promise(resolve => setTimeout(resolve, 900));
            nextRound();
        }
    }

    function gameOver() {
        if(audioContext && sequence.length > 0) playTone(0, 700); // Sonido de error
        
        const mainMessage = `¡Perdiste, ${nombreJugador}! Nivel alcanzado: ${level}.`;
        if (messageDisplay) messageDisplay.textContent = mainMessage + (errorDetailsDisplay ? ' Revisa el detalle abajo.' : '');
        gameInProgress = false;
        playerTurn = false;
        if (startButton) {
            startButton.disabled = false;
            startButton.textContent = "Reiniciar";
        }
        setButtonsClickable(false);

        if (errorDetailsDisplay) {
            let detalleHtml = "<p><strong><u>Análisis del error:</u></strong></p>";
            detalleHtml += `<p>Ronda ${level}, te equivocaste en el paso N° ${playerSequence.length}.</p>`;
            
            const secuenciaCorrectaNombres = sequence.map(idx => buttonColorNames[idx]);
            detalleHtml += `<p>Secuencia correcta: <strong>${secuenciaCorrectaNombres.join(' &rarr; ')}</strong></p>`;
            
            const secuenciaJugadorNombres = playerSequence.map(idx => buttonColorNames[idx]);
            if (playerSequence.length > 0) {
                 detalleHtml += `<p>Tú presionaste: <strong>${secuenciaJugadorNombres.join(' &rarr; ')}</strong></p>`;
            }

            const indiceError = playerSequence.length - 1;
            if (indiceError >= 0 && sequence[indiceError] !== undefined && playerSequence[indiceError] !== undefined) {
                 detalleHtml += `<p>Se esperaba <strong>${buttonColorNames[sequence[indiceError]]}</strong> y presionaste <strong>${buttonColorNames[playerSequence[indiceError]]}</strong>.</p>`;
            } else if (sequence.length > 0 && sequence[0] !== undefined) {
                detalleHtml += `<p>Se esperaba <strong>${buttonColorNames[sequence[0]]}</strong> y no presionaste correctamente el primer input.</p>`;
            } else {
                detalleHtml += `<p>Ocurrió un error al determinar la secuencia.</p>`
            }
            
            errorDetailsDisplay.innerHTML = detalleHtml;
            errorDetailsDisplay.classList.remove('hidden');
        }
    }
    
    function setButtonsClickable(clickable) {
        simonButtons.forEach(button => {
            if (button) button.style.pointerEvents = clickable ? 'auto' : 'none';
        });
    }
    setButtonsClickable(false);
});