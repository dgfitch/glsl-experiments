uniform float u_amp;
uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846

void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy + vec2(-0.5,-0.5);

  float p = u_beat;
  float a = u_amp;
  float t = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  
  float speed = 0.05;
  float zoom = 0.1;
  float zoom_speed = 4.0;
  float z = 0.20;


  // TIME
  t *= 0.2;

  speed *= t;

  // // BEAT
  // p *= 0.1;

  p *= 0.3; // tone it down bro

  // // stutter beat
  // angle += (1.1 * sin(p));
  // speed *= 0.5;

  // // AMP
  // a *= 0.3;

  float angle = t * 0.05;

  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));
  
  uv *= rotation;

  z = sin(speed) + a * 0.04 + 4.0;
  // zoom += 12.0 + sin(t/zoom_speed) * 10.0 + z;
  zoom += 2.0 + tan(t/zoom_speed) * 10.0 + a;
  
  bool loud = a > 0.6;

  // flicker 2 death
  // loud = false;

  float bt = uv.x * uv.y;

  // bt = sin(uv.x+uv.y);
  bt *= zoom;
  // bt -= loud ? sin(uv.x/uv.y+speed) : sin(uv.x/uv.y-speed);
  b = sin(bt * 2.0 + speed);

  // loudness gate by amplitude
  loud = loud && a > 0.4;

  float gt = uv.x;
  gt *= loud ? 1.0 : b;
  gt -= loud ? tan(uv.y) : cos(uv.y);

  g = b;
  // g *= tan(gt * 0.2 + 0.25) + z;

  for( float i = 0.; i < 5.; i++ ){
    // *, +, -, / all interesting
    g += sin( (gt * zoom * z * i) * zoom_speed );
  }
  

  r += g*bt;
  r *= b+gt;
  r *= z;

  // r += 1.0-sin(b);
  g /= r+z;
  //b += r*g*z;
  b /= g*z * 0.8;

  gl_FragColor = vec4( r, g, b, 1.0 ); // + t;
}
