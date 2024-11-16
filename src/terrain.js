import * as THREE from 'three';

async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}

export async function createTerrain(scene) {
    const loader = new THREE.TextureLoader();

    // Last inn teksturer
    const grassTexture = loader.load('images/dirt2.png');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;

    const rockTexture = loader.load('images/mountian.png');
    rockTexture.wrapS = THREE.RepeatWrapping;
    rockTexture.wrapT = THREE.RepeatWrapping;

    loader.load('images/heightmap.png', async (texture) => {
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

        // Definer lysretningen (samme som i scene.js)
        const lightDirection = new THREE.Vector3(-1, 1, 1).normalize(); // Juster etter ønsket retning

        // Opprett ShaderMaterial med oppdaterte uniforms
        const material = new THREE.ShaderMaterial({
            uniforms: {
                grassTexture: { value: grassTexture },
                rockTexture: { value: rockTexture },
                transitionHeight: { value: 2.0 },
                lightDirection: { value: lightDirection },
                lightColor: { value: new THREE.Color(1, 1, 1) }, // Juster lysstyrken hvis ønskelig
                ambientColor: { value: new THREE.Color(0.4, 0.4, 0.4) } // Juster ambient lys hvis ønskelig
            },
            vertexShader,
            fragmentShader
        });

        const terrain = new THREE.Mesh(geometry, material);
        terrain.name = 'terrain';
        terrain.receiveShadow = true;
        terrain.castShadow = false;

        scene.add(terrain);
    });
}
