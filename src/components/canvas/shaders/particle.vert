// ─────────────────────────────────────────────
// Particle Vertex Shader
// ─────────────────────────────────────────────
// Displaces particles based on mouse proximity
// and applies simplex noise for organic drift.

uniform float uTime;
uniform vec2 uMouse;          // Normalized mouse position (-1 to 1)
uniform float uMouseRadius;   // Radius of mouse influence
uniform float uMouseStrength; // Strength of displacement
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform float uPointSize;
uniform float uPixelRatio;

attribute float aRandom;      // Per-particle random seed
attribute vec3 aBasePosition; // Original rest position

varying float vAlpha;
varying float vDistFromCenter;

// ── Simplex noise helpers ──────────────────
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  vec3 pos = aBasePosition;

  // ── Organic drift via 3D noise ──
  float noiseTime = uTime * uNoiseSpeed;
  vec3 noiseInput = pos * uNoiseScale + noiseTime;
  float noiseX = snoise(noiseInput) * 0.3;
  float noiseY = snoise(noiseInput + 100.0) * 0.3;
  float noiseZ = snoise(noiseInput + 200.0) * 0.15;

  pos += vec3(noiseX, noiseY, noiseZ);

  // ── Mouse repulsion ──
  // Project mouse position into 3D space (centered at z=0 plane)
  vec3 mousePos3D = vec3(uMouse.x * 5.0, uMouse.y * 3.0, 0.0);
  vec3 diff = pos - mousePos3D;
  float dist = length(diff);
  float influence = smoothstep(uMouseRadius, 0.0, dist);

  // Push particles away from cursor
  vec3 repulsion = normalize(diff + 0.001) * influence * uMouseStrength;
  pos += repulsion;

  // ── Compute alpha based on distance from center ──
  vDistFromCenter = length(aBasePosition.xy) / 6.0;
  vAlpha = mix(0.8, 0.15, vDistFromCenter) * (1.0 - influence * 0.3);
  vAlpha *= 0.6 + aRandom * 0.4;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation
  gl_PointSize = uPointSize * uPixelRatio * (1.0 / -mvPosition.z);
  gl_PointSize *= 0.7 + aRandom * 0.6;
}
