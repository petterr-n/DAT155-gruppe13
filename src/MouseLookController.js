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
    }

    update(pitchDelta, yawDelta) {
        // Update pitch and yaw
        this.pitch += pitchDelta;
        this.yaw += yawDelta;

        // Clamp pitch to avoid flipping
        this.pitch = Math.max(this.pitchMin, Math.min(this.pitchMax, this.pitch));

        // Apply pitch and yaw to the camera
        this.camera.rotation.x = this.pitch; // Apply pitch (up/down)
        this.camera.rotation.y = this.yaw;   // Apply yaw (left/right)
    }
}
