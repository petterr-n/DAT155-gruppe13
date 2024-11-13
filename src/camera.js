import * as THREE from 'three';

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-100, 5, -100);
    camera.lookAt(0, 1, 0);
    return camera;
}