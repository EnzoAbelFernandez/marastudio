## 2024-10-25 - [Text Splitting Accessibility]
**Learning:** Fragmenting text content into individually wrapped characters/words for GSAP animation breaks screen reader pronunciation, resulting in spelling out words letter-by-letter instead of reading normally.
**Action:** Always wrap the fragmented elements with `aria-hidden="true"` and `style={{ display: 'contents' }}` (to maintain flex/grid layouts without breaking accessibility) and pair them with a visually hidden `.sr-only` sibling element containing the full original text content.
