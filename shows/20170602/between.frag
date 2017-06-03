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
  
  float spin_speed = 0.3;
  float angle = 0.0;
  
  // TIME
  t *= 0.1;
  angle = t * spin_speed;

  // BEAT
  p *= 0.4; // tone it down bro

  // // AMP
  a *= 0.1;

  // a = 0.0;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  uv *= rotation;
  // uv.x += sin(p);
  uv.x *= uv.y * cos(uv.x + sin(t));
  uv.y *= sin(uv.x + p * a);
  // uv.x += -4.0;
  uv.y += 42.0;
  uv.y += a;
  uv *= 10.2;

  uv *= 10.2 + (p * a);
  // uv *= 10.2 * sin(t + a);
  // uv *= a;
  // uv *= 1000.0;

  b = abs(sin(uv.y * 0.2 + t));
  g = abs(sin(uv.x * 0.2 + t));
  // r = g + a;

  b += a;
  r *= a;

  // b *= 0.4;
  // r *= 0.4;
  r += 0.4;


  gl_FragColor = vec4( r, g, b, 1.0 );
}


