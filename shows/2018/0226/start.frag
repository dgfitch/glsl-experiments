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
  t *= 0.018;

  angle = t * spin_speed;

  // BEAT
  p *= 0.0; // tone it down bro
  
  // p *= 0.1;

  // AMP
  a *= 0.12;

  a *= 0.51;


  s = rotate(s, angle);

  c = vec3(sin(s.x - s.y));

  s.y = abs(cos(s.x)*sin(t));
  s.x = cos(abs(s.x)*sin(t));

  c += vec3(sin(s.x - s.y));

  c /= vec3(atan(s.x / s.y));


  // masking
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  // X mask
  d = vec3(abs(o.x - o.y));
  d *= vec3(abs(1.0-o.x - 1.0-o.y));

  c -= d;

  c.r = clamp(c.r,0.0,1.0);
  c.b = clamp(c.b,0.0,1.0);
  c.g = clamp(c.g,0.0,1.0);
  
  c = clamp(c,0.0,1.0);

  float cscale = 0.86;

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}


