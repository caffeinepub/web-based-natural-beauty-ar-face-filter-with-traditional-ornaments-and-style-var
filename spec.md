# Specification

## Summary
**Goal:** Build an in-browser, webcam-based AR face filter experience with a realistic “Natural Beauty” look, traditional ornaments, selectable style variants, adjustable intensity controls, background blur, and still-image capture.

**Planned changes:**
- Add a start/stop camera UI with permission handling, live preview, and clear error/recovery states.
- Implement real-time face tracking and face-aligned overlays for subtle skin smoothing, soft pink blush, light glossy lips, and subtle eye sparkle.
- Overlay traditional ornaments (maang tikka, nose ring, jhumka earrings, thin gold necklace) anchored to facial regions with gentle secondary motion (sway/lag).
- Add a soft face-centered glow and subtly animated pastel sparkles around the face.
- Add optional background blur with a UI toggle to enable/disable.
- Add look/style variant selector: Natural Beauty (base), South Indian Bridal, Cute Anime Sparkle, Festival; switching updates live.
- Provide intensity controls for skin smoothing, blush, lip gloss, eye sparkle, glow/sparkles, and background blur, plus “Reset to default”.
- Add a “Capture” action to download a still image (PNG/JPEG) of the current preview with effects applied.
- Apply a cohesive “soft natural glam + warm gold” UI theme (avoid blue/purple as primary brand colors).
- Add a lightweight “Lens Notes” section that summarizes the selected look and active add-ons in English, updating live.

**User-visible outcome:** Users can run a webcam AR filter in the browser, choose a style variant, tune effect intensities (including background blur), see ornaments/sparkles/glow tracked to their face in real time, read a brief notes summary of the current look, and capture/download a filtered image locally.
