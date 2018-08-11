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
  
  float cscale = 1.0;
  float tscale = 0.44512;
  float pscale = 0.01;
  float ascale = 0.2;

  t *= tscale;
  p *= pscale;
  a *= ascale;

  // TIME SLOW
  t *= 0.02648;
  spin_speed = 0.1;
  cscale = 0.9;
  a *= 0.012;
  p = 0.;


  if (mod(1.4*t,11.0) >= 4.0) {
    spin_speed = 0.04;
  } else {
    spin_speed = -0.08;
  }

  // ANGLE
  angle = t * spin_speed;
  

  // BEAT
  p *= 0.0;
  

  // // AMP
  // a *= 0.0;

  // // ROTATE BEFORE
  // s = rotate(s, angle);

  // SYM X
  if (s.x < 0.) {
    s.x = abs(s.x);
  }

  // // SYM Y
  // if (s.y < 0.) {
  //   s.y = abs(s.y);
  // }

  // ROTATE AFTER
  s = rotate(s, angle);

  vec2 r = s;


  // if (mod(1.2*t,5.0) >= 3.0) {
  //   s *= 3. * a;
  // } else {
  //   s *= 2. + p + a;
  // }

  if (mod(0.3*t,5.0) >= 2.0) {
    s += 4. * p + 1.;
  } else {
    s -= 8. * p + 1.;
  }

  s *= 25. + p * .05;

  vec2 or = rotate(o, angle);



  // BENDS

  // radial bars
  // s.x = atan(abs(or.x*a),abs(o.y));
  // s.y = atan(abs(or.y),abs(o.x));

  // radial slide
  // s.x = atan((or.x),(or.y));
  // s.y = or.y+(a*0.14);

  // tv
  // s.x = cos(abs(s.x)*sin(t)+a);
  // s.y = abs(cos(s.y)*sin(t)-a);

  // radial strange
  // s.x = atan(abs(s.x),abs(s.y)) / a;
  // s.y = abs(cos(s.y)*sin(t));

  c = vec3(0.5);

  c = vec3(sin(s.y)*cos(s.x));

  // c.g += vec3(abs(sin(s.x * s.y))) * 0.3;

  // c -= vec3(tan(r.x) - tan(r.y));



  // COLORS

  // corridor widens
  c.b += sin(sin(s.y*r.x)) + sin(s.y+s.x*2.);

  // corridor closes
  c += vec3(sin(sin(r.x+t/s.y))) * .4;
  c.g -= sin(sin(r.x+t/s.y)) * .4;

  // wobble over time
  c /= sin(t) + a;

  // whiteness
  // c.g *= sin(sin(s.y+o.x+sin(t)) + * s.x * o.y) * 2.0;

  // blueish
  c.b = c.g / c.r;



  // MASKING
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  // X mask
  // d = vec3(abs(o.x - o.y));
  // d *= vec3(abs(1.0-o.x - 1.0-o.y));

  // c -= d;
  d = clamp(d,0.0,1.0);
  c -= d * 0.5;

  c.r = clamp(c.r,0.0,1.0);
  c.b = clamp(c.b,0.0,1.0);
  c.g = clamp(c.g,0.0,1.0);
  
  c = clamp(c,0.0,1.0);

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}


