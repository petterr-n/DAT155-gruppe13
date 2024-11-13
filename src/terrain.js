import * as THREE from 'three';

export function createTerrain(scene) {
    const loader = new THREE.TextureLoader();

    loader.load('images/heightmap.png', (texture) => {
        const width = 200;   // Sett ønsket bredde på terrenget
        const height = 200;  // Sett ønsket høyde på terrenget
        const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
        geometry.rotateX(-Math.PI / 2); // Roter for å gjøre det horisontalt

        // Juster høydene basert på heightmap-bildet
        const data = texture.image;
        texture.minFilter = THREE.LinearFilter;
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.drawImage(data, 0, 0, width, height);
        const pixels = ctx.getImageData(0, 0, width, height).data;

        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const grayValue = pixels[i * 4] / 255; // Bruk gråskala-verdi (R-kanalen)
            geometry.attributes.position.setY(i, grayValue * 10); // Skaler høyden
        }

        // Oppdater geometrien
        geometry.computeVertexNormals();

        // Load a texture for the terrain surface (e.g., grass, dirt)
        loader.load('resources/grass.jpg', (terrainTexture) => {
            terrainTexture.wrapS = THREE.RepeatWrapping;
            terrainTexture.wrapT = THREE.RepeatWrapping;
            terrainTexture.repeat.set(100, 100); // Adjust tiling as needed

            // Create a material using the ground texture
            const material = new THREE.MeshLambertMaterial({
                map: terrainTexture, // Apply ground texture to the material
            });

            // Create the terrain mesh
            const terrain = new THREE.Mesh(geometry, material);
            terrain.name = 'terrain';
            scene.add(terrain);
        });
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

