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
  t *= 0.1;
  angle *= 0.01;

  // // // BEAT
  // p *= 0.1;

  p *= 0.5; // tone it down bro

  // // stutter beat
  // angle += (1.1 * sin(p));

  // // AMP
  // a *= 0.1;

  //a *= 0.2;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  uv *= 3.5; // zoom out

  uv *= a * 0.2 + 1.0; // zoom by amp

  uv += 4.0; // decenter

  // // bounce zoom
  // uv *= -1.5 + (p * 2.0);

  uv *= rotation;

  // warpings

  // uv.x += tan(uv.x);
  uv.x *= cos(uv.y);
  // uv.x = clamp(uv.x,0.0,1.0);
  uv.y *= sin(p+uv.x);
  uv.y += sin(t+uv.x);

  b = abs(sin(uv.y * 0.5 + t));

  g = tan(uv.y * 0.2 + 0.25);
  // flicker
  // g += sin(t*a);

  r = abs(sin(uv.y*p)*cos(b));

  g += sin(b);
  b += r*(max(g,a));
  r += a;

  r = clamp(r,0.0,1.0);
  b = clamp(b,0.0,1.0);
  g = clamp(g,0.0,1.0);

  r *= 0.6;
  b *= 0.6;
  g *= 0.6;


  gl_FragColor = vec4( r, g, b, 1.0 );
}

