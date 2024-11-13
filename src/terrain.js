import * as THREE from 'three';

async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}

export async function createTerrain(scene) {
    const loader = new THREE.TextureLoader();

    // Last inn gress- og steinteksturer
    const grassTexture = loader.load('images/grass.png');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10);

    const rockTexture = loader.load('images/rock.png');
    const heightmap = loader.load('images/heightmap.png', async (texture) => {
        const width = 256;
        const height = 256;
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
            geometry.attributes.position.setY(i, grayValue * 20);
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
                transitionHeight: {value: 1.0 }, // Juster overgangshøyden her
            },
            vertexShader,
            fragmentShader
        })

        const terrain = new THREE.Mesh(geometry, material);
        scene.add(terrain);
    });
}
