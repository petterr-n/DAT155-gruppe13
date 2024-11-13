import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    // Legg til lys
    const light = new THREE.DirectionalLight(0xffffff, 1); // fjerne 100
    light.position.set(50, 50, 50).normalize();
    scene.add(light);

    // Skybox
    const loader = new THREE.CubeTextureLoader();
    const skyboxTexture = loader.load([
        'images/skybox/skybox_px.jpg',
        'images/skybox/skybox_nx.jpg',
        'images/skybox/skybox_py.jpg',
        'images/skybox/skybox_ny.jpg',
        'images/skybox/skybox_pz.jpg',
        'images/skybox/skybox_nz.jpg'
    ]);
    scene.background = skyboxTexture;

    return scene;
}