#ifdef GL_ES
precision mediump float;
#endif

uniform float u_amp;
uniform float u_beat;

void main (void) {
  float amp_min = 0.;
  float amp_max = 14.;
  float amp = (u_amp-amp_min)/(amp_max-amp_min);

  vec3 cold = vec3(0.,u_beat,1.);
  vec3 hot = vec3(1.,0.,0.);

	gl_FragColor = vec4(mix(cold, hot, amp),1.0);
}
