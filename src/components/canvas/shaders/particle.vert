// ─────────────────────────────────────────────
// Particle Vertex Shader (Simplified for CPU Physics)
// ─────────────────────────────────────────────
uniform float uPointSize;
uniform float uPixelRatio;

attribute float aRandom;
attribute vec3 aBasePosition;
attribute float aInfluence;

varying float vAlpha;
varying float vDistFromCenter;
varying float vInfluence;

void main() {
  vec3 pos = position; // Comes from BufferAttribute that we update on CPU
  
  vInfluence = aInfluence;
  vDistFromCenter = length(aBasePosition.xy) / 6.0;
  
  vAlpha = mix(0.8, 0.15, vDistFromCenter) * (1.0 - vInfluence * 0.3);
  vAlpha *= 0.6 + aRandom * 0.4;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  gl_PointSize = uPointSize * uPixelRatio * (1.0 / -mvPosition.z);
  gl_PointSize *= 0.7 + aRandom * 0.6;
}
