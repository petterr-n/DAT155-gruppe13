varying float vHeight;
varying vec2 vUv;
varying vec3 vWorldNormal;    // Endret variabelnavn for klarhet
varying vec3 vWorldPosition;  // Hvis du trenger det

void main() {
    vUv = uv;
    vHeight = position.y;

    // Transformerer normalen til verdensrommet
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    // Beregner verdensposisjonen til hvert vertex
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
