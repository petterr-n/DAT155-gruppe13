import * as THREE from 'three';

async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}

export async function createTerrain(scene) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();

        const sandTexture = loader.load('assets/images/sand.png');
        sandTexture.wrapS = THREE.RepeatWrapping;
        sandTexture.wrapT = THREE.RepeatWrapping;

        const jungleTexture = loader.load('assets/images/jungle.png');
        jungleTexture.wrapS = THREE.RepeatWrapping;
        jungleTexture.wrapT = THREE.RepeatWrapping;

        loader.load('assets/images/heightmap.png', async (texture) => {
            try {
                const width = 150;
                const height = 150;
                const peak = 30;

                const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
                geometry.rotateX(-Math.PI / 2);

                const data = texture.image;
                texture.minFilter = THREE.LinearFilter;
                const ctx = document.createElement('canvas').getContext('2d');
                ctx.canvas.width = width;
                ctx.canvas.height = height;
                ctx.drawImage(data, 0, 0, width, height);
                const pixels = ctx.getImageData(0, 0, width, height).data;

                const heights = [];

                for (let i = 0; i < geometry.attributes.position.count; i++) {
                    const grayValue = pixels[i * 4] / 255;
                    const heightValue = grayValue * peak;
                    geometry.attributes.position.setY(i, heightValue);
                    heights.push(heightValue);
                }

                geometry.computeVertexNormals();

                const vertexShader = await loadShader('src/rendering/shaders/VertexShader.glsl');
                const fragmentShader = await loadShader('src/rendering/shaders/FragmentShader.glsl');

                const lightDirection = new THREE.Vector3(-1, 1, 1).normalize();

                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        sandTexture: { value: sandTexture },
                        jungleTexture: { value: jungleTexture },
                        transitionHeight: { value: 2.8 },
                        lightDirection: { value: lightDirection },
                        lightColor: { value: new THREE.Color(1, 1, 1) },
                        ambientColor: { value: new THREE.Color(0.4, 0.4, 0.4) }
                    },
                    vertexShader,
                    fragmentShader
                });

                const terrain = new THREE.Mesh(geometry, material);
                terrain.name = 'terrain';
                terrain.receiveShadow = true;
                terrain.casShadow = false;
                scene.add(terrain);

                resolve(terrain);
            } catch (error) {
                reject(error);
            }
        }, undefined, (error) => {
            reject(error);
        });
    });
}