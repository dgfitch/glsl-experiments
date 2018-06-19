uniform float u_beat;
uniform float u_time;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


void main() {
  // normalize pixel coordinates to {-1,1}
  vec2 uv = gl_FragCoord.xy/u_resolution.xy + vec2(-0.5,-0.5);
  float spin_speed = 0.01;
  float angle = u_time * spin_speed;
  // stutter beat
  //angle += (1.1 * sin(u_beat));
  // spin by beat
  // angle += 3.0 * u_beat;
  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));
  
  // zoom out
  uv *= rotation;
  uv *= 10.5;


  float amp = u_beat;
  amp *= 0.1;

  float time = u_time;
  time *= 0.179;

  amp = 0.0;
  time *= 0.001;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  b = uv.x+uv.y;
  r = sin(uv.x)+uv.y;
  g = cos(uv.y)+uv.x;

  for( float i = 0.; i < 8.; i++ ){
    //b += cos( (uv.y * 0.3) + i + time / 5.0 + (0.1*uv.y*(amp-0.5)) );
    //b += cos( (uv.y * 0.8) + i + time / 3.0 + (0.1*uv.y*(amp-0.5)) );
    //ALTERATION
    //b -= sin( uv.x + time / 30.0);
    b = 1.0 - b*sin(time+g+r); 
    //COLLAPSAR
    b += abs( uv.y ) * amp;    
    r += (1.0 - b) * sin(i * (time + i));
    //SPAZ
    r -= sin(i * (time * amp));
    //g += (1.0-uv.x) - amp * cos(i * time);
    //BLOCKS
    g -= b * cos(i * time);
  }

  r = clamp(r,0.0,1.0);
  g = clamp(g,0.0,1.0);
  b = clamp(b,0.0,1.0);
  r *= 0.3;
  g *= 0.3;
  b *= 0.3;
  //r += amp;


  gl_FragColor = vec4( r, g, b, 1.0 );
}



