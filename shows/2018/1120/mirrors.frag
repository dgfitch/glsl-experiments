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

vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

vec2 rotateTilePattern(vec2 _st){
    //  Scale the coordinate system by 2x2
    _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate each cell according to the index
    if(index == 1.0){
        //  Rotate cell 1 by 90 degrees
        _st = rotate2D(_st,M_PI*0.5);
    } else if(index == 2.0){
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st,M_PI*-0.5);
    } else if(index == 3.0){
        //  Rotate cell 3 by 180 degrees
        _st = rotate2D(_st,M_PI);
    }

    return _st;
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
  float tscale = 0.412;
  float pscale = 0.1;
  float ascale = 0.05;

  t *= tscale;
  p *= pscale;
  a *= ascale;

  // TIME SLOW
  t *= 0.6648;
  spin_speed *= 0.4;
  cscale = 0.9;
  a *= 0.012;
  p = 0.;

  // ANGLE
  angle = t * spin_speed;
  
  // BEAT
  p *= 0.0;

  // // AMP
  // a *= 0.0;

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

  // TILES
  // s = rotateTilePattern(s);
  // s = tile(s,2.0);

  // s = tile(s,1.4-a);

  s = rotate2D(s,-M_PI*t*0.045);

  // s = tile(s,2.0);


  // SHUNT BY AMP
  // s /= rotateTilePattern(s*2.);

  s /= rotateTilePattern(s*2.+a*.2);

  s = tile(s,3.3+p);

  // s = rotateTilePattern(s);

  // s = rotateTilePattern(s);


  // // ROTATE AFTER
  // s = rotate(s, angle);

  vec2 r = s;

  c = vec3(0.5);

  // c = vec3(sin(s.x)*cos(s.y));

  c -= vec3(sin(s.x * s.y + a)) * 0.3;

  c -= vec3(tan(r.x) - tan(r.y));

  vec2 or = rotate(o, angle);



  // tv
  // s.x = cos(abs(r.x)*sin(t)+a);
  // s.y = abs(cos(r.y)*sin(t)-a);

  // pulse
  s.x = cos(abs(s.y-s.x)*sin(t)+a);
  s.y = abs(cos(s.x-s.y)*sin(t)+a);

  // siren
  // s.x = atan((s.y-s.x)*sin(t)/p);
  // s.y = atan((s.x-s.y)*sin(t)/p);


  // COLORS

  c.r += (s.y-s.x)/or.x;
  c.b += or.x-or.y;

  // CRAZY
  // c.g /= sin(r.y/r.x+t);


  // MASKING
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  // X mask
  // d = vec3(abs(o.x - o.y));
  // d *= vec3(abs(1.0-o.x - 1.0-o.y));

  d = clamp(d,0.0,1.0);

  // c *= d;

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



