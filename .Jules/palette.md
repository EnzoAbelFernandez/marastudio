## 2025-02-12 - [Accessible Text Splitting for GSAP]
**Learning:** [Text-splitting animations (like GSAP) break words into disjointed letters/spans, making screen readers announce them character-by-character or unintelligibly. Fragmented text must be hidden from screen readers.]
**Action:** [Always wrap fragmented animation elements with `aria-hidden="true"` and pair them with a `.sr-only` sibling containing the full, unfragmented text string to ensure proper pronunciation.]
