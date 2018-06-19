uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846

float stroke(float x, float s, float w) {
  float d = step(s, x + w * .5) -
            step(s, x - w * .5);
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

  vec3 color = vec3(0.);

  // TIME
  t *= 0.2;

  // BEAT
  p *= 0.1;

  // AMP
  a *= 0.001;

  a *= 0.1;

  float angle = t * 0.05;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));
  
  uv *= rotation;
  uv += vec2(.5);

  vec2 wv = uv;
  wv.x = sin(wv.x + wv.y);
  wv.y = sin(wv.x - wv.y);

  // color += step(.5, uv.x);
  // color += step(.5, 1.-uv.x);

  float cs = 1.;

  cs *= a + 0.1;

  // cs = 0.2;

  color += stroke(uv.x, .5, cs * .5);
  // color += stroke(uv.y, .5, cs * .5);

  color += stroke(circle(uv), .5 + abs(sin(t)) * .2, cs);

  for (int i=4; i<=8; i++) {
    color += stroke(circle(uv), (float(i) + abs(sin(t))) * .2, cs * .1);
  }

  color.r = clamp(color.r,0.0,1.0);
  color.b = clamp(color.b,0.0,1.0);
  color.g = clamp(color.g,0.0,1.0);

  // color += vec3(sin(uv.x+t), cos(uv.y), 1.0);
  // color *= vec3(sin(wv.x+t/2.), cos(wv.y*wv.x - a), 1.0);
  // color /= vec3(sin(wv.y+wv.x), cos(uv.y*uv.x - t), 1.0);

  color.r *= 0.8;
  color.b *= 0.2;
  color.g *= 0.5;

  gl_FragColor = vec4( color, 1.0 );
}
