uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


void main() {
  float adjust_aspect = 0.4;
  vec2 aspect = vec2(1. + adjust_aspect * 2., 1.);
  vec2 shift = vec2(-adjust_aspect,0);
  vec2 uv = gl_FragCoord.xy/u_resolution * aspect + vec2(-0.5,-0.5) + shift;

  float p = u_beat;
  float a = u_amp;
  float t = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  
  float spin_speed = 0.24;
  float angle = 0.0;
  
  // TIME
  t *= 0.13;
  angle = t * spin_speed;

  // // BEAT
  // p *= 0.00; // tone it down bro
  
  // p *= 0.15;

  // AMP
  a = 0.0;

  a *= 0.40;


  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  uv *= rotation;
  uv.x += sin(p);
  uv.x *= uv.y * cos(uv.x + sin(t));
  uv.y *= sin(uv.x + p * a);
  // uv.x += -4.0;
  // uv.y += 42.0;
  uv.y += a;
  uv.y += p;
  uv *= 4.2;

  uv *= 10.2 + (p * a);
  uv *= 10.2 * sin(t + a);
  // uv /= a;
  // uv *= 1000.0;

  b = abs(sin(uv.y * 0.2 + t));
  g = abs(sin(uv.x * 0.2 + t));
  // r = g + a;

  b += a;
  r *= a;

  g *= 0.8;
  b *= 0.5;
  // r += 0.3;
  r *= 1.5;


  gl_FragColor = vec4( r, g, b, 1.0 );
}


