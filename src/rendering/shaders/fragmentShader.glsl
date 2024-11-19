uniform sampler2D sandTexture;
uniform sampler2D jungleTexture;
uniform float transitionHeight;
uniform vec3 lightDirection; // Lysretningen i verdensrommet (må være normalisert)
uniform vec3 lightColor;
uniform vec3 ambientColor;

varying float vHeight;
varying vec2 vUv;
varying vec3 vWorldNormal;   // Bruker verdensnormalen

void main() {
    // Teksturblanding basert på høyde
    float mixFactor = smoothstep(transitionHeight - 2.0, transitionHeight + 0.5, vHeight);
    vec4 sandColor = texture2D(sandTexture, vUv * 10.0);
    vec4 jungleColor = texture2D(jungleTexture, vUv * 5.0);
    vec4 baseColor = mix(sandColor, jungleColor, mixFactor);

    // Normaliser normalen
    vec3 normal = normalize(vWorldNormal);

    // Lysberegninger
    float diff = max(dot(normal, lightDirection), 0.0);
    vec3 diffuse = diff * lightColor;

    // Ambient lys
    vec3 ambient = ambientColor;

    // Kombinerer lys med basefarge
    vec3 finalColor = baseColor.rgb * (diffuse + ambient);

    gl_FragColor = vec4(finalColor, baseColor.a);
}
