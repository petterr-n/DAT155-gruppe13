import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    // Light setup with reduced intensity
    const lightDirection = new THREE.Vector3(1, 1, 1).normalize();
    const light = new THREE.DirectionalLight(0xffffff, 0.3); // Reduced intensity
    const lightDistance = 1000;
    light.position.set(
        -lightDirection.x * lightDistance,
        -lightDirection.y * lightDistance,
        -lightDirection.z * lightDistance
    );
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    // Adjust shadows for the darker scene
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 2000;
    light.shadow.camera.left = -500;
    light.shadow.camera.right = 500;
    light.shadow.camera.top = 500;
    light.shadow.camera.bottom = -500;

    scene.add(light);
    scene.add(light.target);

    // Add dark ambient light
    const ambientLight = new THREE.AmbientLight(0x222222, 0.1);  // Dark ambient light
    scene.add(ambientLight);

    scene.background = new THREE.Color(0x222222);  // Dark gray background

    // Skybox (if applicable, make sure it's dark-themed)
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
