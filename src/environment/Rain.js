import * as THREE from "three";

// Create raindrop particles
export function createRain(scene, terrain) {
    const rainCount = 10000;
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.3,
        opacity: 0.5,
        transparent: true,
        depthWrite: false,
    });

    for (let i = 0; i < rainCount; i++) {
        positions[i * 3] = Math.random() * 500 - 250;
        positions[i * 3 + 1] = Math.random() * 300 + 50;
        positions[i * 3 + 2] = Math.random() * 500 - 250;
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // Animation of raindrops falling
    function updateRain() {
        const positions = rain.geometry.attributes.position.array;

        for (let i = 0; i < rainCount; i++) {
            positions[i * 3 + 1] -= 0.5;

            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = Math.random() * 300 + 50;
            }
        }
        rain.geometry.attributes.position.needsUpdate = true;
    }
    return updateRain;
}