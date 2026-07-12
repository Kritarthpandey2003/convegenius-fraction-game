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

const praiseMessages = [
    "Great Job!",
    "Math Genius!",
    "Super Star!",
    "You Did It!",
    "Spectacular!",
    "Amazing!",
    "Way to Go!"
];

function checkWinCondition() {
    if (currentShadedCount === currentLevelData.num) {
        // Correct answer!
        setTimeout(() => {
            const randomPraise = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
            
            document.getElementById('feedback-message').innerText = randomPraise;
            
            soundManager.playSuccess();
            voiceAssistant.speak(randomPraise);
            feedbackOverlay.classList.remove('hidden');
            
            // Pop the overlay in with a fun elastic animation
            gsap.fromTo(".feedback-content", 
                { scale: 0, rotation: -10 }, 
                { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
            );
            
            // Trigger spectacular canvas-confetti
            fireConfetti();
        }, 300);
    }
}

function loadNextLevel() {
    currentLevelIndex++;
    loadLevel(currentLevelIndex);
}

// Epic Confetti Implementation using canvas-confetti
function fireConfetti() {
    if (typeof confetti === 'function') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
}

// Start everything once DOM is ready
window.onload = initGame;
