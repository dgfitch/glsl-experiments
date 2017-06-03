uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy + vec2(-0.5,-0.5);

  float p = u_beat;
  float a = u_amp;
  float t = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  
  float spin_speed = 0.5;
  float angle = 0.0;
  
  // TIME
  t *= 0.030;
  angle = spin_speed * 4.2 * t;

  // // BEAT
  // p *= 0.02; // tone it down bro

  p *= 0.2; // tone it down bro

  // // AMP
  // a *= 0.2;

  p = 0.0;
  angle *= 0.1;
  a = 0.0;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  uv *= rotation;
  uv.x *= cos(uv.x + sin(uv.y));
  uv.y *= tan(uv.x + p);
  // uv.x += -1.0;
  uv.x += -2.0;
  // uv.x += -4.0;
  uv *= 4.2;

  // uv *= 10.2;
  // uv *= 10.2;
  // uv *= 8.2 + a;
  uv *= 10.2 * sin(t + a);
  //uv *= 1000.0;

  b = abs(sin(uv.y * 0.3 + t));
  g = abs(tan(uv.x * 0.2 + t));
  r = abs(sin(b + a * p));

  // b *= a;
  r *= p;

  r += 0.5;
  // b += 0.3;
  g *= 0.4;

  r = clamp(r,0.0,1.0);
  b = clamp(b,0.0,1.0);
  g = clamp(g,0.0,1.0);

  r *= 0.6;
  b *= 0.2;
  g *= 0.3;

  // r *= 2.0;
  // g *= 1.5;
  // b *= 1.5;

  gl_FragColor = vec4( r, g, b, 1.0 );
}



