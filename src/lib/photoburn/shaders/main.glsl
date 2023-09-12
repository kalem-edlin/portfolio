// Author:
// Title: screen-space tiling of perlin noise. Efficient rendering practice by separating
// fragments in to quadrants using gridUv and gridId!!

#ifdef GL_ES
precision mediump float;
#endif

#include <shared>

const int MAX_MOUSE_DATA = 1000;

uniform float u_mouse_data[MAX_MOUSE_DATA];
uniform int u_num_mouse_data;
uniform float u_time;
varying vec2 vUv;
uniform float u_aspect;
uniform float u_image_aspect;
uniform sampler2D u_texture;
uniform bool u_first;
uniform float u_random;

// Perlin Noise Parameters
const float density = 5.;
const float speed = 3.;

vec2 randomGradient(vec2 p) {
    p = p + 0.1;
    float x = dot(p, vec2(123.4, 234.5));
    float y = dot(p, vec2(234.5, 345.6));
    vec2 gradient = vec2(x, y);
    gradient = sin(gradient);
    gradient = gradient * 1000. * (1. + u_random);
    gradient = sin(gradient + u_time * speed);
    return gradient;
}

vec2 smoothInter(vec2 x){
    return 6.*x*x*x*x*x -15.*x*x*x*x + 10.*x*x*x;
}

float perlinNoise(in vec2 uv) {

    vec2 gridId = floor(uv);
    vec2 gridUv = fract(uv);

    vec2 bl = gridId + vec2(0., 0.);
    vec2 br = gridId + vec2(1., 0.);
    vec2 tl = gridId + vec2(0., 1.);
    vec2 tr = gridId + vec2(1., 1.);
    
    
    vec2 gradientBl = randomGradient(bl);
    vec2 gradientBr = randomGradient(br);
    vec2 gradientTl = randomGradient(tl);
    vec2 gradientTr = randomGradient(tr);

    vec2 distFromCurrentToBl = gridUv - vec2(0., 0.);
    vec2 distFromCurrentToBr = gridUv - vec2(1., 0.);
    vec2 distFromCurrentToTl = gridUv - vec2(0., 1.);
    vec2 distFromCurrentToTr = gridUv - vec2(1., 1.);

    float dotBl = dot(gradientBl, distFromCurrentToBl);
    float dotBr = dot(gradientBr, distFromCurrentToBr);
    float dotTl = dot(gradientTl, distFromCurrentToTl);
    float dotTr = dot(gradientTr, distFromCurrentToTr);

    gridUv = smoothInter(gridUv);

    float b = mix(dotBl, dotBr, gridUv.x);
    float t = mix(dotTl, dotTr, gridUv.x);
    float noiseValue = mix(b, t, gridUv.y);

    return noiseValue;
}

// Making use of ridged noise to interpolate the pixel's transparency
// maxRadius is weighted so that for the screen size, progress 1 will 
float growShape(vec2 point, vec2 vUv, float progress, float noise) {
    if (progress == 0.0) {
        return 0.0;
    }
    float distanceToPoint = length(point - vUv) * noise * 1.3;
    float maxRadius = progress * 1.1;
    float interpolation = smoothstep(maxRadius - 0.05, maxRadius + 0.05, distanceToPoint);
    float value = mix(1.0, 0.0, interpolation);
    return value;
}

// Big ugly function to process non-dynamic mouse positions
// Should investigate performance impacts
float getAllGrowingShapes(in float progress, in float noise) {
    float value = 0.0;
    for (int i = 0; i < u_num_mouse_data; i++) {
        vec3 mouseData = vec3(u_mouse_data[i * 3], u_mouse_data[i * 3 + 1], u_mouse_data[i * 3 + 2]);
        if (i == 0) {
            // For initial mouse point, adjust weighting to last until it reaches edges based on its distance to center
            float distanceToCenter = length(mouseData.xy - vec2(0.5, 0.5));
            value += growShape(mouseData.xy, vUv, progress * (1. + distanceToCenter), noise);
        }
        else {
            // Added during animation, so adjust its progress based on progress-time added
            value += growShape(mouseData.xy, vUv, progress - mouseData.z, noise); 
        }
    }
    return value;
}

void main() {
    vec2 uv = vUv;
    float progress = u_time;
    
    if (u_aspect < 1.) {
        uv *= vec2(density, floor(density / u_aspect));
    }
    else {
        uv *= vec2(floor(density * u_aspect), density);
    }

    float noise = perlinNoise(uv * 1.) * 3.;
    noise += perlinNoise(uv * 2.) * 0.5;
    noise += perlinNoise(uv * 4.) * 0.25;
    noise += perlinNoise(uv * 8.) * 0.125;
    noise += perlinNoise(uv * 16.) * 0.0625;
    noise /= 12.;
    
    float ridgedNoise = 1.0 - abs(noise);
    ridgedNoise = ridgedNoise * ridgedNoise;
    noise = ridgedNoise;

    noise *= getAllGrowingShapes(progress, noise);

    // Smoothly interpolate between foreground and background based on the noise value
    vec3 color = getLetterboxTexture(u_texture, vUv, u_aspect, u_image_aspect).rgb;

    vec3 colorfulGradient = vec3(vUv.x/5., vUv.y/5., abs(sin(u_time*100.0)));

    // Apply a colorful glowing effect to the edges of the noise mask 
    if (noise >= 0.3 && noise <= 0.5) {
        float intensity = smoothstep(0.2, 0.7, noise); // Smoothly transition the intensity
        
        color += mix(colorfulGradient, vec3(1.0, 1.0, 1.0), intensity) * (noise - 0.25) * 9.0; // Increase intensity
    }
    float transparency = smoothstep(0.4, 0.6, noise);

    // Apply texture either in the background on first load or foreground
    gl_FragColor = vec4(color, u_first ? transparency : 1.0 - transparency);
}

