#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_backbuffer;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_amp;
uniform float u_beat;

void main (void) {
  float amp = u_amp;
  float beat = u_beat;
  vec3 cold = vec3(0.,0.,beat);
  vec3 hot = vec3(beat,0.,0.);

	gl_FragColor = vec4(mix(cold, hot, amp),1.0);
}

