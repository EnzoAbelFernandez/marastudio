## 2024-07-30 - Screen Reader Accessibility in Text Splitting
**Learning:** Text-splitting animation components (like GSAP's SplitText) severely break screen reader pronunciation because they fragment words into individual span elements, making the text unintelligible to assistive technologies.
**Action:** Always wrap the fragmented elements with `aria-hidden="true"` (using `style={{ display: 'contents' }}` to preserve flex/grid layouts) and pair them with a `.sr-only` sibling element containing the full original text.
