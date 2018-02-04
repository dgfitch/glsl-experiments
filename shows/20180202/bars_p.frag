uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy + vec2(-0.5,-0.5);
  vec2 orig = uv * 1.1;

  float p = u_beat;
  float a = u_amp;
  float t = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  
  float spin_speed = 0.2;
  float angle = 0.0;
  
  // // TIME
  // t *= 0.082;

  t *= 0.122;

  angle = t * spin_speed;

  // BEAT
  p *= 0.4; // tone it down bro

  // AMP
  a *= 0.0;

  a *= 0.314;

  // uv.x += p * 0.1;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  uv *= rotation;


  // uv.x += sin(t);

  // uv.x *= uv.y * cos(uv.x + sin(t));


  // uv.x = tan(orig.y*2.0);
  // uv.y = tan(orig.x*3.0);

  uv.y *= sin(uv.x + a);

  // uv.x = tan(uv.x*2.0);


  // uv.y += 42.0;

  // uv.y += a;

  // uv *= 10.2 + (p * a);

  uv *= 8.2 * sin(t + a);

  // uv *= 1000.0;

  b = abs(sin(uv.y * 0.2 + t));
  g = abs(sin(uv.x * 0.12 + t));

  uv *= sin(uv.x + uv.y);

  r = abs(sin((uv.x + uv.y) * 0.4)) + 0.4;

  uv.y = sin(uv.y*4.0);
  uv *= 40.2 + (a * 3.0);

  float bar = ceil(sin(uv.x+uv.y+t*8.0)*0.99);
  //bar *= ceil(cos(uv.x-uv.y)*.99);
  b -= bar;
  g -= bar;
  r -= ceil(cos(uv.x-uv.y)*.99);

  r = clamp(r,0.0,1.0);
  b = clamp(b,0.0,1.0);
  g = clamp(g,0.0,1.0);

  float cscale = 0.4;

  r *= cscale;
  g *= cscale;
  b *= cscale;

  gl_FragColor = vec4( r, g, b, 1.0 );
}


