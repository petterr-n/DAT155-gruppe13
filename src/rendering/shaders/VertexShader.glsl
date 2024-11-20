varying float vHeight;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
    vUv = uv;
    vHeight = position.y;

    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
