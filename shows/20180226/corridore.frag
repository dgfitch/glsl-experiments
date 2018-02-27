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

  float spin_speed = 0.33;
  float angle = 0.0;
  
  // TIME
  t *= 0.008;

  t *= 0.028;

  angle = t * spin_speed;

  // BEAT
  p *= 0.0; // tone it down bro
  
  // p *= 0.1;

  // AMP
  a *= 0.0;

  a *= 0.51;

  c = vec3(0.5+a);
  // c += vec3(sin(s.x * s.y));
  // c = vec3(s.x / s.y);


  s = rotate(s, angle);
  vec2 or = rotate(o, angle);

  // BENDS

  // radial bars
  // s.x = atan(abs(or.x),abs(o.y));
  // // s.y = atan(abs(or.y),abs(o.x));

  // radial slide
  // s.x = atan((or.x),(or.y));
  // s.y = or.y;

  // radial strange
  // s.x = atan(abs(s.x),abs(s.y));
  // s.y = abs(cos(s.y)*sin(t));

  // tv
  s.x = cos(abs(s.x)*sin(t));
  s.y = abs(cos(s.y)*sin(t));

  s += vec2(t);

  // ROTATE AFTER?
  // s = rotate(s, angle);



  // COLORS

  // inverted wavebend
  c += vec3(sin(sin(s.x+sin(t)*10.*s.y) / s.y));
  c -= vec3(sin(s.y-(t*2.2)-o.x));

  // spotlight corridors
  // c += vec3(sin(cos(s.x+sin(t)*100.*s.y) / s.y));

  // inverse bars small
  // c *= vec3(sin(sin(s.y+t*s.x) + s.x));

  // inverse bars 2
  c *= vec3(sin(sin(s.y*o.x+(t*.2)*s.x) + s.x));

  // wobble over time
  c *= sin(t) * vec3(sin(sin(s.y*o.x+(t*.2)*s.x) + s.x));

  // whiteness
  // c *= vec3(sin(sin(s.y+o.x+sin(t)) + * s.x * o.y) * 2.0);



  // MASKING
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  // X mask
  d = vec3(abs(o.x - o.y));
  d *= vec3(abs(1.0-o.x - 1.0-o.y)) * 2.;

  // d -= vec3(abs(sin(s.x + s.y)));

  //c -= d;
  c -= d;

  c = clamp(c,0.0,1.0);


  c *= 0.3;

  gl_FragColor = vec4( c, 1.0 );
}


