// Vertex Shader

// Use the existing uv attribute (don't redefine it)
varying vec2 vUv;  // Using a different name for clarity

void main() {
    // Pass the input texture coordinates (uv) to the fragment shader
    vUv = uv;

    // Convert the position from vec3 to vec4 for proper matrix multiplication
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
