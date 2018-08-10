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

  float spin_speed = 0.1;
  float angle = 0.0;

  float cscale = 0.99;
  float tscale = 0.0413;
  float pscale = 0.065;
  float ascale = 0.51;

  t *= tscale;
  p *= pscale;
  a *= ascale;

  // // TIME SLOW
  // t *= 0.098;
  // spin_speed = 0.1;
  // cscale = 0.5;
  // a *= 0.112;
  // p *= 0.0;


  // ANGLE
  angle = t * spin_speed;
  

  // BEAT
  p *= 0.0;
  

  // // AMP
  // a *= 0.52;

  // // ROTATE BEFORE
  // s = rotate(s, angle);

  // SYM X
  if (s.x < 0.) {
    s.x = abs(s.x);
  }

  // SYM Y
  //if (s.y < 0.) {
  //  s.y = abs(s.y);
  //}

  // ROTATE AFTER
  s = rotate(s, angle);

  vec2 r = s;

  s.y += sin(t) * 3.0;

  if (mod(a*30.0+t,3.0) >= 1.0) {
    s.x *= sin(s.y);
    s.y *= sin(s.x + sin(p));
  } else {
    s.x -= cos(s.y) * sin(p);
    s.y += sin(s.x * 2.);
  }

  // r.x = tan(s.x*2.0);
  // s.y += r.x;

  s.x = sin(s.x*2.0);

  s.y = sin(s.y*3.0);

  // s.x += 4.0;

  if (mod(0.2*t,5.0) >= 3.0) {
    s *= 5.;
    s.y *= sin(s.y+s.x);
  } else {
    s *= 3.;
    s.x *= sin(s.y);
    s.y += 2.3;
  }

  c.b = abs(sin(s.y * 0.2));
  c.g = abs(sin(s.x * 0.2));
  c.r = abs(cos(s.x * o.y * 0.2 + t));

  s *= 2.2;

  // color bars
  float bar = sin(s.x*s.y)*0.99;
  c.r *= bar;
  bar -= cos(s.x-s.y)*.99;
  c.b /= bar;
  c.g += bar;
  c.r += bar;


  // masking
  d = vec3(abs(sin(r.x+t) + cos(r.y-t)));

  // psych
  // d = vec3(sin(r.x+s.y) + tan(r.y-t));

  // TODO: More interesting masks!

  c /= d;

  c = clamp(c,0.0,1.0);

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}


