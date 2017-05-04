uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  float spin_speed = 0.05;
  float angle = u_time * spin_speed;
  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  // zoom out
  uv *= 3.5;
  uv *= rotation;

  float amp = u_beat;
  float time = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  
  bool loud = amp > 0.2;

  // warpings
  uv.x *= sin(uv.y);
  uv.y *= sin(u_beat+uv.x);

  float bt = loud ? uv.x / amp : sin(uv.x+uv.y+time);
  b = sin(bt * 2.0 + time);

  //float gt = uv.y;
  float gt = loud ? uv.y * 3.0 : uv.y * 1.0;
  g = tan(gt * 0.2 + 0.25) + amp;

  float line_size = 1.0;
  //line_size *= 2000.0;
  line_size *= u_beat;

  for( float i = 0.; i < 2.; i++ ){
    // *, +, - all interesting
    b += cos( (gt * i) * 0.5 );
    //g -= cos( (bt * i) );
    // Lined/moire
    b *= cos( (gt * 0.6 * amp * i) * 0.5 * line_size );
    g -= tan( (gt * 0.6 * amp * i) * line_size);
  }

  r = g/b;

  g *= sin(b);
  b += r*(max(g,amp));

  gl_FragColor = vec4( r, g, b, 1.0 );
}

