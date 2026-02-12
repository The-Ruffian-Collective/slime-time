// Slime surface vertex shader
// Reads imprint R channel, displaces vertices along Z by -imprint * uDepth.
// Computes perturbed normals via finite differences (4 neighbor samples).

precision highp float;

uniform sampler2D uImprintTex;
uniform float uDepth;          // Max displacement depth (~0.15)

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vImprint;

void main() {
  vUv = uv;

  // Sample imprint at this vertex
  float imprint = texture2D(uImprintTex, uv).r;
  vImprint = imprint;

  // Displace vertex along Z (into the surface)
  vec3 displaced = position;
  displaced.z -= imprint * uDepth;

  // Compute perturbed normal via finite differences (4 neighbors)
  float texelSize = 1.0 / 512.0; // Matches RT resolution
  float normalScale = 8.0;

  float hL = texture2D(uImprintTex, uv + vec2(-texelSize, 0.0)).r * uDepth;
  float hR = texture2D(uImprintTex, uv + vec2( texelSize, 0.0)).r * uDepth;
  float hD = texture2D(uImprintTex, uv + vec2(0.0, -texelSize)).r * uDepth;
  float hU = texture2D(uImprintTex, uv + vec2(0.0,  texelSize)).r * uDepth;

  vec3 perturbedNormal = normalize(vec3(
    (hL - hR) * normalScale,
    (hD - hU) * normalScale,
    1.0
  ));

  vNormal = normalMatrix * perturbedNormal;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
