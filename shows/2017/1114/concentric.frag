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

float sstroke(float x, float s, float w) {
  float d = smoothstep(s+.2, w, x * .25) -
            smoothstep(s-.2, w*-1., x * .25);
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
  t *= 0.0113;

  // BEAT
  p *= 0.0;

  p *= 0.4;

  // AMP
  a *= 0.001;

  a *= 0.1;

  float angle = t * 0.5;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));
  
  uv *= vec2(4.05);
  uv *= rotation;
  uv += vec2(sin(t), 0.);
  uv += vec2(2.5);

  vec2 wv = uv;
  wv.x = sin(wv.x + wv.y);
  wv.y = sin(wv.x - wv.y);

  // color += step(.5, uv.x);
  // color += step(.5, 1.-uv.x);

  float cs = 1.;

  cs *= a + 0.1;

  // cs = 0.2;

  color.b += stroke(uv.x, .5, cs * 2.5);
  color.b += stroke(uv.y, .5, cs * 2.5);

  /* color.g += stroke(circle(uv), .5 + abs(sin(t)) * .2 * p, cs); */

  for (int i=1; i<=35; i++) {
    float j = float(i);
    if (mod(t*20,j) >= j/2.+a) {
      if (mod(t*40,j) >= j/2.) {
        a = a * 2.0;
      }
      color.r += stroke(circle(uv), (j * j + abs(sin(t))) * .008, cs * j * 0.05 + abs(sin(t))*a);
    }
  }

  color.r = clamp(color.r,0.0,1.0);
  color.b = clamp(color.b,0.0,1.0);
  color.g = clamp(color.g,0.0,1.0);

  color += vec3(sin(uv.x+t), cos(uv.y), 1.0);

  color *= vec3(sin(wv.x+t/2.), cos(wv.y*wv.x - p), 1.0);

  color /= vec3(sin(wv.y+wv.x), cos(uv.y*uv.x - t), 1.0);

  color.r *= 0.8;
  color.b *= 0.2;
  color.g *= 0.5;

  color *= 0.7;

  gl_FragColor = vec4( color, 1.0 );
}
