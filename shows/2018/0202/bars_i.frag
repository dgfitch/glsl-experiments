uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy + vec2(-0.5,-0.5);
  vec2 orig = uv;

  float p = u_beat;
  float a = u_amp;
  float t = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  
  float spin_speed = 0.533;
  float angle = 0.0;
  
  // TIME
  t *= 0.00008;
  angle = t * spin_speed;

  // // BEAT
  p *= 0.0; // tone it down bro
  
  p *= 0.1;

  // AMP
  a *= 0.12;

  a *= 0.11;


  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  uv *= rotation;

  uv.x += 2.0;

  uv.x += sin(p*0.15);

  uv.x *= uv.y * cos(uv.x + sin(t));


  // uv.y *= sin(uv.x + p * a);

  // uv.x = tan(uv.x*2.0+sin(p)*0.05);

  // uv.x = tan(uv.x*2.0+sin(a)*0.05);

  // uv.x = tan(uv.y*2.0);
  // uv.y = tan(uv.x*3.0);

  uv.y += 12.0;

  // uv.y += 42.0;

  // uv.y += a;

  uv *= 10.2;

  // uv *= 10.2 * sin(t + a);

  uv *= 17.0;

  b = abs(sin(uv.y * 0.2 + t)) + 0.2;

  g = abs(sin(uv.x * 0.4 + t));

  r = abs(cos(uv.x * orig.y * 0.2 + t));

  uv *= 4.2 + (a * 2.0);

  uv.y = abs(cos(uv.x)*sin(t));
  uv.x = cos(abs(uv.x)*sin(t));

  float bar = ceil(sin(uv.x+uv.y)*0.99);

  bar *= ceil(cos(orig.x-orig.y)*.99);

  b -= bar * 0.8;
  g -= bar * 0.8;
  r -= bar * 0.5;

  r = clamp(r,0.0,1.0);
  b = clamp(b,0.0,1.0);
  g = clamp(g,0.0,1.0);

  float cscale = 0.36;

  r *= cscale;
  g *= cscale;
  b *= cscale;

  gl_FragColor = vec4( r, g, b, 1.0 );
}


