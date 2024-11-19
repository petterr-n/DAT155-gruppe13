import * as THREE from 'three';

export default class MouseLookController {
    constructor(camera) {
        this.camera = camera;

        // Initial pitch (up/down) and yaw (left/right)
        this.pitch = 0; // rotation around the X-axis
        this.yaw = 0;   // rotation around the Y-axis

        // Clamp pitch values to avoid flipping
        this.pitchMin = -Math.PI / 2; // -90 degrees
        this.pitchMax = Math.PI / 2;  // 90 degrees

        // Create an object for controlling orientation
        this.camera.rotation.order = 'YXZ'; // Ensure proper rotation order

        // Event listener for pointer lock
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement) {
                // Set pitch and yaw based on camera's current rotation
                const euler = new THREE.Euler().setFromQuaternion(this.camera.quaternion, 'YXZ');
                this.pitch = euler.x;
                this.yaw = euler.y;
            }
        });
    }

    update(pitchDelta, yawDelta) {
        // Update pitch and yaw
        this.pitch += pitchDelta;
        this.yaw += yawDelta;

        // Clamp pitch to avoid flipping
        this.pitch = Math.max(this.pitchMin, Math.min(this.pitchMax, this.pitch));

        // Keep yaw within a full rotation (0 to 2 * Math.PI)
        this.yaw = (this.yaw + 2 * Math.PI) % (2 * Math.PI);

        // Apply pitch and yaw to the camera using Euler angles
        this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    }
}
