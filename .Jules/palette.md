## 2024-07-27 - GSAP Split Text Accessibility
**Learning:** Fragmenting text for GSAP animation breaks how screen readers pronounce the content, causing words to be spelled out letter-by-letter or otherwise pronounced incorrectly.
**Action:** When using a text splitting pattern (like in `SplitText.tsx`), hide the fragmented elements using `aria-hidden="true"` and pair them with a `.sr-only` sibling element containing the full text.
