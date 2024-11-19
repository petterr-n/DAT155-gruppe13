import * as THREE from 'three';

// Function to generate cloud particles
function createClouds(scene, terrain, camera) {
    const cloudCount = 200;  // Number of clouds
    const cloudSize = 30;  // Base size of each cloud
    const maxHeight = 100; // Height above terrain where clouds will float
    const cloudTexture = new THREE.TextureLoader().load('assets/images/cloud.png');  // Load cloud texture
    cloudTexture.magFilter = THREE.LinearFilter;
    cloudTexture.minFilter = THREE.LinearFilter;

    // Material for each cloud (using transparent material)
    const material = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.7,  // Control the cloud transparency
        side: THREE.DoubleSide,
        depthWrite: false
    });

    // Array to store clouds for movement
    const clouds = [];

    for (let i = 0; i < cloudCount; i++) {
        // Randomize cloud position
        const x = Math.random() * 500 - 250; // Random X position
        const z = Math.random() * 500 - 250; // Random Z position

        // Get the terrain height at this point
        const terrainHeight = getHeightAt(x, z, terrain);  // Assume this function gets height from your terrain

        // Create a cloud group (to simulate 3D shape with several smaller spheres)
        const cloudGroup = new THREE.Group();

        // Create multiple spheres to simulate a cloud
        const numSpheres = Math.floor(Math.random() * 4 + 2); // Random number of spheres to form the cloud
        for (let j = 0; j < numSpheres; j++) {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(cloudSize * (Math.random() * 0.5 + 0.5), 16, 16), // Random size variation
                material
            );

            // Randomly position each sphere in the cloud
            sphere.position.set(
                Math.random() * cloudSize - cloudSize / 2,
                Math.random() * cloudSize - cloudSize / 2,
                Math.random() * cloudSize - cloudSize / 2
            );

            cloudGroup.add(sphere);  // Add sphere to cloud group
        }

        // Position the cloud above the terrain
        cloudGroup.position.set(x, terrainHeight + maxHeight, z);

        // Add the cloud to the scene
        scene.add(cloudGroup);
        clouds.push(cloudGroup);  // Store cloud for movement
    }

    function updateClouds() {
        clouds.forEach((cloudGroup) => {
            cloudGroup.position.x += Math.random() * 0.1 + 0.02;  // Random horizontal speed
            cloudGroup.position.z += Math.random() * 0.1 + 0.02;  // Random horizontal speed

            // Loop the clouds around if they go out of bounds
            if (cloudGroup.position.x > 250) cloudGroup.position.x = -250;
            if (cloudGroup.position.z > 250) cloudGroup.position.z = -250;
            if (cloudGroup.position.x < -250) cloudGroup.position.x = 250;
            if (cloudGroup.position.z < -250) cloudGroup.position.z = 250;

            // Make the cloud always face the camera (billboard effect)
            cloudGroup.lookAt(camera.position);
        });
    }

    return updateClouds;
}

// Function to get height at a specific point (you'll need to implement this based on your terrain)
function getHeightAt(x, z, terrain) {
    const raycaster = new THREE.Raycaster();
    const terrainPosition = terrain.position.clone();
    const mouse = new THREE.Vector2();
    raycaster.setFromCamera(mouse, terrain); // This is just an example, adjust to your needs

    raycaster.ray.origin.set(x, 1000, z);  // Start ray high above the terrain
    raycaster.ray.direction.set(0, -1, 0);  // Ray pointing downward

    const intersects = raycaster.intersectObject(terrain);
    if (intersects.length > 0) {
        return intersects[0].point.y;  // Return the Y height where the ray intersects the terrain
    } else {
        return 0;  // Default if no intersection (clouds will be placed at ground level)
    }
}

export { createClouds };
