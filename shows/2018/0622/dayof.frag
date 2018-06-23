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

  float spin_speed = .02;
  float angle = 0.0;
  
  float cscale = 0.9;
  float tscale = 0.612;
  float pscale = 0.1;
  float ascale = 0.2;

  t *= tscale;
  p *= pscale;
  a *= ascale;

  // // TIME SLOW
  t *= 0.2648;
  spin_speed *= 0.1;
  cscale = 0.7;
  a *= 0.012;
  p = 0.;

  // ANGLE
  angle = t * spin_speed;
  
  // // // BEAT
  // // p *= 0.0;
  
  // // AMP
  // a *= 0.22;

  vec2 r = s;


  // ROTATE BEFORE
  s = rotate(s, angle);

  // // SYM X
  // if (s.x < 0.) {
  //   s.x = abs(s.x);
  // }

  // // SYM Y
  // if (s.y < 0.) {
  //   s.y = abs(s.y);
  // }

  // ROTATE AFTER
  s = rotate(s, angle);


  s *= 44. - (p * 10.);

  s += a;

  c = vec3(0.5);

  c *= vec3(sin(s.x)*cos(s.y));

  c += vec3(sin(s.y + a * or.y)) * 0.3;

  c.r += vec3(tan(sin(s.x + r.y * s.y + t * 0.1) + t * 0.1 + p)) * 0.2 * a;



  // c /= vec3(tan(s.x) - tan(r.y));

  vec2 or = rotate(o, angle);



  // BENDS

  // tv
  s.x = cos(abs(s.x)*sin(t)+a);
  s.y = abs(cos(s.y)*sin(t)-a);


  // COLORS

  c.g += s.y-s.x;
  c.r += or.x-or.y;
  // c.b += sin(s.y/s.x+t);


  // MASKING
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  // X mask
  // d = vec3(abs(o.x - o.y));
  // d *= vec3(abs(1.0-o.x - 1.0-o.y));

  d = clamp(d,0.0,1.0);

  // c -= d;

  // c /= d * 0.5;

  // blue override
  // c.b = c.r / c.g;

  c.r = clamp(c.r,0.0,1.0);
  c.b = clamp(c.b,0.0,1.0);
  c.g = clamp(c.g,0.0,1.0);
  
  c = clamp(c,0.0,1.0);

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}



