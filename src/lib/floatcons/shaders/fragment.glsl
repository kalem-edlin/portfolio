uniform sampler2D u_texture;
varying vec2 vUv;

// Use of Signed Distance Rounded Box to make larger radius corners that are clean of any noise from transparency-on
float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r ) {
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

void main() {
    vec3 textureColor = texture(u_texture, vUv).rgb;
    
    // Centered focus
    vec2 p = (2.0*vUv-vec2(1.))/vec2(1.).y;

    vec3 color = vec3(0.);
    float value = sdRoundedBox(p, vec2(1.), vec4(0.55));
    if (value < 0.) {
        color = vec3(1.);
    }

    gl_FragColor = vec4(textureColor, color);
}
