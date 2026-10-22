---
name: SuperZydan
description: Dad and son gaming in the Zyverse, lit like a neon night street.
colors:
  night: "#08060f"
  night-raised: "#130c22"
  night-panel: "#1d1430"
  neon-magenta: "#ff3fb4"
  neon-cyan: "#2fe0ff"
  neon-violet: "#7a3cff"
  paint-orange: "#f07a3a"
  paint-yellow: "#f5c23a"
  live: "#ff2d3d"
  neon-off: "#86505c"
  starlight: "#f6f2ff"
  haze: "#c9bfe3"
  haze-muted: "#b3a8cc"
  ink-on-magenta: "#1a0612"
  wire: "#4a3f63"
  plate-hover: "#0b1a22"
typography:
  display-hero:
    fontFamily: "Big Shoulders, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Big Shoulders, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "normal"
  headline:
    fontFamily: "Big Shoulders, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 900
    lineHeight: 0.86
  tube-sign:
    fontFamily: "Big Shoulders, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0.08em"
  title:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  lede:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Figtree, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.025em"
  button:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    letterSpacing: "0.025em"
rounded:
  tube: "0.6rem"
  tube-vertical: "0.75rem"
  cut-sm: "6px"
  cut-md: "10px"
  cut-lg: "14px"
  cut-xl: "16px"
spacing:
  rail-x: "1rem"
  rail-x-lg: "2rem"
  rail-max: "80rem"
  section-y: "3.5rem"
  section-y-lg: "6rem"
  header-h: "5.0625rem"
  header-h-lg: "6.5rem"
  target-min: "2.75rem"
components:
  button-solid:
    backgroundColor: "{colors.neon-magenta}"
    textColor: "{colors.ink-on-magenta}"
    typography: "{typography.button}"
    rounded: "{rounded.cut-md}"
    padding: "0 24px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.night}"
    textColor: "{colors.neon-cyan}"
    typography: "{typography.button}"
    rounded: "{rounded.cut-md}"
    padding: "0 24px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.plate-hover}"
  button-violet:
    backgroundColor: "{colors.neon-violet}"
    textColor: "{colors.starlight}"
    typography: "{typography.button}"
    rounded: "{rounded.cut-md}"
    padding: "0 16px"
    height: "44px"
  tube-sign:
    textColor: "{colors.neon-magenta}"
    typography: "{typography.tube-sign}"
    rounded: "{rounded.tube}"
    padding: "4px 12px"
  screen-frame:
    backgroundColor: "{colors.night-raised}"
    rounded: "{rounded.cut-md}"
  name-plate:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.cut-md}"
    padding: "6px 14px"
  input:
    backgroundColor: "{colors.night}"
    textColor: "{colors.starlight}"
    padding: "12px 16px"
    height: "48px"
  nav-link:
    textColor: "{colors.haze}"
    padding: "8px 0"
  nav-link-active:
    textColor: "{colors.starlight}"
---

# Design System: SuperZydan

## Overview

**Creative North Star: "The Neon Night Street"**

The Zyverse is a rain-black violet street that a dad and his son own. Everything that speaks is a lit sign: page names and section headings are condensed black caps with a static tube glow, row labels are small framed tubes, thumbnails are screens bolted to the wall with cut corners, and buttons are chamfered sign plates. The ground stays dark so the signs can carry the colour; behind it, the faint rings of a portal turn slowly as the page scrolls. One red sign, LIVE, only burns when the Twitch stream is actually on.

The street is fun, not menacing: bright logo inks (magenta, cyan, a touch of orange and yellow paint), loose stickers for the name plates, short plain copy. Density is phone-first: one column, big type, swipeable rails, every target at least 44px. Desktop widens the same rail and lets the hero stage sit beside the headline.

Motion is the switch on the wall. Signs flicker on once (opacity only), blocks build in and photos drift as they scroll (CSS scroll timelines, off the main thread), the portal rings behind every page turn as you scroll, the lanes pin and slide sideways, and on desktop the SZ logo hangs as a 3D sign that leans toward the cursor. All of it is transform and opacity, all of it switches off for reduced motion, and none of it holds up the first paint.

**Key Characteristics:**
- Night ground (`night`), signs in magenta, cyan and violet, scarlet only for LIVE.
- Big Shoulders 900 uppercase for every sign; Figtree for everything you read.
- Cut-corner plates (`chamfer`) and glowing tube frames instead of rounded cards.
- Glow is painted once as static `text-shadow` / `box-shadow`; motion never animates blur or shadow.
- Real photos of the duo and the gear, each one checked; no stock, no Amazon product photos.

## Colors

A dark violet street lit by the SZ logo's own inks: two tube colours that do the talking, violet for depth and frames, paint specks for spice, and one scarlet kept for LIVE.

### Primary
- **Logo Magenta Tube** (`neon-magenta`): the one primary action per screen (solid NeonButton, the play chip on Screens), magenta signs (The Zyverse, Co-op, Newest videos rail), list markers in articles, text selection, the "Zyverse." word in the hero headline. Text on a magenta fill is `ink-on-magenta`.

### Secondary
- **Logo Cyan Tube** (`neon-cyan`): secondary actions (outline NeonButton, Join Discord), inline links and "more" links, hover/focus light on Screen frames, the active nav underline, the focus ring, and cyan signs (Watch, Night, Best clips).

### Tertiary
- **Electric Violet** (`neon-violet`): depth and structure. Resting Screen and plate frames at 40-45% (`bg-neon-violet/40`), header and footer rules at 20-25%, input borders at 50%, breadcrumb chevrons and meta-line slashes, scrollbar thumb, the quiet tertiary button (header "Work with me"), violet signs.
- **Paint Orange** (`paint-orange`) and **Paint Yellow** (`paint-yellow`): the logo's paint. Orange appears only as drifting hero specks. Yellow appears as hero specks, the small "Newest" badge on the first video Screen, the product availability note, and preview-only author notices.
- **Live Scarlet** (`live`): the LIVE sign when lit, the live stream's Screen frame and play chip, the "Live now" label. Nothing else, not even errors in decoration.

### Neutral
- **Rain-Black Violet** (`night`): page ground, header, menu drawer, input fill, the inner plate of outline buttons.
- **Raised Night** (`night-raised`): the inside of Screens, plates, name plates, table heads, active menu row. Footer uses a one-off `#0b0816` a step above night.
- **Night Panel** (`night-panel`): shadcn `secondary` / `muted` surfaces.
- **Starlight** (`starlight`): headings, strong text, button text on violet.
- **Haze** (`haze`): body copy, ledes, descriptions, meta text. Tinted from the violet, never a grey.
- **Muted Haze** (`haze-muted`): shadcn `muted-foreground` only.
- **Unlit Tube** (`neon-off`): the LIVE sign when offline, readable at 3:1 on night.
- **Wire** (`wire`): the 1px wires that hang Screens and vertical tubes from above.
- **Plate Hover** (`plate-hover`): the inner plate of outline buttons on hover.
- Borders are `haze` at 12% (`--border`), inputs at 16%.

### Named Rules
**The One Red Sign Rule.** `live` means the stream is on right now. It never decorates, never marks errors in layout, never appears when offline.

**The One Magenta Plate Rule.** At most one solid magenta button per screen. Everything else is the cyan outline or the violet plate (product lists give the fill only to the post's own product).

**The Paint Speck Rule.** Orange and yellow are specks, a small badge, or a short note. Never a fill for a section, a button, or a heading.

## Typography

**Display Font:** Big Shoulders, weight 900 only (with Arial Narrow, Roboto Condensed, sans-serif)
**Body Font:** Figtree (with sans-serif)

**Character:** Condensed signage caps for anything that is a sign, set black and tight; a friendly rounded grotesque for everything people actually read.

### Hierarchy
- **Display Hero** (900, 3.5rem rising to 6rem at xl, 0.88, -0.01em, uppercase): the home h1 only, words lit in with a stagger.
- **Display** (900, 3.25rem / 3.75rem at 400px / 6rem at lg, 0.86, uppercase): page titles (PageHero) and large SignHeadings (The Zyverse, Watch).
- **Headline** (900, 2.25rem / 3.75rem, 0.86, uppercase): medium SignHeadings and the product-list heading (2.25rem / 3rem). Footer column titles and the menu title use the same face at 1.5rem.
- **Tube Sign** (900, 1.5rem / 1.875rem, 1, 0.08em, uppercase): TubeSign, rail labels, lane names, post category sign. Vertical hero tubes go to 0.14em; LIVE to 0.22em.
- **Stats** (Big Shoulders 900, 2.25rem, tabular numbers): hero follower counts.
- **Title** (Figtree 800, 1.5rem / 1.875rem, -0.015em): article h2; h3 at 1.25rem 700. Card titles 1.125rem 700 (feature 1.5rem / 1.875rem).
- **Lede** (Figtree 400, 1.125rem / 1.25rem, `haze`, max-w-xl): the one plain line under every sign.
- **Body** (Figtree 400, 1rem, 1.625, `haze`): article paragraphs inside a max-w-2xl column.
- **Label** (Figtree 700, 0.875rem, 0.025em, uppercase): post meta lines (category / read time / date), name-plate roles (0.75rem, 0.14em), badges.
- **Button** (Figtree 800, 1rem, 0.025em, uppercase); 0.875rem in the header and product lists.

### Named Rules
**The Sign Means Caps Rule.** If it is lit or framed, it is Big Shoulders 900 uppercase. Body text, card titles and article headings are never set in the display face.

**The Plain Line Rule.** A sign is followed by one plain Figtree line in `haze` saying what's here. Nothing sits above a heading: no eyebrow, no kicker.

## Layout

One rail for the whole site: `shell` (max-width 80rem, 1rem side padding, 2rem from lg). The header, the home hero, every section and the footer share these edges. Section rhythm is `shell-y` (3.5rem, 6rem from lg). The sticky header's height is `--header-h` (5.0625rem, 6.5rem from lg); it drives `scroll-padding-top`, the pinned lanes' top padding and anchor offsets, so anything sticky or anchored must use it.

Phones get one column. Rails are swipeable rows with the next card peeking (78% wide, 45% at sm, a 4-column grid from lg); lanes are min(80vw, 24rem) wide. The home hero stacks stage then headline on phones (headline steps onto the stage floor with a negative margin so Watch and Discord sit above the fold in the TikTok in-app browser), and splits into headline left, stage right from lg. PageHero splits 1.1fr / 0.9fr when it has an aside. Articles read in a max-w-2xl column.

Breakpoints are Tailwind's (sm 40rem, lg 64rem, xl 80rem) plus a 400px step for display sizes. The nav moves into the drawer below xl.

### Named Rules
**The One Rail Rule.** New sections use `shell` and `shell-y`; nothing invents its own max width or side padding.

## Elevation & Depth

There are no drop shadows lifting cards. Depth is light: glow from the signs, the portal rings behind every page (fixed, `z-index: -1`, ring opacities 0.17 to 0.24 so body copy keeps its contrast; phones get the two middle rings only), radial floor pools under the hero, and the violet-tinted step from `night` to `night-raised`. Every glow is a static `text-shadow` or `box-shadow` painted once; motion only changes the sign's opacity, so glows cost nothing on phones.

### Shadow Vocabulary
- **Sign text glow** (`neon-magenta` / `neon-cyan` / `neon-violet` / `neon-live` utilities: `0 0 2px #fff, 0 0 8px tone, 0 0 18-20px tone at 70-80%`, with a pale tint of the tone as text colour): every SignHeading, TubeSign and page title.
- **Tube frame** (`tube-frame`: `2px solid var(--tube)`, `0 0 6px`, `0 0 18px -2px`, `inset 0 0 10px -2px`): framed tube signs; set `--tube` to the tone.
- **Logo glow** (`drop-shadow(0 0 18px rgb(255 63 180 / 0.45))`): the SZ logo on the hero stage.
- **Floor light** (radial gradients of violet, magenta and cyan at 0.38-0.45 alpha) and the **street line** (1px, magenta to cyan, 50-60% opacity): under the hero and every PageHero.

### Named Rules
**The Painted-Once Glow Rule.** Never animate `blur`, `box-shadow` or `text-shadow`. To power a sign on or off, animate its opacity or swap the static glow with `data-neon`.

## Shapes

Two silhouettes. **Chamfered plates** (`chamfer`, a clip-path octagon with `--cut` corners) for buttons, Screens, post cards, name plates, product plates, the contact form and inline article images: cuts run 6px (play chip), 8-10px (buttons, small Screens), 12px (post cards, product plates), 14px (large Screen, lanes) and 16px (feature post, form). A framed plate is two chamfers: an outer one in the frame colour and an inner one 2px in with a cut 1px smaller.

**Tube signs** keep soft corners (0.6rem; 0.75rem on the vertical hero tubes) because bent glass is round. Inputs and notices are square with a 2px or 1px border. Circles are reserved for paint specks and the Discord online dot.

## Components

### Buttons (NeonButton)
Sign plates, loud and short.
- **Shape:** chamfered plate (10px cut; 8px in the header, 9px in product lists), drawn as an inner layer so `clip-path` never clips the focus ring.
- **Solid:** magenta fill, `ink-on-magenta` text, 48px min height, 24px side padding, Figtree 800 uppercase. Hover brightens to 110%.
- **Outline:** a cyan plate with a `night` plate 2px inside (a faked chamfered border), cyan text; hover darkens the inner plate to `plate-hover`.
- **Violet:** violet fill, white text; hover brightens to 125%. The quiet tertiary (header "Work with me").
- **Press:** scale to 0.97 over 150ms on `--ease-out`. Focus: the global 2px cyan ring, offset 4px.
- The contact form's send button and product-list buttons repeat this build by hand; new buttons use NeonButton.

### Signs (SignHeading, TubeSign, PageHero, LiveSign)
- **SignHeading:** h1-h3 in the display face with a tone glow (magenta, cyan or violet), `lg` or `md` size, an optional `sub` lede. Marked `data-neon` so it lights on entry.
- **TubeSign:** a small framed tube (`tube-frame`, 0.6rem corners, 4px 12px padding, 0.08em tracking) for labelling a row, a lane or a block.
- **PageHero:** every inner page's top: breadcrumbs, the page name as a lit display sign that powers on once on load, one lede, optional actions and aside, then the magenta-to-cyan street line.
- **LiveSign:** offline it is an unlit tube (`neon-off`, border at 60%, plus "Not live right now" for screen readers); live it switches to `neon-live` with a scarlet tube frame and the tube-on flicker.

### Screens and cards (Screen, PostCard, LaneCard, Plate)
- **Screen:** a 16:9 thumbnail in a framed chamfer: violet frame at 40% (cyan at 80% for the large one), `night-raised` inside, a magenta play chip at 85% opacity. Hover or keyboard focus lights the frame cyan, lifts the chip to full and scales the picture to 1.03 over 300ms. The large stream Screen hangs from two `wire` lines; when live its frame is scarlet.
- **PostCard:** the same frame (12px cut, 16px for `feature` at 16:10), then a label meta line (category / read time), a Figtree title that turns cyan on hover, and a 2-3 line `haze` excerpt. A post with no cover shows its label as a violet sign inside the frame.
- **LaneCard:** a tone-coloured frame around a photo (or the duo cutout on a lit radial stage), a TubeSign name, one line, and a cyan arrow link.
- **Product plate / contact plate:** violet frame at 40-45%, `night-raised` inside, 20px padding (32px for the form from sm).
- **Name plate:** a sticker on the hero stage, tone-coloured frame, name in the display face over a small uppercase role, tilted 2-3 degrees.

### Inputs / Fields
- **Style:** square, 2px `neon-violet` border at 50%, `night` fill, white text, 12px 16px padding, 48px min height; placeholder in `haze` at 70%.
- **Focus:** border turns `neon-cyan` (hover: full violet). Labels are bold white above the field, "(optional)" in `haze`, hints in 0.875rem `haze`.
- **Confirmation:** a square notice with a 2px cyan border at 60% on `night`.

### Navigation
- **Header:** sticky, `night` with a violet rule at 25%. Logo left; nav links Figtree 600 at 0.95rem in `haze`, white on hover, the current page white with a 2px cyan underline. Then the violet "Work with me" plate (lg+) and the cyan outline Discord plate (icon only on phones, still 44px).
- **Phone menu:** a native `dialog` drawer from the right (min(22rem, 86vw), violet left rule at 30%), 48px rows in `haze`, the current page on `night-raised`, a solid Discord plate at the end.
- **Footer:** `#0b0816` with violet rules, display-face column titles, every link a full 44px row, violet out-arrows that light cyan on hover, the single affiliate disclosure line.
- **Breadcrumbs and chip rows:** 0.875rem 600 `haze` links with violet chevrons; category chip rows set `prefetch={false}` so they don't compete with the page's images.

### Article body (MDX)
`haze` paragraphs at 1.625 line height, white Figtree headings, magenta list markers, cyan underlined links (underline at 40%), blockquotes between violet rules, tables on violet hairlines with `night-raised` heads, images inside a violet chamfer frame, and outbound link tiles as framed plates with a cyan arrow.

### Motion grammar
- **Tube-on:** 900ms linear opacity flicker starting from 0.25 (never invisible, so it still paints and counts for LCP). Page titles and hero tubes run it on load; `data-neon` signs below the fold start unlit (glow removed, border at 25% haze, text still readable) and light the first time they reach the screen, 160ms apart (`NeonSigns`, one IntersectionObserver). The NIGHT tube hums with a rare dip to 0.82.
- **Hero words:** `word-in` from 0.4 opacity and 0.35em down, 520ms `--ease-out`, 70ms stagger after 250ms.
- **Scroll timelines:** `.build-in` (from 2.5rem down and transparent, staggered by `--i`), `.parallax-photo` (drift with 1.12 scale), `.screen-on` (scaleY from 0.88), the pinned `.lanes` sliding sideways under the header, the hero sign's glow brightening from 0.35 over the first 60vh, and the `PortalRings` layer behind every page, whose rings each turn by their own `--turn` over the first 9000px of scroll (a set distance, so short pages don't spin faster). Without scroll-timeline support everything simply sits in place.
- **Hero 3D sign:** desktop with a fine pointer only, upgraded on idle after load; a spring tilt (up to 16 by 11 degrees) and a blurred glow plate set back in Z.
- **Dialogs:** the video dialog rises from 96% scale (260ms in, 160ms out); the menu drawer slides from the right (320ms in on `cubic-bezier(0.32, 0.72, 0, 1)`, 200ms out). Reduced motion keeps fades only.
- **Smooth scroll:** Lenis on wheel and trackpad only (lerp 0.12), loaded after hydration, paused when a dialog locks scroll, never loaded with reduced motion; touch keeps native momentum.
- **Easing:** `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)` for state changes and arrivals; `--ease-in-out` `cubic-bezier(0.77, 0, 0.175, 1)` on hand.

### Performance rules that shape the design
- Sections below the first screen carry `render-later` (`content-visibility: auto`, 900px size hint).
- Pictures just under the first screen use `DeferredImage`, which waits for the first scroll, tap or key press (or 1.5s after load); the frame's own `night-raised` fill holds the space so nothing shifts.
- The hero logo and duo cutout preload at high priority and decode synchronously; nothing animates them from invisible.
- No motion library: all motion is CSS keyframes, scroll timelines and two small effects (`NeonSigns`, `HeroSign`). Embeds load only on tap.

## Do's and Don'ts

### Do:
- **Do** follow every sign with one plain lede in `haze` that says what the section is.
- **Do** give each screen one solid magenta NeonButton at most; use the cyan outline for the second action and the violet plate for the quiet third.
- **Do** keep `live` for the live stream state only, and keep the offline LIVE sign readable (`neon-off`, 3:1).
- **Do** mark below-the-fold signs with `data-neon` and put glow in the `neon-*` / `tube-frame` utilities, never inline shadows.
- **Do** animate only `transform` and `opacity`, start flickers from a visible state, and gate every effect behind `prefers-reduced-motion: no-preference`.
- **Do** keep every target at least 44px (`min-h-11`; buttons 48px) and leave the 2px cyan focus ring, offset 3px, visible.
- **Do** use real photos of the duo, the desk and the food. Check each photo or frame of LinkNova for school logos or shirts, jerseys with names, street signs, house numbers and his real name before it ships, and refer to him only as LinkNova or "my son".
- **Do** use `shell`, `shell-y`, `render-later` and `DeferredImage` for new sections below the hero.
- **Do** write copy in the owner's voice: first person, "we" for the duo, short and plain, no AI-stock phrasing.

### Don't:
- **Don't** put eyebrow labels or kickers above headings.
- **Don't** use glass cards, backdrop blur, or frosted panels.
- **Don't** use gradient text; the only gradients are light (floor pools, the street line).
- **Don't** use coloured side borders as accents on cards, notes or list items.
- **Don't** show Amazon product photos, prices or star ratings.
- **Don't** set body copy, card titles or article headings in Big Shoulders, or set Big Shoulders at any weight other than 900.
- **Don't** fill a section, button or heading with orange or yellow.
- **Don't** animate blur, shadows, width, height or position, and don't scroll-jack beyond the pinned lanes' CSS sticky.
- **Don't** round plates or Screens; plates are chamfered, only tube signs have soft corners.
