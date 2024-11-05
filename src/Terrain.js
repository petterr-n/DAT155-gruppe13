import * as THREE from 'three';

export function createTerrain() {
    const geometry = new THREE.PlaneGeometry(5000, 5000, 500, 500);

    // Modifiser høyden ved å bruke geometry.attributes.position
    const positionAttribute = geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = Math.random() * 10; // Legg til variasjon i høyden
        positionAttribute.setZ(i, z);
    }
    geometry.computeVertexNormals(); // Viktig for korrekt lys/skygge

    // Last inn tekstur for gress
    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('../assets/texture/grass.jpg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10); // Juster for tetthet på teksturen

    // Materiale med tekstur
    const material = new THREE.MeshPhongMaterial({ map: grassTexture });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Roter for å få det flatt
    return terrain;
}
