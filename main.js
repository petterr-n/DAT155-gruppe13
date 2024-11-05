import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

if ( WebGL.isWebGL2Available() ) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    // Position the camera back so it can view the model
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const loader = new GLTFLoader();

    loader.load( '/quick_treeit_tree.glb', function ( gltf ) {

        gltf.scene.scale.set(0.02, 0.02, 0.02);
        gltf.scene.position.set(0, 0, 0);
        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Add ambient light and a directional light for better illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Softer ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5); // Position the light to shine on the model
    scene.add(directionalLight);

    function animate() {
        requestAnimationFrame(animate); // Ensure continuous animation loop
        renderer.render(scene, camera);
    }
    animate();

} else {

    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById( 'container' ).appendChild( warning );

}
