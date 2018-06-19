uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy + vec2(-0.5,-0.5);
  float spin_speed = 0.5;
  float angle = u_time * spin_speed;
  // stutter beat
  // angle += (1.1 * sin(u_beat));
  // spin by beat
  // angle += 3.0 * u_beat;
  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  // zoom out
  uv *= 5.5;
  // bounce zoom
  // uv *= -5.5 + (u_beat * 12.0);
  uv *= rotation;

  float amp = u_beat;
  float time = u_time;

  float r = 0.;
  float g = 0.;
  float b = 0.;
  
  // warpings
  //uv.x += tan(uv.x);
  uv.x *= cos(uv.y);
  //uv.x = clamp(uv.x,0.0,1.0);
  uv.y *= sin(u_beat+uv.x);

  b = abs(sin(uv.y * 0.2 + time));

  g = tan(uv.y * 0.2 + 0.25);
  // flicker
  // g += sin(time*amp);

  r = abs(sin(uv.y*u_beat)*cos(b));

  g *= sin(b);
  b += r*(max(g,amp));

  gl_FragColor = vec4( r, g, b, 1.0 );
}

