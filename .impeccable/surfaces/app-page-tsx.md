---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

## Scope

Home page (`app/page.tsx`). Visitor mode: Persuade. Primary visitor: a TikTok fan on a phone. Job: learn in five seconds that SuperZydan is a dad and his son gaming together, then watch (live if live, latest video if not) or join Discord. Brands get a header button and a collabs strip, not the lead.

Constraints from the owner (2026-10-21): trim the home page hard (hero, one Watch rail, Zyverse lanes, short gear and storefront teaser, latest posts, collabs higher up, Discord close). Fun first: bold and dark is fine, nothing scary, violent, aggressive, kiddie, corporate or cluttered on phones. The takeaway is "dad and son, gaming".

## Direction contract

THESIS: The Zyverse as a neon night street the duo owns: content lanes are lit signs, and the one red sign only burns when the stream is actually on. Refuses the category default of a featured-video box over a stats row and card grid.

OWN-WORLD: Rain-black violet ground (#08060f), neon tube signs in the logo's magenta (#ff3fb4) and cyan (#2fe0ff), electric violet (#7a3cff) for depth, the logo's orange and yellow only in small paint specks. Scarlet (#ff2d3d) is reserved for LIVE. Chamfered sign frames, tube-glow outlines, a wet-floor reflection under the hero. Display: Big Shoulders Display, uppercase. Body: Figtree. Name plates are sticker-style plates on the duo cutout.

STORY: The visitor sees the duo under the signs, reads "Dad and son. Gaming in the Zyverse.", sees who is who on the name plates, one line on what's on the channel, real follower numbers, then taps Watch or Join Discord.

FIRST VIEWPORT (375px): header with a large graffiti SZ logo plus wordmark and a Discord button. A stage with the CO-OP sign (magenta, left) and NIGHT sign (cyan, right) as vertical neon tubes, the LIVE sign at top center (dark unlit tube when offline, scarlet when live), the duo cutout standing between them with plates "SuperZydan" and "LinkNova", a soft floor reflection. Below: the uppercase headline, the one-line description, Watch (primary, magenta fill) and Join Discord (cyan outline), then the stats row. Desktop: same stage on the right, headline column on the left, logo bigger still.

FORM: Neon Night (catalog challenger pop-culture-shelf-neo-tokyo-neon-night, adopted by the owner over the assigned Scene Kit, which was 7th on my ordered list; kept from Scene Kit at the owner's request: name plates, the one-line description, the stats row). seed:137322c0fa8d0f01

Signature interaction and motion grammar: on load the signs power on once (a short tube flicker, opacity only) and the headline words light in with a stagger; the LIVE sign switches on with the same flicker when the stream goes live. Glow and flicker are subtle and cheap on phones (opacity on pre-rendered glow layers, no animated blur or shadows). Reduced motion: no flicker, no stagger, signs simply on. Hover on desktop only.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Checkpoint 4a builds only the header, hero and the Watch section. The rest of the page is still the old design until the owner approves the look. DESIGN.md is written after approval, at 4b.
