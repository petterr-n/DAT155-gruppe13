import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    // Legg til lys
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(50, 50, 50).normalize();
    scene.add(light);

    return scene;
}