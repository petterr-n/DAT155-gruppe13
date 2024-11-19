import * as THREE from "three";

// Create raindrop particles
export function createRain(scene, terrain) {
    const rainCount = 10000;  // Number of raindrops
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,      // Light gray color for raindrops
        size: 0.3,            // Size of each raindrop
        opacity: 0.5,         // Transparency
        transparent: true,    // Make sure the material supports transparency
        depthWrite: false,    // Don't write to depth buffer to prevent blocking objects
    });

    // Set positions of raindrops
    for (let i = 0; i < rainCount; i++) {
        positions[i * 3] = Math.random() * 500 - 250; // x position
        positions[i * 3 + 1] = Math.random() * 300 + 50; // y position (start above terrain)
        positions[i * 3 + 2] = Math.random() * 500 - 250; // z position
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // Animation of raindrops falling
    function updateRain() {
        const positions = rain.geometry.attributes.position.array;

        for (let i = 0; i < rainCount; i++) {
            positions[i * 3 + 1] -= 0.5;  // Make raindrops fall (y-axis)

            // Reset raindrop position if it falls below the terrain
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = Math.random() * 300 + 50; // Reset to start position above the terrain
            }
        }

        rain.geometry.attributes.position.needsUpdate = true; // Notify that positions have been updated
    }

    return updateRain;
}
