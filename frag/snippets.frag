monochrome:

  r = clamp(r, 0.0, 1.0);
  b = clamp(b, 0.0, 1.0);
  g = clamp(g, 0.0, 1.0);
  float w = (r+b+g)/3.0;
  r=w;
  b=w;
  g=w;

aspect:
	float aspect = 0.7;
  vec2 uv = gl_FragCoord.xy/u_resolution.xy * vec2(1.0,aspect) + vec2(-0.5,-0.5*aspect);


rotation:
  #define M_PI 3.14159265358979323846

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
  // uv *= 5.0;
  uv *= rotation;
