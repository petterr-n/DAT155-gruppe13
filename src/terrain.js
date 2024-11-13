import * as THREE from 'three';

async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}

export async function createTerrain(scene) {
    const loader = new THREE.TextureLoader();

    // Last inn dirt- og mountain

    const grassTexture = loader.load('images/dirt2.png');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(30, 30);

    const rockTexture = loader.load('images/mountian.png');
    rockTexture.wrapS = THREE.RepeatWrapping;
    rockTexture.wrapT = THREE.RepeatWrapping;
    rockTexture.repeat.set(100, 100);

    const heightmap = loader.load('images/heightmap4.png', async (texture) => {
        const width = 500;
        const height = 500;
        const peak = 150;

        const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
        geometry.rotateX(-Math.PI / 2);

        // Juster høydene basert på heightmap
        const data = texture.image;
        texture.minFilter = THREE.LinearFilter;
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.drawImage(data, 0, 0, width, height);
        const pixels = ctx.getImageData(0, 0, width, height).data;

        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const grayValue = pixels[i * 4] / 255;
          
            geometry.attributes.position.setY(i, grayValue * peak);

        }

        geometry.computeVertexNormals();


        // Last inn shaderkoden fra filene
        const vertexShader = await loadShader('shaders/vertexShader.glsl');
        const fragmentShader = await loadShader('shaders/fragmentShader.glsl');

        // Opprett ShaderMaterial med innlastede shader-filer
        const material = new THREE.ShaderMaterial({
            uniforms: {
                grassTexture: { type: 't', value: grassTexture },
                rockTexture: { type: 't', value: rockTexture },
                
              transitionHeight: {value: 2.0 } // Juster overgangshøyden her

            },
            vertexShader,
            fragmentShader
        })

        const terrain = new THREE.Mesh(geometry, material);
        terrain.name = 'terrain';
        scene.add(terrain);
    });
}

// Get the height at a specific position on the terrain
export function getHeightAt(x, z, scene) {
    const terrain = scene.getObjectByName('terrain'); // Get terrain object by name

    if (!terrain) {
        console.error("Terrain not found in the scene!");
        return 0; // Return default height if terrain is missing
    }

    const position = terrain.geometry.attributes.position;
    const size = Math.sqrt(position.count); // Assuming square terrain geometry

    // Terrain scaling
    const terrainWidth = terrain.geometry.parameters.width; // Actual width of the terrain
    const terrainHeight = terrain.geometry.parameters.height; // Actual height of the terrain

    // Convert world (x, z) coordinates to grid (gridX, gridZ) coordinates
    const gridX = Math.floor((x + terrainWidth / 2) / terrainWidth * (size - 1));
    const gridZ = Math.floor((z + terrainHeight / 2) / terrainHeight * (size - 1));

    // Ensure the indices are within bounds
    const clampedGridX = Math.max(0, Math.min(size - 1, gridX));
    const clampedGridZ = Math.max(0, Math.min(size - 1, gridZ));

    // Compute index in the position attribute array
    const index = clampedGridZ * size + clampedGridX;
    return position.getY(index); // Get the height at this grid position
}


