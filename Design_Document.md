# Interactive Fraction Game - Design Document

## 1. Overview
This project is an interactive, web-based educational game designed to help students learn fractions. It fulfills the assignment requirements for the "Intern - Product" role at ConveGenius.AI. Built using modern web technologies (HTML5, CSS3, JavaScript, and Three.js), it provides an engaging, visual, and intuitive experience.

## 2. Technical Stack
- **Core:** Vanilla JavaScript (ES6+), HTML5, CSS3. (Chosen for zero-config runnability by reviewers).
- **3D Graphics:** Three.js (Used to create a premium, 3D circular fraction model, directly aligning with the Job Description's requirements).
- **Animations:** GSAP (GreenSock Animation Platform) for smooth, highly performant UI and 3D object transitions.
- **Audio:** Web Audio API (`AudioContext`) for procedurally generated, zero-dependency sound effects.

## 3. Game Mechanics
### Objective
The player must shade the correct number of pieces in a circular pie chart to match a given "Target Fraction" displayed at the top of the screen.

### Core Loop
1. **Level Generation:** The game loads a level defined by a target numerator and denominator (e.g., `2/6`).
2. **Visual Representation:** A 3D cylinder is dynamically sliced into `N` pieces (where `N` = denominator) using `THREE.CylinderGeometry`.
3. **Interaction:**
   - **Add Piece:** Finds the first unshaded piece and applies a vibrant green "shaded" material. It also triggers a small 3D pop animation and a positive audio tone.
   - **Remove Piece:** Finds the last shaded piece and reverts it to the "unshaded" material. It triggers a reverse animation and a lower audio tone.
4. **Validation:** After every "Add Piece" action, the game checks if the current shaded count matches the target numerator.
5. **Feedback & Progression:** Upon success, a triumphant sound plays, a confetti particle effect is triggered via DOM manipulation, and a "Great Job!" overlay appears, allowing progression to the next level.

## 4. Visuals and User Experience (UX)
### UI Design
The UI closely mimics the provided mockup reference, focusing on a clean, distraction-free environment suitable for young learners.
- **Typography:** Uses 'Montserrat' (via Google Fonts) for clear, bold readability.
- **Layout:** A centered, mobile-responsive vertical column layout.
- **Colors:** 
  - Background: Clean White (`#ffffff`)
  - Text: Dark Grey (`#4a4a4a`)
  - Primary UI (Buttons/Lines): Bright Blue (`#3ba1ec`)
  - Success/Shaded State: Vibrant Green (`#82e041`)
  - Unshaded State: Light Grey (`#e0e0e0`)

### 3D Graphics
Instead of flat 2D SVGs, the game utilizes Three.js to provide a subtle, premium 3D feel. 
- Pieces have actual thickness and cast soft simulated shadows using `MeshStandardMaterial` and a `DirectionalLight`.
- The entire scene features a very slow, gentle idle rotation to make the application feel dynamic and alive.
- Slices have small computational gaps between them to clearly distinguish individual fraction parts.

### Polish
- **Animations:** Adding or removing a piece scales the piece slightly along the Z-axis, providing tactile visual feedback.
- **Confetti:** A lightweight, procedurally generated confetti system rewards the user upon solving a level.
- **Zero Assets:** By using CDN links for libraries and procedural generation for audio and 3D models, the project requires absolutely zero external asset loading (no images, no `.mp3` files), ensuring it runs perfectly upon opening `index.html`.
