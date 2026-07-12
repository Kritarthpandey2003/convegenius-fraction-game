// main.js - Core game logic

// Game Levels configuration
const levels = [
    { num: 2, den: 6 },
    { num: 3, den: 4 },
    { num: 1, den: 3 },
    { num: 5, den: 8 },
    { num: 4, den: 5 },
    { num: 3, den: 6 },
    { num: 7, den: 10 },
    { num: 2, den: 5 },
    { num: 5, den: 12 },
    { num: 8, den: 9 }
];

let currentLevelIndex = 0;
let currentShadedCount = 0;
let gameScene = null;

// DOM Elements
const targetNumEl = document.getElementById('target-numerator');
const targetDenEl = document.getElementById('target-denominator');
const btnAdd = document.getElementById('btn-add');
const btnRemove = document.getElementById('btn-remove');
const feedbackOverlay = document.getElementById('feedback-overlay');
const btnNext = document.getElementById('btn-next');
const btnVoice = document.getElementById('btn-voice'); // NEW Voice Button
const levelBadgeEl = document.getElementById('level-badge'); // Level Badge

function initGame() {
    // Initialize Three.js Scene
    gameScene = new FractionScene('scene-container');
    
    // Bind Events
    btnAdd.addEventListener('click', onAddPiece);
    btnRemove.addEventListener('click', onRemovePiece);
    btnNext.addEventListener('click', loadNextLevel);
    
    // Bind Voice Assistant Toggle
    btnVoice.addEventListener('click', () => {
        voiceAssistant.toggleListening(btnVoice, {
            onAdd: onAddPiece,
            onRemove: onRemovePiece,
            onNext: () => { if (!feedbackOverlay.classList.contains('hidden')) loadNextLevel(); }
        });
    });

    // Start Level 1
    loadLevel(currentLevelIndex);
}

function loadLevel(index) {
    if (index >= levels.length) {
        // Game Complete
        document.getElementById('feedback-message').innerText = "Game Complete!";
        btnNext.style.display = 'none';
        feedbackOverlay.classList.remove('hidden');
        soundManager.playSuccess();
        return;
    }

    const levelData = levels[index];
    currentShadedCount = 0;

    // Update UI
    targetNumEl.innerText = levelData.num;
    targetDenEl.innerText = levelData.den;
    levelBadgeEl.innerText = `Level ${index + 1} 🌟`;
    
    // Reset Overlays
    feedbackOverlay.classList.add('hidden');

    // Setup 3D Scene
    gameScene.createFractionModel(levelData.den);

    // Speak Instruction
    setTimeout(() => {
        voiceAssistant.speak(`Create the fraction ${levelData.num} over ${levelData.den}`);
    }, 1000); // Slight delay for better UX
}

function onAddPiece() {
    const levelData = levels[currentLevelIndex];
    if (currentShadedCount < levelData.den) {
        currentShadedCount++;
        gameScene.setShadedPieces(currentShadedCount);
        soundManager.playAdd();
        checkWinCondition();
    }
}

function onRemovePiece() {
    if (currentShadedCount > 0) {
        currentShadedCount--;
        gameScene.setShadedPieces(currentShadedCount);
        soundManager.playRemove();
    }
}

function checkWinCondition() {
    const levelData = levels[currentLevelIndex];
    if (currentShadedCount === levelData.num) {
        // Correct answer!
        setTimeout(() => {
            soundManager.playSuccess();
            voiceAssistant.speak("Great Job!");
            feedbackOverlay.classList.remove('hidden');
            
            // Confetti effect using simple DOM elements
            createConfetti();
        }, 300);
    }
}

function loadNextLevel() {
    currentLevelIndex++;
    loadLevel(currentLevelIndex);
}

// Simple Confetti Implementation
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'][Math.floor(Math.random() * 5)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.zIndex = '1000';
        document.body.appendChild(confetti);

        gsap.to(confetti, {
            y: window.innerHeight + 10,
            x: '+=' + (Math.random() * 200 - 100),
            rotation: Math.random() * 360,
            duration: 1 + Math.random() * 2,
            ease: 'power1.out',
            onComplete: () => {
                confetti.remove();
            }
        });
    }
}

// Start everything once DOM is ready
window.onload = initGame;
