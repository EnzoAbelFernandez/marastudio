// ─────────────────────────────────────────────
// Particle Fragment Shader
// ─────────────────────────────────────────────
// Renders each particle as a soft, anti-aliased circle
// with distance-based alpha attenuation.

varying float vAlpha;
varying float vDistFromCenter;

void main() {
  // Create circular point with soft edge
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Discard pixels outside the circle
  if (dist > 0.5) discard;

  // Smooth anti-aliased edge
  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
  alpha *= vAlpha;

  // Monochromatic: white particles with varying brightness
  float brightness = mix(0.6, 1.0, 1.0 - vDistFromCenter);
  vec3 color = vec3(brightness);

  gl_FragColor = vec4(color, alpha);
}
