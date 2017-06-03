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
  float angle = t * spin_speed;
  
  // TIME
  angle *= 0.1;

  // BEAT
  p *= 0.05; // tone it down bro

  // // AMP
  a *= 0.03;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  t *= 0.1;
  uv.x *= cos(uv.y + sin(uv.x));
  uv.y *= sin(uv.x + t);
  uv.x += 1.0;
  uv *= 10.2;
  uv *= rotation;
  // uv *= 10.2;
  // uv *= 10.2;
  b = abs(sin(uv.y * 0.2 + t));
  g = abs(sin(uv.x * 0.2 + t));
  // r = g;

  // b *= 0.4;
  // g *= 0.4;
  // b += 0.4;
  // g += 0.3;

  gl_FragColor = vec4( r, g, b, 1.0 );
}


