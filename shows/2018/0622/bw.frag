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

  float spin_speed = .03;
  float angle = 0.0;
  
  float cscale = 0.9;
  float tscale = 1.212;
  float pscale = 0.2;
  float ascale = 0.9;

  t *= tscale;
  p *= pscale;
  a *= ascale;

  // // // TIME SLOW
  // t *= 0.1648;
  // spin_speed = 0.1;
  // cscale = 0.4;
  // a *= 0.012;
  // p = 0.;

  // ANGLE
  angle = t * spin_speed;
  
  // // BEAT
  // p *= 0.0;
  
  // // AMP
  // a *= 0.42;

  // // ROTATE BEFORE
  // s = rotate(s, angle);

  // // SYM X
  // if (s.x < 0.) {
  //   s.x = abs(s.x);
  // }

  // // SYM Y
  // if (s.y < 0.) {
  //   s.y = abs(s.y);
  // }

  // // ROTATE AFTER
  // s = rotate(s, angle);

  vec2 r = s;

  vec2 or = rotate(o, angle);

  // BEND SPACE

  s *= 20.;

  // bend to the beat
  float bend = (p + a) * 15.;
  s.x -= cos(abs(s.y*sin(p)*bend));
  s.y -= abs(cos(s.x*cos(p)*bend));

  // wander afield
  // s += t + sin(p) * 20.;


  // COLORS

  c = vec3(max(sin(s.x+p)*cos(s.y)+tan(p),sin(r.y)*cos(r.x)+tan(p*2.)));

  c *= sin(s.x);

  // c += vec3(sin(s.x * s.y)) * 0.3;

  // c -= vec3(tan(r.x) - tan(r.y));


  // MASKING
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  // X mask
  // d = vec3(abs(o.x - o.y));
  // d *= vec3(abs(1.0-o.x - 1.0-o.y));

  d = clamp(d,0.0,1.0);

  c += d;

  // c -= d * 0.5;

  // blue override
  // c.b = c.r / c.g;

  c.r = clamp(c.r,0.0,1.0);
  c.b = clamp(c.b,0.0,1.0);
  c.g = clamp(c.g,0.0,1.0);
  
  c = clamp(c,0.0,1.0);

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}


