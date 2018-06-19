uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846

void main() {
  float adjust_aspect = 0.4;
  vec2 aspect = vec2(1. + adjust_aspect * 2., 1.);
  vec2 shift = vec2(-adjust_aspect,0);
  vec2 uv = gl_FragCoord.xy/u_resolution * aspect + vec2(-0.5,-0.5) + shift;

  float p = u_beat;
  float a = u_amp;
  float t = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  

  // TIME
  t *= 0.2;

  // BEAT
  p *= 0.1;

  // AMP
  a *= 0.3;

  float angle = t * 0.05;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));
  
  // uv += sin(t);

  uv *= rotation;

  float bt = uv.x - uv.y + a;

  bt = sin(uv.x+uv.y);

  bt -= sin(uv.x/uv.y+t);
  b = sin(bt * 2.0 + t);

  float gt = uv.x;
  gt *= b;
  gt -= tan(uv.y);

  g = b + gt;
  // g *= tan(gt * 0.2 + 0.25) + a;

  for( float i = 0.; i < 5.; i++ ){
    // *, +, -, / all interesting
    g += sin( (gt * i) / t );
  }
  

  r += g*bt;
  r *= b+gt;

  r = clamp(r,0.0,1.0);
  b = clamp(b,0.0,1.0);
  g = clamp(g,0.0,1.0);

  r *= 0.8;
  b *= 0.1;
  g *= 0.4;

  gl_FragColor = vec4( r, g, b, 1.0 );
}
