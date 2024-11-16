import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    // Definer lysretningen (juster x, y, z etter ønsket retning)
    const lightDirection = new THREE.Vector3(1, 1, 1).normalize();

    const lightDistance = 1000; // Juster avstanden hvis nødvendig
    const light = new THREE.DirectionalLight(0xffffff, 1); // Juster intensiteten hvis ønskelig
    light.position.set(
        -lightDirection.x * lightDistance,
        -lightDirection.y * lightDistance,
        -lightDirection.z * lightDistance
    );
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    // Juster skyggens innstillinger
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 2000;
    light.shadow.camera.left = -500;
    light.shadow.camera.right = 500;
    light.shadow.camera.top = 500;
    light.shadow.camera.bottom = -500;

    //light.name = 'DirectionalLight';

    scene.add(light);
    scene.add(light.target);

    return scene;
}
