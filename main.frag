uniform float u_beat;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define M_PI 3.14159265358979323846


void main() {
	float aspect = 0.7;
  vec2 uv = gl_FragCoord.xy/u_resolution.xy * vec2(1.0,aspect) + vec2(-0.5,-0.5*aspect);
  float spin_speed = 0.04;
  float angle = u_time * spin_speed;
  // stutter beat
  // angle += (1.1 * sin(u_beat));
  // spin by beat
  // angle += 3.0 * u_beat;
  mat2 rotation = mat2( cos(M_PI*angle), sin(M_PI*angle),
                        -sin(M_PI*angle), cos(M_PI*angle));

  uv *= 2.0;
  uv *= rotation;

  float d;
  // d = length( abs(uv)-.4 );
  d = length( min(abs(uv)-.4,0.) );
	// change last 0. to 1. for strobe, 0.5 for partial strobe
  // d = length( max(abs(uv)-(u_beat*0.5)+0.3,0.1) );
  d *= u_beat;

  // Visualize the distance field
  gl_FragColor = vec4(vec3(fract(d*(10.0+sin(u_time)*20.0))),1.0);

  // Drawing with the distance field
  //gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
  // gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
  // gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);
}


