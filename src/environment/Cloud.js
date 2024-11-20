import * as THREE from 'three';

// Function to generate cloud particles
function createClouds(scene, terrain, camera) {
    const cloudCount = 200;
    const cloudSize = 30;
    const maxHeight = 100;

    const cloudTexture = new THREE.TextureLoader().load('assets/images/cloud.png');
    cloudTexture.magFilter = THREE.LinearFilter;
    cloudTexture.minFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const clouds = [];

    for (let i = 0; i < cloudCount; i++) {
        const x = Math.random() * 500 - 250;
        const z = Math.random() * 500 - 250;

        const terrainHeight = getHeightAt(x, z, terrain);
        const cloudGroup = new THREE.Group();

        const numSpheres = Math.floor(Math.random() * 4 + 2);
        for (let j = 0; j < numSpheres; j++) {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(cloudSize * (Math.random() * 0.5 + 0.5), 16, 16),
                material
            );
            sphere.position.set(
                Math.random() * cloudSize - cloudSize / 2,
                Math.random() * cloudSize - cloudSize / 2,
                Math.random() * cloudSize - cloudSize / 2
            );
            cloudGroup.add(sphere);
        }
        cloudGroup.position.set(x, terrainHeight + maxHeight, z);

        scene.add(cloudGroup);
        clouds.push(cloudGroup);
    }

    function updateClouds() {
        clouds.forEach((cloudGroup) => {
            cloudGroup.position.x += Math.random() * 0.1 + 0.02;
            cloudGroup.position.z += Math.random() * 0.1 + 0.02;

            if (cloudGroup.position.x > 250) cloudGroup.position.x = -250;
            if (cloudGroup.position.z > 250) cloudGroup.position.z = -250;
            if (cloudGroup.position.x < -250) cloudGroup.position.x = 250;
            if (cloudGroup.position.z < -250) cloudGroup.position.z = 250;

            cloudGroup.lookAt(camera.position);
        });
    }
    return updateClouds;
}

// Function to get height at a specific point
function getHeightAt(x, z, terrain) {
    const raycaster = new THREE.Raycaster();
    terrain.position.clone();
    const mouse = new THREE.Vector2();

    raycaster.setFromCamera(mouse, terrain);
    raycaster.ray.origin.set(x, 1000, z);
    raycaster.ray.direction.set(0, -1, 0);

    const intersects = raycaster.intersectObject(terrain);
    if (intersects.length > 0) {
        return intersects[0].point.y;
    } else {
        return 0;
    }
}
export { createClouds };