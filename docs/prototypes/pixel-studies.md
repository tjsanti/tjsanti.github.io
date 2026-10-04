# Pixel art visual studies

Throwaway prototypes for deciding the Landing and Game's visual appearance. No direction has been selected.

Run `npm run prototype`, then open `http://127.0.0.1:4321/prototype/portfolio/?variant=blue&screen=landing`.

Variants: `blue`, `oak`, `moss`. Screens: `landing`, `game`, `evidence`. Left/right arrows compare directions. The toolbar is included in development and builds explicitly made with `PROTOTYPE_REVIEW=1`.

All three use 16-bit pixel artwork, daytime castle interiors, pixel display text, modern navigation labels, and readable HTML Evidence panels. Background art is a static concept, not a Phaser scene or a finished collision map. The character does not move. Exhibits open a panel for visual review; the About copy comes from the existing homepage and other panels explicitly mark missing content. No completion meter, inventory, or required sequence.

The original prototype's invented location and project claims have been removed. Profile links open the existing portfolio homepage during this review.

## Artwork

Generated with the built-in imagegen tool. Saved assets are in `public/prototype/pixel-halls/`. Source images remain in the tool's generated-images directory. Art uses the same fixed image in the darkened Landing and bright Game views. CSS preserves hard edges with `image-rendering: pixelated`.

### blue

Saved asset: `public/prototype/pixel-halls/blue.png`.

Prompt:

```text
Use case: stylized-concept. Asset type: actual background artwork for a static web game prototype, not a page mockup. Create a beautiful authentic 16-bit pixel art medieval great hall interior. Wide landscape 3:2 composition. Strict pixel-art rendering: visible square pixel clusters, hard stair-step silhouettes, hand-placed tile texture, 32-color controlled palette, SNES-era detail, absolutely no smooth gradients, no blurry painterly brushwork, no 3D render, no vector geometry. Visually equivalent to a 480x320 pixel game screen enlarged with nearest-neighbor sampling. Three-quarter TOP-DOWN orthographic RPG view: back wall across the TOP, floor in the LOWER two thirds, parallel vertical sides, no vanishing-point perspective, no true isometric diamond, no exterior. One connected compact room, eight visually distinct readable exhibit furniture arrangements around the perimeter, generous walkable space in center, neutral small player sprite at lower center. Furniture includes three different project workbenches, archive bookshelves, about lectern, experience display, skills cabinet, and a Q&A desk with blue crystal. Beautiful daylight from high windows, restrained sunbeams made of hard flat pixel color bands. Must look like an actual detailed playable 16-bit RPG room, not a diagram. NO text, no UI, no letters, no borders, no watermark. Direction A, blue standard: formal sunlit limestone castle hall. Tall narrow windows, dusty blue banners with restrained gold edging, large muted blue central runner, carved stone columns and stairs, oak shelves, warm yellow sunlit flagstones, cool slate outlines, small terracotta accents, potted greenery. Nearly symmetrical composition with an open center. Palette slate #253849, limestone #b8b6a0, sunlight #ecd5a0, blue #426b92, timber #795747, moss #69806b. Eight exhibits clear around walls, broad central carpet leads player toward the rear dais. Rich pixel craftsmanship and environmental storytelling, inviting sophisticated modern pixel game.
```

### oak

Saved asset: `public/prototype/pixel-halls/oak.png`.

Prompt:

```text
Use case: stylized-concept. Asset type: actual background artwork for a static web game prototype, not a page mockup. Create a beautiful authentic 16-bit pixel art medieval great hall interior. Wide landscape 3:2 composition. Strict pixel-art rendering: visible square pixel clusters, hard stair-step silhouettes, hand-placed tile texture, 32-color controlled palette, SNES-era detail, absolutely no smooth gradients, no blurry painterly brushwork, no 3D render, no vector geometry. Visually equivalent to a 480x320 pixel game screen enlarged with nearest-neighbor sampling. Three-quarter TOP-DOWN orthographic RPG view: back wall across the TOP, floor in the LOWER two thirds, parallel vertical sides, no vanishing-point perspective, no true isometric diamond, no exterior. One connected compact room, eight visually distinct readable exhibit furniture arrangements around the perimeter, generous walkable space in center, neutral small player sprite at lower center. Furniture includes three different project workbenches, archive bookshelves, about lectern, experience display, skills cabinet, and a Q&A desk with blue crystal. Beautiful daylight from high windows, restrained sunbeams made of hard flat pixel color bands. Must look like an actual detailed playable 16-bit RPG room, not a diagram. NO text, no UI, no letters, no borders, no watermark. Direction B, oak and ember: welcoming inhabited castle workshop great hall. Warm exposed timber beams, honey-colored stone tiles, muted terracotta-red short rugs, moss-green window shutters and herb pots, gold daylight, brick hearth upper right, packed bookcases upper left, workbenches in staggered loose groups at left and right, open walkable center. Asymmetric furnishing but one connected room. Strong authored 16-bit adventure-game environment with worktables containing individual tiny books, scrolls, ink bottles and mechanical models. Palette ink #302f35, timber #805847, wheat #d8b878, red #9b5c4b, moss #647754, pale stone #c8c1a4. Cozy daytime, never nighttime, no glowing neon.
```

### moss

Saved asset: `public/prototype/pixel-halls/moss.png`.

Prompt:

```text
Use case: stylized-concept. Asset type: actual background artwork for a static web game prototype, not a page mockup. Create a beautiful authentic 16-bit pixel art medieval great hall interior. Wide landscape 3:2 composition. Strict pixel-art rendering: visible square pixel clusters, hard stair-step silhouettes, hand-placed tile texture, 32-color controlled palette, SNES-era detail, absolutely no smooth gradients, no blurry painterly brushwork, no 3D render, no vector geometry. Visually equivalent to a 480x320 pixel game screen enlarged with nearest-neighbor sampling. Three-quarter TOP-DOWN orthographic RPG view: back wall across the TOP, floor in the LOWER two thirds, parallel vertical sides, no vanishing-point perspective, no true isometric diamond, no exterior. One connected compact room, eight visually distinct readable exhibit furniture arrangements around the perimeter, generous walkable space in center, neutral small player sprite at lower center. Furniture includes three different project workbenches, archive bookshelves, about lectern, experience display, skills cabinet, and a Q&A desk with blue crystal. Beautiful daylight from high windows, restrained sunbeams made of hard flat pixel color bands. Must look like an actual detailed playable 16-bit RPG room, not a diagram. NO text, no UI, no letters, no borders, no watermark. Direction C, garden cloister: airy tall stone great hall with deep arched windows opening to blue sky and lush greenery, sage stonework, narrow muted green woven runners, ivy at top edge, old bookcases and oak display tables along the sides, daylight pools across large cool gray-green stone tiles. Quiet architectural rhythm, broad central floor and a shallow two-step upper dais, furniture arranged in horseshoe around central open space. Still fully indoors and medieval, no additional rooms. Palette deep teal #273f41, sage #819589, limestone #c7cbb7, sunlight #f0deb0, cornflower #6a97ad, restrained heraldic burgundy #8a4d50. Lush detailed pixel-art plants, pixel clusters, rich readable 16-bit game art.
```
