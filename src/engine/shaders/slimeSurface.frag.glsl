// Slime surface fragment shader
// Two-color blend with simplex noise swirl.
// Half-Lambert diffuse, Blinn-Phong specular, Fresnel rim for subsurface.
// Darkens dented areas. Gamma correction.

precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uMix;
uniform float uGloss;
uniform float uTranslucency;
uniform float uNoiseScale;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vImprint;

// --- Simplex 2D noise (Ashima Arts) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,   // (3.0 - sqrt(3.0)) / 6.0
    0.366025403784439,   // 0.5 * (sqrt(3.0) - 1.0)
   -0.577350269189626,   // -1.0 + 2.0 * C.x
    0.024390243902439    // 1.0 / 41.0
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // --- Color blend with noise swirl ---
  vec2 noiseCoord = vUv * uNoiseScale + uTime * 0.05;
  float noiseVal = snoise(noiseCoord) * 0.5 + 0.5; // Remap to 0..1
  float blendFactor = clamp(uMix + (noiseVal - 0.5) * 0.6, 0.0, 1.0);
  vec3 baseColor = mix(uColorA, uColorB, blendFactor);

  // --- Lighting ---
  vec3 lightDir = normalize(vec3(0.3, 0.5, 1.0));

  // Half-Lambert diffuse (softer, wraps around)
  float NdotL = dot(normal, lightDir);
  float halfLambert = NdotL * 0.5 + 0.5;
  halfLambert *= halfLambert; // Square for softer falloff
  vec3 diffuse = baseColor * halfLambert;

  // Blinn-Phong specular
  vec3 halfVec = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfVec), 0.0), uGloss * 128.0);
  vec3 specular = vec3(1.0) * spec * uGloss;

  // Fresnel rim (subsurface approximation)
  float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
  fresnel = pow(fresnel, 3.0);
  vec3 rim = baseColor * fresnel * uTranslucency;

  // --- Combine ---
  vec3 color = diffuse + specular + rim;

  // Darken dented areas
  color *= 1.0 - vImprint * 0.3;

  // Ambient
  color += baseColor * 0.1;

  // Gamma correction
  color = pow(color, vec3(1.0 / 2.2));

  gl_FragColor = vec4(color, 1.0);
}
