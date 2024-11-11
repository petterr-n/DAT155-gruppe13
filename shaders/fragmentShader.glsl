// terrainFragmentShader.glsl
uniform sampler2D grassTexture;
uniform sampler2D rockTexture;
uniform float transitionHeight;

varying float vHeight;
varying vec2 vUv;

void main() {
    float mixFactor = smoothstep(transitionHeight - 2.0, transitionHeight + 0.5, vHeight);

    vec4 grassColor = texture2D(grassTexture, vUv);
    vec4 rockColor = texture2D(rockTexture, vUv);

    gl_FragColor = mix(grassColor, rockColor, mixFactor);
}
