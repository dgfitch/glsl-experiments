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

  float spin_speed = 1.33;
  float angle = 0.0;
  
  float cscale = 0.96;
  float tscale = 0.32;
  float pscale = 0.8;
  float ascale = 0.8;

  t *= tscale;
  p *= pscale;
  a *= ascale;

  // TIME SLOW
  t *= 0.048;
  spin_speed = 0.1;
  cscale = 0.5;
  a *= 0.112;


  // ANGLE
  angle = t * spin_speed;
  

  // BEAT
  p *= 0.0;
  

  // AMP
  a *= 0.12;

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

  vec2 r = s;


  c = vec3(0.5);
  // c += vec3(sin(s.x * s.y));
  // c = vec3(s.x / s.y);

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



  // COLORS

  // inverted wavebend
  // c += vec3(sin(sin(s.x+sin(t)*10.*s.y) / s.y));
  // c.r -= (sin(s.y-(t*2.2)-o.x*a));

  // spotlight corridors
  c += vec3(sin(cos(s.x+sin(t)*100.*s.y) / s.y));

  // inverse bars small
  // c *= vec3(sin(sin(s.y+t*s.x) + s.x));

  // inverse bars 2
  // c *= vec3(sin(sin(s.y*o.x+(t*.2)*s.x) + s.x));

  // wobble over time
  // c /= sin(t) * vec3(sin(sin(s.y*o.x+(t*.2)*s.x) + s.x * a));

  // whiteness
  // c *= vec3(sin(sin(s.y+o.x+sin(t)) + * s.x * o.y) * 2.0);



  // MASKING
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  // X mask
  d = vec3(abs(o.x - o.y));
  d *= vec3(abs(1.0-o.x - 1.0-o.y));

  // c -= d;
  c += d;

  c.r = clamp(c.r,0.0,1.0);
  c.b = clamp(c.b,0.0,1.0);
  c.g = clamp(c.g,0.0,1.0);
  
  c = clamp(c,0.0,1.0);

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}


