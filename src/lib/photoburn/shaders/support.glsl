#include <shared>

varying vec2 vUv;
uniform sampler2D u_texture;
uniform float u_aspect;
uniform float u_image_aspect;

void main() {
    gl_FragColor = getLetterboxTexture(u_texture, vUv, u_aspect, u_image_aspect);
}