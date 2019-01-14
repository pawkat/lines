uniform float time;
uniform float offset;
//uniform float offsetVal;
uniform vec3 color;
uniform float shadow;


varying vec2 vUv;




void main() {

//  float o = fract(time/500. + offset/offsetVal);
  float o = fract(time/500. + offset/10.);

  float length = 0.3;

  if(abs(vUv.x - o) > length && abs(vUv.x - o - 1.) > length && abs(vUv.x - o + 1.) > length) {
    discard;
  }

  if(gl_FrontFacing) {
    gl_FragColor = vec4(color, 1.);
  } else {
    gl_FragColor = vec4(color * shadow,  1.);
  }


}
