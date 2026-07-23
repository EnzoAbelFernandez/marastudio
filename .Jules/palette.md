## 2025-02-05 - Fix Screen Reader Output for GSAP SplitText
**Learning:** When splitting text into characters or words for GSAP animations, screen readers often read the text letter-by-letter or with broken pacing.
**Action:** Add a visually hidden `.sr-only` element containing the full un-split text, and apply `aria-hidden="true"` to the animated split elements so screen readers ignore them and read the full text correctly.
