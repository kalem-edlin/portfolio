// Uses relevant aspect ratios to stretch the texture over the geometry to ensure there is no negative space
// This function is shared between both fragment shaders using THREE.ShaderChunk to ensure alignment of planes when transitioning in the animations
vec4 getLetterboxTexture(in sampler2D textureToLetterbox, in vec2 uv, float u_aspect, float u_image_aspect) {
    float scaleHeight = 1.0;
    float scaleWidth = u_aspect / u_image_aspect * scaleHeight;
    vec2 offset = vec2(0.5 * (1.0 - scaleWidth), 0.5 * (1.0 - scaleHeight));

    vec2 coord = uv * vec2(scaleWidth, scaleHeight) + offset;
    return texture(textureToLetterbox, coord);
}