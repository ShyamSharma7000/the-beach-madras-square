# Asset register

No third-party photography or video is used. All imagery is original procedural SVG artwork
generated in code (`src/lib/sky.ts`, `src/components/gallery/ArtTile.tsx`,
`src/components/motion/HeroScene.tsx`).

| Asset | Type | Owner | Licence | Used for | Replace? |
| --- | --- | --- | --- | --- | --- |
| Hero scene | Code-drawn SVG | Project author | Own work | Hero | Keep, or replace with a venue photo (`HeroPhoto`) |
| Gallery tiles (6) | Code-drawn SVG | Project author | Own work | Gallery, occasions, location | Yes, with cleared photography |
| Open Graph image and favicon | Generated in code (`opengraph-image.tsx`, `icon.tsx`) | Project author | Own work | Link previews, browser tab | Optional |
| Instrument Serif (regular, italic) | Font | Instrument Type | SIL OFL 1.1 (`src/fonts/LICENSE-instrument-serif.txt`) | Display type | No |
| Hanken Grotesk (variable) | Font | Hanken Design Co. | SIL OFL 1.1 (`src/fonts/LICENSE-hanken-grotesk.txt`) | Body and UI | No |
| Lucide icons | npm package | Lucide contributors | ISC | UI icons | No |

The venue's logo is not used.

## When real assets arrive

Drop files under `public/images/the-beach/` (see the README there) and set `src` on the gallery
items in the venue file. The gallery is hidden on the launched site until real photos exist.

For each file record: local path, source URL, owner or creator, written permission, commercial-use
status, attribution, date collected, alt text, section used, and whether it shows the real venue.
Do not scrape Google Maps or Images, and do not download social videos without permission.
