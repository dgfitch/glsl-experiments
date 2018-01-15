uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform float u_midi_pitch;
uniform float u_midi_cc_1;
uniform float u_midi_cc_10;
uniform float u_midi_cc_11;
uniform float u_midi_cc_91;
uniform float u_midi_cc_93;
uniform float u_midi_cc_74;
uniform float u_midi_cc_73;
uniform float u_midi_cc_72;
uniform float u_midi_cc_71;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846

float stroke(float x, float s, float w) {
  float d = smoothstep(s, w, x * .75) -
            smoothstep(s, w * .25, x * .75);
  return clamp(d, 0., 1.);
}

float circle(vec2 st) {
  return length(st - .5) * 2.;
}

void main() {
  float adjust_aspect = 0.4;
  vec2 aspect = vec2(1. + adjust_aspect * 2., 1.);
  vec2 shift = vec2(-adjust_aspect,0);
  vec2 uv = gl_FragCoord.xy/u_resolution * aspect + vec2(-0.5,-0.5) + shift;

  float p = u_beat;
  float a = u_amp;
  float t = u_time;
  float pitch = u_midi_pitch;
  float modu = u_midi_cc_1;
  float c1 = u_midi_cc_10;
  float c2 = u_midi_cc_11;
  float c3 = u_midi_cc_91;
  float c4 = u_midi_cc_93;
  float c5 = u_midi_cc_73;
  float c6 = u_midi_cc_72;
  float c7 = u_midi_cc_74;
  float c8 = u_midi_cc_71;

  vec3 color = vec3(0.);

  // OPTION
  uv *= 0.5 + c6;

  // uv += 1.;

  // TIME
  t *= (.2 + c7) * c8;

  // BEAT
  p += c1;
  p *= c2 + .5;

  // AMP
  a = 0.5;
  a += c3;
  a *= c4 + .5;
  
  float angle = t * 0.05;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));
  
  uv *= rotation + a;
  uv += vec2(.5);

  float cs = 2.;

  cs *= a * 1.8;

  // color += stroke(circle(uv), .5, cs);

  // change low end of the loop, lower brighter higher sparser
  for (int i=3; i<=10; i++) {
    vec2 wv = uv;
    float j = float(i);
    // change the divisor of the modulo for different ring effects
    if (mod(j,7.) >= 3.0) {
      wv.x += sin(t*0.2*j)*0.3;
      wv.y += cos(t*0.2*j)*0.3;
      color += stroke(circle(wv), j * .15, cs * 1.2 * p);
    } else {
      wv.x += sin(sin((p+t)*0.001)*2.2*j)*.2;
      wv.y += cos(sin((p+t)*0.001)*2.2*j)*.2;
      wv *= tan(t*0.4);
      color -= stroke(circle(wv), j * .2, cs * .2 * j);
    }
  }

  color.r = clamp(color.r,0.0,1.0);
  color.b = clamp(color.b,0.0,1.0);
  color.g = clamp(color.g,0.0,1.0);

  // suffuse with sky
  color += vec3(sin(uv.x+uv.y+t), cos(uv.y), 1.0);

  color.r *= 0.5;
  color.b *= 1.0;
  color.g *= 0.3;

  color *= modu;

  gl_FragColor = vec4( color, 1.0 );
}
