// ─────────────────────────────────────────────
// Particle Fragment Shader
// ─────────────────────────────────────────────
varying float vAlpha;
varying float vDistFromCenter;
varying float vInfluence;

uniform vec3 uAccentColor;
uniform float uAccentMix;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  if (dist > 0.5) discard;

  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
  alpha *= vAlpha;

  float brightness = mix(0.6, 1.0, 1.0 - vDistFromCenter);
  vec3 baseColor = vec3(brightness);

  float accentAmount = uAccentMix * (0.3 + vInfluence * 0.7);
  vec3 color = mix(baseColor, uAccentColor * brightness, accentAmount);

  gl_FragColor = vec4(color, alpha);
}
