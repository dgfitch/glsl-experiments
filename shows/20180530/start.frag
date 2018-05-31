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

  float spin_speed = 0.01;
  float angle = 0.0;

  float cscale = 0.6;
  float tscale = 1.512;
  float pscale = 0.4;
  float ascale = 0.9;

  t *= tscale;
  p *= pscale;
  a *= ascale;
  
  // ANGLE
  angle = t * spin_speed;

  // TIME SLOW
  t *= 0.128;
  spin_speed = 0.1;
  cscale = 0.4;
  a *= 0.082;
  p = 0.;

  // BEAT
  p *= 0.0; // tone it down bro
  
  p *= 0.1;

  // AMP
  a *= 0.12;

  a *= 0.021;

  // // test amplitude
  // angle *= a;


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

  r *= 3.0+p;
  s *= 8.0;

  s.y = sin(t+s.y);
  s.x = cos(t+s.x);

  r.y = sin(t+s.y);
  // r.x = cos(t+s.x);

  c.b = s.x + s.y;

  c.r = (sin(s.x - s.y));
  c.g = (sin(r.x - r.y));

  // c *= vec3(sin(s.x - s.y));

  // // inverted bars
  c += vec3(atan(s.x / s.y));


  // masking
  d = vec3(abs(sin(r.x+t) + cos(r.y+a)));

  // X mask
  d = vec3(abs(r.x - r.y));
  // d *= vec3(abs(1.0-r.x - 1.0-r.y));

  c *= d;

  // c += d;

  // c /= d;

  c.r = clamp(c.r,0.0,1.0);
  c.b = clamp(c.b,0.0,1.0);
  c.g = clamp(c.g,0.0,1.0);
  
  c = clamp(c,0.0,1.0);

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}


