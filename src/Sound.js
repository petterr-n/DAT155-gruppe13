import * as THREE from 'three';

export function addBackgroundSound(camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const audioLoader = new THREE.AudioLoader();
    const backgroundSound = new THREE.Audio(listener);

    // Function to start the sound after user interaction
    function startBackgroundSound() {
        audioLoader.load('assets/sound/jungle-nature.mp3', function(buffer) {
            backgroundSound.setBuffer(buffer);
            backgroundSound.setLoop(true);
            backgroundSound.setVolume(0.5);
            backgroundSound.play();
        });
    }

    // Add event listener to start sound on user interaction
    document.addEventListener('click', startBackgroundSound, { once: true });
}