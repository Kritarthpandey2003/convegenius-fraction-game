// scene.js - Three.js visualization of the fraction

class FractionScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        
        // Setup Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.y = -0.5; // Slight angle
        this.camera.lookAt(0, 0, 0);

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Setup Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(2, 5, 3);
        this.scene.add(directionalLight);

        // Materials matching the mockup
        this.unshadedMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe0e0e0, // Light grey
            roughness: 0.4,
            metalness: 0.1
        });

        this.shadedMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x82e041, // Vibrant Green from mockup
            roughness: 0.3,
            metalness: 0.1
        });

        this.pieces = [];
        this.denominator = 1;
        this.radius = 1.5;
        this.thickness = 0.2;
        this.gap = 0.05; // Gap between slices

        // Handle resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation loop
        this.animate();
    }

    createFractionModel(denominator) {
        this.denominator = denominator;
        
        // Remove old pieces
        this.pieces.forEach(p => this.scene.remove(p));
        this.pieces = [];

        const anglePerPiece = (Math.PI * 2) / denominator;

        for (let i = 0; i < denominator; i++) {
            const thetaStart = i * anglePerPiece + (this.gap / 2);
            const thetaLength = anglePerPiece - this.gap;

            const geometry = new THREE.CylinderGeometry(
                this.radius, this.radius, this.thickness, 
                32, 1, false, 
                thetaStart, thetaLength
            );

            // Rotate cylinder so the flat face is towards camera
            geometry.rotateX(Math.PI / 2);

            const mesh = new THREE.Mesh(geometry, this.unshadedMaterial);
            
            // Start scaled down for entry animation
            mesh.scale.set(0, 0, 0);
            
            this.scene.add(mesh);
            this.pieces.push(mesh);

            // Animate entry
            gsap.to(mesh.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5,
                delay: i * 0.1,
                ease: "back.out(1.7)"
            });
        }
    }

    setShadedPieces(count) {
        for (let i = 0; i < this.pieces.length; i++) {
            const isShaded = i < count;
            const piece = this.pieces[i];
            
            if (isShaded && piece.material === this.unshadedMaterial) {
                // Animate to shaded
                piece.material = this.shadedMaterial;
                gsap.fromTo(piece.position, 
                    { z: 0 }, 
                    { z: 0.1, duration: 0.1, yoyo: true, repeat: 1 }
                );
            } else if (!isShaded && piece.material === this.shadedMaterial) {
                // Animate to unshaded
                piece.material = this.unshadedMaterial;
                gsap.fromTo(piece.position, 
                    { z: 0 }, 
                    { z: -0.1, duration: 0.1, yoyo: true, repeat: 1 }
                );
            }
        }
    }

    onWindowResize() {
        if (!this.container) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Gentle idle rotation for the whole scene to make it feel alive
        this.scene.rotation.z = Math.sin(Date.now() * 0.001) * 0.02;
        this.scene.rotation.x = Math.sin(Date.now() * 0.0015) * 0.02;

        this.renderer.render(this.scene, this.camera);
    }
}
