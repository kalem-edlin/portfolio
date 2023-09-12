
varying vec3 vPosition;
varying vec2 vUv;

// Resuable Vertex Shader - I do not need intense logic as this is mostly a face manipulation system
void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}