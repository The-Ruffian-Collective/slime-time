// Fullscreen quad vertex shader for imprint decay pass
// Outputs UV coordinates for fragment shader sampling

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
