// Imprint decay fragment shader
// Reads previous imprint texture, applies decay, stamps soft circular brush at touch position.
// R channel = imprint intensity. Additive, clamped to 1.5.

precision highp float;

uniform sampler2D uPrevImprint;
uniform float uDecay;          // 0.97 default — multiplied each frame for fade
uniform vec2 uTouchPos;        // Touch position in UV space (0..1)
uniform float uBrushRadius;    // Brush radius in UV space (~0.04)
uniform float uPressure;       // Touch pressure 0..1
uniform float uIsDown;         // 1.0 when touching, 0.0 when not

varying vec2 vUv;

void main() {
  // Sample previous frame and decay
  float prev = texture2D(uPrevImprint, vUv).r;
  float decayed = prev * uDecay;

  // Stamp soft circular brush at touch position
  float stamp = 0.0;
  if (uIsDown > 0.5) {
    float dist = distance(vUv, uTouchPos);
    // Soft falloff: smoothstep from edge to center
    stamp = smoothstep(uBrushRadius, uBrushRadius * 0.3, dist);
    stamp *= uPressure;
  }

  // Additive blend, clamp to 1.5 to allow slight overshoot for stronger effect
  float result = min(decayed + stamp, 1.5);

  gl_FragColor = vec4(result, 0.0, 0.0, 1.0);
}
