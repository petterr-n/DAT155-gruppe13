uniform sampler2D grassTexture;
uniform sampler2D rockTexture;
uniform float transitionHeight;

varying float vHeight;
varying vec2 vUv;

void main() {
    float mixFactor = smoothstep(transitionHeight - 2.0, transitionHeight + 0.5, vHeight);

    vec4 grassColor = texture2D(grassTexture, vUv * 10.0);
    vec4 rockColor = texture2D(rockTexture, vUv * 1.0);

    gl_FragColor = mix(grassColor, rockColor, mixFactor);
}