#ifdef GL_ES
precision mediump float;
#endif

uniform float u_amp;
uniform float u_beat;

void main (void) {
  vec3 cold = vec3(0.,0,1.);
  vec3 hot = vec3(1.,0.,0.);

	gl_FragColor = vec4(mix(cold, hot, u_beat),1.0);
}
