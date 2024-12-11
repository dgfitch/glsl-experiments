#ifdef GL_ES
precision mediump float;
#endif

uniform float u_beat;
uniform float u_time;

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

uniform sampler2D   u_buffer0; 
uniform sampler2D   u_buffer1; 

uniform vec2        u_resolution;

#include "../lygia/draw/stroke.glsl"
#include "../lygia/math/decimate.glsl"

void main() {
    float p = u_beat;
    float t = u_time;

    vec3 color = vec3(0.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

    float amp = texture2D(u_tex0, vec2(st.x, 0.5) ).y;
    color += stroke(st.y, pixel.x + sin(p)*0.1 + 0.5, amp);


    gl_FragColor = vec4(color,1.0);
}
