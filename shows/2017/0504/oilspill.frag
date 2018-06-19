uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  float amp = u_beat;
  float time = u_time;

  float b = 0.;
  float r = 0.;
  float g = 0.;

  for( float i = 0.; i < 8.; i++ ){
    //CHAOS SPILL
    uv.x += sin( uv.y + time * i + 2.0);
    uv.y -= amp * sin(uv.x * i);

    //JITTER SHAKE
    uv.x += sin( uv.y + time * i + 2.0);
    uv.y += amp + sin(uv.x * i);

    b = uv.y / uv.x;
    b += amp;
    r += uv.x * mod(amp,uv.y) * amp;
    g += (1.0-uv.x) / uv.y * sin(amp * i);

    // Hide most green
    //g /= abs( uv.y ) * amp;
  }

  b = clamp(b, 0.0, 1.0);
  b *= u_beat;

  gl_FragColor = vec4( r, g, b, 1.0 );
}
