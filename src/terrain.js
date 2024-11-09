import * as THREE from 'three';

export function createTerrain(scene) {
    const loader = new THREE.TextureLoader();

    loader.load('images/heightmap.png', (texture) => {
        const width = 256;   // Sett ønsket bredde på terrenget
        const height = 256;  // Sett ønsket høyde på terrenget
        const geometry = new THREE.PlaneGeometry(100, 100, width - 1, height - 1);
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

        // Lag mesh for terrenget og legg til scenen
        const material = new THREE.MeshLambertMaterial({ color: 0x88ccee, wireframe: false });
        const terrain = new THREE.Mesh(geometry, material);
        terrain.name = 'terrain';
        scene.add(terrain);
    });
}

// Function to calculate height at specific coordinates on the terrain (using terrain geometry)
export function getHeightAt(x, z, scene) {
    const terrain = scene.getObjectByName('terrain'); // Retrieve the terrain by its name

    if (!terrain) {
        console.error("Terrain not found in the scene!");
        return 0; // Return a default height (0) if terrain is missing
    }

    const position = terrain.geometry.attributes.position;
    const size = Math.sqrt(position.count); // Assuming square geometry

    const gridX = Math.floor((x + 100) / 200 * (size - 1));
    const gridZ = Math.floor((z + 100) / 200 * (size - 1));

    const index = gridZ * size + gridX;
    return position.getZ(index);
}