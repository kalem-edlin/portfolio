// Uses relevant aspect ratios to stretch the texture over the geometry to ensure there is no negative space
// This function is shared between both fragment shaders using THREE.ShaderChunk to ensure alignment of planes when transitioning in the animations
vec4 getLetterboxTexture(in sampler2D textureToLetterbox, in vec2 uv, float u_aspect, float u_image_aspect) {
    vec2 scaleVector = vec2((u_aspect / u_image_aspect), 1.);
    float zoom = pow(-0.4 * pow(exp(1.0), (u_aspect - u_image_aspect)), 3.) + 1.;
    scaleVector *= zoom;

    vec2 offset = vec2(0.5 * (1.0 - scaleVector.x), 0.5 * (1.0 - scaleVector.y));

    vec2 coord = uv * scaleVector + offset;
    return texture(textureToLetterbox, coord);
}