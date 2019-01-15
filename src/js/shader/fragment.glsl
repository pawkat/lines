uniform float time;
uniform float offset;

uniform float offsetVal;
uniform vec3 color;
uniform float shadow;
uniform float length;


varying vec2 vUv;




void main() {

  float o = fract(time/500. + offset/offsetVal);

  float hole = length/2.;

  if(abs(vUv.x - o) > hole && abs(vUv.x - o - 1.) > hole && abs(vUv.x - o + 1.) > hole) {
    discard;
  }

  if(gl_FrontFacing) {
    gl_FragColor = vec4(color, 1.);
  } else {
    gl_FragColor = vec4(color * shadow,  1.);
  }


}
