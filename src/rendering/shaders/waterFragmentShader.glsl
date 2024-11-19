// Fragment Shader
uniform sampler2D waterTexture;
uniform float time;
varying vec2 vUv; // Use the same varying variable

void main() {
    // Modify texture coordinates to simulate waves
    vec2 modifiedUV = vUv;
    modifiedUV.x += sin(modifiedUV.y * 10.0 + time) * 0.05;
    modifiedUV.y += cos(modifiedUV.x * 10.0 + time) * 0.05;

    // Sample the texture with modified UVs
    vec4 textureColor = texture2D(waterTexture, modifiedUV);

    // Set the final color of the fragment
    gl_FragColor = textureColor;
}
