attribute vec4 position;
varying vec2 texcoord;
void main() {
  texcoord = position.xy * 0.5 + 0.5;
  gl_Position = position;
}