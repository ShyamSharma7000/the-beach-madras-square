# Venue photography

Drop cleared photographs here, then reference them in `src/content/venues/the-beach.ts`:

- `gallery/` for gallery images (set `src` and `placeholder: false`).
- `occasions/` for occasion cards (set `image`).
- `venue/` for anything else (for example the location image).

Rules: only files the venue owns or has given written permission to use. Record each one in
`docs/asset-register.md`. Export around 1600 px on the long edge; `next/image` generates the
responsive sizes and AVIF/WebP automatically.
