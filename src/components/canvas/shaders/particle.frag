// ─────────────────────────────────────────────
// Particle Fragment Shader
// ─────────────────────────────────────────────
// Renders each particle as a soft, anti-aliased circle.
// Subtly tinted with an accent color near the center
// (or near the cursor via vInfluence).

varying float vAlpha;
varying float vDistFromCenter;
varying float vInfluence;

uniform vec3 uAccentColor;
uniform float uAccentMix;

void main() {
  // Create circular point with soft edge
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Discard pixels outside the circle
  if (dist > 0.5) discard;

  // Smooth anti-aliased edge
  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
  alpha *= vAlpha;

  // Base brightness: brighter near center of field
  float brightness = mix(0.6, 1.0, 1.0 - vDistFromCenter);
  vec3 baseColor = vec3(brightness);

  // Accent tint: appears on particles influenced by cursor proximity
  // At default uAccentMix (0.1), barely perceptible — subliminal warmth
  float accentAmount = uAccentMix * (0.3 + vInfluence * 0.7);
  vec3 color = mix(baseColor, uAccentColor * brightness, accentAmount);

  gl_FragColor = vec4(color, alpha);
}
