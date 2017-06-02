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
  float b = u_beat;
  float a = u_amp;
  float t = u_time;

  // // BEAT
  // b *= 0.1;

  // AMP
  a *= 0.1;

  // // TIME
  // t *= 0.1;

  vec3 cold = vec3(0.,a,1.);
  vec3 hot = vec3(1.0,0.,0.);

	gl_FragColor = vec4(mix(cold, hot, b),1.0);
}
