import * as THREE from 'three';

export function addBackgroundSound(camera) {
    const listner = new THREE.AudioListener();
    camera.add(listner);

    const audioLoader = new THREE.AudioLoader();
    const backgroundSound = new THREE.Audio(listner);

    audioLoader.load('sound/jungle-nature.mp3', function(buffer) {
        backgroundSound.setBuffer(buffer);
        backgroundSound.setLoop(true);
        backgroundSound.setVolume(0.5);
        backgroundSound.play();
    })
}