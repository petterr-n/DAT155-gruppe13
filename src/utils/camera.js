import * as THREE from 'three';

// Variabler for kameraets bevegelse
const movementSpeed = 0.2;
const rotationSpeed = 0.05;
const keys = {};

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.set(-24, 5, -42);
    camera.lookAt(-100, 2, 0);

    return camera;
}

// Function to initialize event listeners for key controls
export function initKeyControls() {
    window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });
}

// Funksjon for å oppdatere kameraets posisjon basert på tastetrykk
export function updateCamera(camera) {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    if (keys['ArrowUp'] || keys['w']) {
        camera.position.add(direction.clone().multiplyScalar(movementSpeed));
    }
    if(keys['ArrowDown'] || keys['s']) {
        camera.position.add(direction.clone().multiplyScalar(-movementSpeed));
    }
    if (keys['ArrowLeft'] || keys['a']) {
        camera.rotation.y += rotationSpeed;
    }
    if (keys['ArrowRight'] || keys['d']) {
        camera.rotation.y -= rotationSpeed;
    }

    console.log(`Kamera posisjon: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);
}