// main.js - Core game logic

// Procedural Level Generator for infinite gameplay
function generateRandomLevel(levelIndex) {
    // Difficulty increases as level goes up (max denominator 12)
    const maxDenom = Math.min(4 + Math.floor(levelIndex / 2), 12);
    const minDenom = 2;
    const den = Math.floor(Math.random() * (maxDenom - minDenom + 1)) + minDenom;
    const num = Math.floor(Math.random() * (den - 1)) + 1; // 1 to (den-1)
    return { num, den };
}

let currentLevelIndex = 0;
let currentShadedCount = 0;
let currentLevelData = null;
let gameScene = null;

// DOM Elements
const targetNumEl = document.getElementById('target-numerator');
const targetDenEl = document.getElementById('target-denominator');
const targetFractionContainer = document.querySelector('.target-fraction'); // For animations
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

    // Initial Entry Animation
    gsap.from(".header", { y: -50, opacity: 0, duration: 1, ease: "bounce.out", clearProps: "all" });
    gsap.from(".controls", { y: 50, opacity: 0, duration: 0.8, delay: 0.2, ease: "back.out(1.7)", clearProps: "all" });
    gsap.from(".voice-btn", { scale: 0, rotation: -180, duration: 0.6, delay: 0.5, ease: "back.out(1.7)", clearProps: "all" });
}

function loadLevel(index) {
    currentLevelData = generateRandomLevel(index);
    currentShadedCount = 0;

    // Update UI
    targetNumEl.innerText = currentLevelData.num;
    targetDenEl.innerText = currentLevelData.den;
    levelBadgeEl.innerText = `Level ${index + 1} 🌟`;
    
    // Reset Overlays
    feedbackOverlay.classList.add('hidden');

    // Setup 3D Scene
    gameScene.createFractionModel(currentLevelData.den);

    // Speak Instruction
    setTimeout(() => {
        voiceAssistant.speak(`Create the fraction ${currentLevelData.num} over ${currentLevelData.den}`);
    }, 1000); // Slight delay for better UX
    
    // Fun pop animation for the fraction text
    targetFractionContainer.style.transform = 'scale(1.2)';
    setTimeout(() => {
        targetFractionContainer.style.transform = 'scale(1)';
    }, 200);
}

function onAddPiece() {
    if (currentShadedCount < currentLevelData.den) {
        currentShadedCount++;
        gameScene.setShadedPieces(currentShadedCount);
        soundManager.playAdd();
        bumpFractionUI();
        checkWinCondition();
    }
}

function onRemovePiece() {
    if (currentShadedCount > 0) {
        currentShadedCount--;
        gameScene.setShadedPieces(currentShadedCount);
        soundManager.playRemove();
        bumpFractionUI();
    }
}

function bumpFractionUI() {
    targetFractionContainer.style.transform = 'scale(1.1)';
    setTimeout(() => {
        targetFractionContainer.style.transform = 'scale(1)';
    }, 150);
}

function checkWinCondition() {
    if (currentShadedCount === currentLevelData.num) {
        // Correct answer!
        setTimeout(() => {
            soundManager.playSuccess();
            voiceAssistant.speak("Great Job!");
            feedbackOverlay.classList.remove('hidden');
            
            // Pop the overlay in with a fun elastic animation
            gsap.fromTo(".feedback-content", 
                { scale: 0, rotation: -10 }, 
                { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
            );
            
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
