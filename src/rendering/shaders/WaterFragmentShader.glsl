uniform sampler2D waterTexture;
uniform float time;
varying vec2 vUv;

void main() {
    vec2 modifiedUV = vUv;
    modifiedUV.x += sin(modifiedUV.y * 10.0 + time) * 0.05;
    modifiedUV.y += cos(modifiedUV.x * 10.0 + time) * 0.05;

    vec4 textureColor = texture2D(waterTexture, modifiedUV);

    gl_FragColor = textureColor;
}
