uniform float u_beat;
uniform float u_time;
uniform vec2 u_resolution;


void main() {
  // normalize pixel coordinates to {-1,1}
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  float amp = u_beat;
  float time = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  b = uv.x;

  for( float i = 0.; i < 4.; i++ ){
    b += cos( (uv.y * 0.3) + i + time / 5.0 + (0.1*uv.y*(amp+0.5)) );
    //ALTERATION
    //b -= sin( uv.x + time / 30.0);
    b = abs( 1.0/b ) * sin(time); 
    //COLLAPSAR
    //b += abs( uv.y ) * amp;    
    r += (1.0 - b) * amp * sin(i * (time + i));
    //SPAZ
    //r -= sin(i * (time * amp));
    g += r + amp * cos(i * time);
    //BLOCKS
    //g += (b / r) * amp * cos(i * time);
  }

  gl_FragColor = vec4( r, g, b, 1.0 );
}


