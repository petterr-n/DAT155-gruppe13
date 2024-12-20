import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    const lightDirection = new THREE.Vector3(1, 1, 1).normalize();
    const light = new THREE.DirectionalLight(0xffffff, 0.3);
    const lightDistance = 1000;
    light.position.set(
        -lightDirection.x * lightDistance,
        -lightDirection.y * lightDistance,
        -lightDirection.z * lightDistance
    );
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 100;
    light.shadow.camera.left = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 500;
    light.shadow.camera.bottom = -500;

    scene.add(light);
    scene.add(light.target);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    scene.background = new THREE.Color(0x222222);

    const loader = new THREE.CubeTextureLoader();
    const skyboxTexture = loader.load([
        'assets/images/skybox/skybox_px.jpg',
        'assets/images/skybox/skybox_nx.jpg',
        'assets/images/skybox/skybox_py.jpg',
        'assets/images/skybox/skybox_ny.jpg',
        'assets/images/skybox/skybox_pz.jpg',
        'assets/images/skybox/skybox_nz.jpg'
    ]);
    scene.background = skyboxTexture;

    return scene;
}
