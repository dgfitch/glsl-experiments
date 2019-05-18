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

vec2 random2( vec2 p ) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
  vec2 s = gl_FragCoord.xy/u_resolution.xy + vec2(-0.5);
  vec2 o = s;

  vec3 c = vec3(0.);
  vec3 d = vec3(1.);

  float p = u_beat;
  float a = u_amp;
  float t = u_time;

  float spin_speed = 0.10;
  float angle = 0.0;
  
  float cscale = 1.0;
  float tscale = 0.252;
  float pscale = 0.3;
  float ascale = 0.2;

  t *= tscale;
  p *= pscale;
  a *= ascale;

  // TIME SLOW
  t *= 0.2648;
  spin_speed *= 0.2;
  cscale = 0.7;
  a *= 0.05;
  p = 0.;

  // ANGLE
  angle = t * spin_speed;
  
  // BEAT
  p *= 0.1;

  // // AMP
  // a *= 0.04;

  // ROTATE BEFORE
  s = rotate(s, angle);

  // // SYM X
  // if (s.x < 0.) {
  //   s.x = abs(s.x);
  // }

  // SYM Y
  if (s.y < 0.) {
    s.y = abs(s.y);
  }
  
  s.y = s.y * -1.5;



  // SIMPLE TILE
  // s = rotateTilePattern(s+a*.5);




  // // ROTATE AFTER
  s = rotate(s, angle);

  // s = tile(s,3.0);

  // s += p*0.2;

  // s.x *= p*.1;

  // s *= 2.0;

  vec2 r = s;

  // pulse
  // s.x = cos(abs(s.y-s.x)*sin(t)+p);
  // s.y = abs(cos(s.x-s.y)*sin(t)+p);

  // // zebra
  s.x /= atan((s.x-s.y)*(sin(t*3.)+2.));
  s.y /= cos((s.y-s.x)*(sin(t*2.)+2.));

  s.x += atan((s.x-s.y)*(sin(t*3.)+2.));
  s.y += cos((s.y-s.x)*(sin(t*2.)+2.));

  // tv
  // s.x /= cos(abs(r.x)*sin(t)+a*.01);
  // s.y /= abs(cos(r.y)*sin(t)-a*.01);


  s = tile(s,3.0);

  // s.x = -s.x;

  s = rotateTilePattern(s);

  // s = rotateTilePattern(s);

  c = vec3(0.0);

	// Cell positions
	vec2 point[5];
	point[0] = vec2(-0.4,-0.4);
	point[1] = vec2(-0.4,0.4);
	point[2] = vec2(0.4,0.4);
	point[3] = vec2(0.4,-0.4);
	point[4] = vec2(sin(t)*.5,cos(t)*.5)*.4+a*.2;


	float m_dist = 1.; 

	for (int i = 0; i < 4; i++) {
    point[i] += tan(t*(2.1+float(i))) * .1;
    point[i] -= cos(t*(2.1+float(i))) * .1;
  }

	for (int i = 0; i < 5; i++) {
    float dist = distance(s, point[i]);

    m_dist = min(m_dist, dist);
	}

	c += m_dist;

  if (mod(t*0.5, 13.) > 4.) {
    c -= step(.6+p,abs(sin(40.0*m_dist)))*.4*a;
  } else {
    c -= step(.6+p,abs(sin(40.0*m_dist)))*.7*a;
  }

  vec2 or = rotate(o, angle);


  // CUTOUT
  c += vec3(tan(r.x) - tan(r.y));


  // COLORS

  // c.g /= sin(s.y+p);

  c.b += or.x-or.y;


  c.r /= (cos(t)/sin(c.r))*p;

  c.b /= tan(sin(t)+p);

  // MASKING
  d = vec3(abs(sin(o.x+t) + cos(o.y+a)));

  d = clamp(d,0.0,1.0);

  // c *= d;
  //
  // c -= d * 0.5;

  // red-pink override
  // c.r = c.g + sin(c.b);

  // c.g = c.b - c.r;

  c.r = clamp(c.r,0.0,1.0);
  c.b = clamp(c.b,0.0,1.0);
  c.g = clamp(c.g,0.0,1.0);
  
  c = clamp(c,0.0,1.0);

  c *= cscale;

  gl_FragColor = vec4( c, 1.0 );
}



