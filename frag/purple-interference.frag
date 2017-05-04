uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  float amp = u_beat;
  float time = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  
  bool loud = amp > 0.2;

  // warpings
  //uv.x *= sin(uv.y);
  //uv.y *= sin(u_beat+uv.x);
  //uv.x += 1.0;
  //uv.y += 1.0;

  float bt = loud ? uv.x / amp : sin(uv.x+uv.y+time);
  b = sin(bt * 2.0 + time);

  //float gt = uv.y;
  loud = amp > 0.5;
  float gt = loud ? uv.y * 3.0 : uv.y * 1.0;
  g = tan(gt * 0.2 + 0.25) + amp;

  for( float i = 0.; i < 4.; i++ ){
    // *, +, - all interesting
    b += cos( (gt * 0.6 * amp * i) * time * 0.2 );
  }
  

  r = b/g;

  g *= sin(b);
  b += r*(g+amp);

  gl_FragColor = vec4( r, g, b, 1.0 );
}

