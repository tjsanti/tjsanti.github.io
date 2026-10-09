# Player sprite artwork

Asset: `public/art/player/trevor-sprite-sheet.png`.

Created with the built-in image-generation tool. The first generation used the Garden hall as a style reference. A background-extraction edit produced the final transparent sheet. The game uses its original raster artwork, with runtime frame rectangles and alpha-bound validation. The earlier canvas rectangle painter was removed.

## Generation prompt

Use case: stylized-concept.
Asset type: production transparent pixel-art RPG player sprite sheet, ready to slice into 12 frames.
Reference image: /Users/trevor/github/tjsanti.github.io/public/art/garden-hall.png is only an art-style and camera-angle reference. Do NOT reproduce the hall; output only the character sheet.
Primary request: replace a crude blocky placeholder with an accomplished, appealing 16-bit RPG explorer matching the detailed Garden hall. Adult male scholar/explorer, short tousled chestnut hair, warm copper/russet fitted jacket, off-white shirt, a small blue neck scarf, slate-blue trousers, brown leather boots, small belt/satchel. No weapons, no hat. Adult lean proportions, head no more than one-quarter of full height, visible neck, tapered torso and articulated legs. Hands relaxed and naturally swinging. Attractive readable face made from restrained pixel clusters, not huge eyes, not a chibi toddler, not a square block head.
Medium: true finely drawn pixel art. Crisp square pixel clusters, controlled 24-32 color palette, believable warm highlights/cool shadow planes, tapered contours, rich textile folds. Cohesive hand-pixelled 16-bit action RPG visual quality, not vector rectangles, not painterly airbrush, not smooth 3D.
Composition: exactly 3 equal columns by 4 equal rows on a 1024x1536 portrait transparent canvas, no gutters. Each grid cell 341.33 x 384 conceptual. Row 1 facing DOWN toward viewer. Row 2 facing LEFT. Row 3 facing RIGHT. Row 4 facing UP away from viewer. Within every row, column 1 is neutral standing idle, column 2 left-leg-forward walk contact, column 3 right-leg-forward walk contact. Side views use correct opposite leg swing, back view has NO visible face. Same identity and outfit in every cell.
Every full-body character centered in its own cell, same head size and scale, same ground baseline at 86% of each cell height, body about 76% of cell height. Generous empty transparent space between silhouettes, no overlap. Show entire boots and hair, no cropping.
Background: genuine alpha transparency everywhere outside the 12 sprites. No grid lines, labels, letters, numbers, borders, palette swatches, floor shadows, or decorative background.
Avoid: oversized chibi head, stock RPG-maker toddler proportions, box torso, giant cream bib, blank angry dot face, thick black box outlines, green clothes, green dominant colors, photorealism, smoothing. Favor elegant readable silhouettes that stand out on a dark green carpet.

## Background-extraction prompt

Use case: background-extraction. Edit target is the supplied 1024x1536 player sprite sheet. Remove ONLY the entire brown backdrop, gradients, glow, and all ground shadows. Replace EVERY pixel outside the 12 character silhouettes with actual alpha transparency. Preserve all twelve character sprites exactly in position, size, appearance, pixel detail, direction, clothing colors, and grid arrangement. Do NOT repaint, simplify, enlarge, shift, relight, or redesign any character. Keep the original 1024x1536 canvas. Crisp clean cutout boundaries, no brown fringe, no drop shadow. Output a genuine transparent PNG sprite atlas, NOT a checkerboard picture and NOT another colored backdrop.

