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

float fill(float x, float size) {
  return 1. - step(size, x);
}

float rect(vec2 st, vec2 s) {
  st = st*2.-1.;
  return max( abs(st.x/s.x),
              abs(st.y/s.y) );
}

float flip(float v, float pct) {
  return mix(v, 1.-v, pct);
}

float tri(vec2 st) {
  st = (st*2.-1.)*2.;
  return max(abs(st.x) * 0.866025 + st.y * 0.5, -st.y * 0.5);
}

float rhomb(vec2 st) {
  return max(tri(st),
             tri(vec2(st.x,1.-st.y)));
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
  a *= 0.05;

  float angle = t * 0.05;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));
  
  uv *= rotation;
  uv *= 1.0 - a;
  uv += vec2(.5);

  vec2 wv = uv;
  wv.x = sin(wv.x - t);
  wv.y = cos(wv.y - t);

  //wv *= a;

  float cs = 2.;
  cs *= a;

  color += fill(circle(uv), .65);

  // second variable rotates things/offset
  vec2 off = vec2(.1,.0);
  color -= fill(circle(uv-off), .6-a);

  color -= fill(circle(wv), 1.1);
  color += fill(circle(wv), 1.0);

  // // WEIRD RECT
  // float r = rect(uv, vec2(1.2+cs*2.));
  // color += stroke(r, 0.5, .125);
  // color += fill(r, 0.1+p);

  //color += fill(tri(uv), 0.1+abs(sin(t)));

  // color += fill(rhomb(uv), 2.1+abs(sin(t)));

  // HERMIT
  // color += flip(fill(tri(uv), .5),
  //               fill(rhomb(uv), .4));

  color.r = clamp(color.r,0.0,1.0);
  color.b = clamp(color.b,0.0,1.0);
  color.g = clamp(color.g,0.0,1.0);

  color += vec3(1.0+sin(uv.x+t), sin(uv.y+t*.3), sin(wv.x+p+t));

  color *= vec3(sin(wv.x+t*.4), cos(wv.y-p), cos(wv.y+t));

  color.r *= 1.8;
  color.b *= 0.1;
  color.g *= 0.6;

  for (int i=1; i<=5; i++) {
    color.b /= tan(t + float(i) * cos(uv.y * uv.x));
  }

  gl_FragColor = vec4( color, 1.0 );
}
