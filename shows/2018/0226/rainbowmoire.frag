uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


vec2 rotate(vec2 _in, float _angle){
    return _in * mat2(cos(M_PI*_angle),-sin(M_PI*_angle),
                      sin(M_PI*_angle),cos(M_PI*_angle));
}

void main() {
  vec2 s = gl_FragCoord.xy/u_resolution.xy + vec2(-0.5);
  vec2 o = s;

  vec3 c = vec3(0.);
  vec3 d = vec3(1.);

  float p = u_beat;
  float a = u_amp;
  float t = u_time;

  float spin_speed = 0.533;
  float angle = 0.0;
  
  // TIME
  t *= 0.08;
  angle = t * spin_speed;

  // // BEAT
  // p *= 0.0; // tone it down bro
  
  p *= 0.1;

  // // AMP
  // a *= 0.12;

  a *= 0.51;


  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  s = rotate(s, angle);

  s.x += 2.0;

  s.x += sin(p*0.15);

  s.x *= s.y * cos(s.x + sin(t*a));


  // s.y *= sin(s.x + p * a);

  // s.x = tan(s.x*2.0+sin(p)*0.05);

  // s.x = tan(s.x*2.0+sin(a)*0.05);

  // s.x = tan(s.y*2.0);
  // s.y = tan(s.x*3.0);

  s.y += 12.0;

  // s.y += 42.0;

  // s.y += a;

  s *= 10.2;

  // s *= 10.2 * sin(t + a);

  s *= 17.0;

  c.b = abs(sin(s.y * 0.2 + t)) + 0.2;
  c.g = abs(sin(s.x * 0.4 + t));
  c.r = abs(cos(s.x * o.y * 0.2 + t));

  // s *= 4.2 + (a * 2.0);

  s.y = abs(cos(s.x)*sin(t));
  s.x = cos(abs(s.x)*sin(t));

  // bar parts out
  float bar = ceil(sin(s.x+s.y)*0.99);

  bar *= ceil(cos(o.x-o.y)*.99);

  c.b -= bar * 0.8;
  c.g -= bar * 0.8;
  c.r -= bar * 0.5;


  // masking
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  // X mask
  d = vec3(abs(o.x - o.y));
  d *= vec3(abs(1.0-o.x - 1.0-o.y));

  // Prism
  vec2 mask = rotate(o, (angle + p + a/3.0));
  d = vec3(abs(sin(mask.x*3.0+cos(t)) / cos(mask.y*3.0+sin(t))));


  c /= d;


  c.r = clamp(c.r,0.0,1.0);
  c.b = clamp(c.b,0.0,1.0);
  c.g = clamp(c.g,0.0,1.0);

  float cscale = 0.86;

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}


