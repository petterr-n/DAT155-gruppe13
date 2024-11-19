import * as THREE from 'three';

async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}

export async function createWater(scene, terrain) {
    // Load shaders
    const vertexShader = await loadShader('src/rendering/shaders/waterVertexShader.glsl');
    const fragmentShader = await loadShader('src/rendering/shaders/waterFragmentShader.glsl');

    const terrainLowestPoint = 0;
    const waterHeight = terrainLowestPoint + 1; // 1 unit above the lowest point

    const waterGeometry = new THREE.PlaneGeometry(1500, 1500);
    waterGeometry.rotateX(-Math.PI / 2); // Make sure the plane is horizontal

    const waterMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            waterTexture: { value: new THREE.TextureLoader().load('assets/images/water.png') }, // Use 'waterTexture' as the uniform name
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });

    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = waterHeight;

    console.log("Water mesh created: ", water);

    scene.add(water);

    return water;
}
