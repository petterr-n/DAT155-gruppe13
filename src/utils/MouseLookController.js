import * as THREE from 'three';

export default class MouseLookController {
    constructor(camera) {
        this.camera = camera;

        this.pitch = 0;
        this.yaw = 0;

        this.pitchMin = -Math.PI / 2;
        this.pitchMax = Math.PI / 2;

        this.camera.rotation.order = 'YXZ';

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement) {
                const euler = new THREE.Euler().setFromQuaternion(this.camera.quaternion, 'YXZ');
                this.pitch = euler.x;
                this.yaw = euler.y;
            }
        });
    }

    update(pitchDelta, yawDelta) {
        this.pitch += pitchDelta;
        this.yaw += yawDelta;

        this.pitch = Math.max(this.pitchMin, Math.min(this.pitchMax, this.pitch));

        this.yaw = (this.yaw + 2 * Math.PI) % (2 * Math.PI);

        this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    }
}
