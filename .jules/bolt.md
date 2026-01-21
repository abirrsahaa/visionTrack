## 2025-05-22 - [Isolate High-Frequency Updates]
**Learning:** A typing effect in a parent component caused the entire page (including heavy Framer Motion animations) to re-render every 100ms. Extracting stateful animations to leaf components is critical for performance.
**Action:** Always isolate high-frequency state updates (like intervals/animations) into small, dedicated components.
