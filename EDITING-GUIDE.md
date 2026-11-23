# Boka Seafood website: editing guide

A static site: plain HTML, CSS and JavaScript, with no build step. Open `index.html` in a browser to preview it, or upload the whole folder to any host (Netlify, Vercel, cPanel, GitHub Pages).

```
boka-seafood/
├── index.html        page structure
├── css/style.css     design (colours and fonts are at the top)
├── js/i18n.js        ALL text in English + Montenegrin, plus phone/WhatsApp
├── js/menu.js        menu dishes, descriptions and prices
├── js/main.js        animations and behaviour (no content here)
└── images/           every photo + logo.svg
```

## 0. Two language pages (important for Google)

The site has three real pages: `/` (English), `/me/` (Montenegrin) and `/ru/` (Russian). Google indexes both separately.
They are **generated** (texts in `js/i18n.js`: en / me / ru; menu entries are `[English, Montenegrin, Russian]`) from `src/template.html` + `js/i18n.js` + `js/menu.js`. After changing text, the menu or the layout, run:

```
node tools/build.js
```

and upload the whole folder again. (If you forget, visitors still see the new text, but Google keeps reading the old one.)
Edit the layout in `src/template.html`, not in `index.html` (that file is overwritten by the build).
At the top of `tools/build.js` set **SITE** to your real domain, and fill in **openingHours** once they are confirmed.

## 1. Replacing photos (the easy way)

Every photo is a file in `images/`. **To change a photo, replace the file and keep the exact same filename.** You don't need to touch any code.

| File | Where it appears | Best shape |
|---|---|---|
| `hero.jpg` | Big opening photo (right side / full screen on phones) | Landscape 3:2, 2000 px wide |
| `raw-bar.jpg` | Wide photo in the "A farm first" strip, gallery, oyster dish | Landscape 4:3 |
| `farm.jpg` | "Grown" tile (the farm / mussel lines) | Landscape or square |
| `chef.jpg` | "Harvested" tile (best: boat pulling up mussel ropes) | Landscape or square |
| `oysters.jpg` | "Served" tile, gratinated oysters, gallery | Landscape |
| `terrace.jpg` | Story section, gallery | Landscape 4:3 |
| `mussels.jpg` | Story inset, mussels buzara dish, gallery | Landscape |
| `table.jpg` | "Dinner, with a view" band | Landscape |
| `wine.jpg` | "Stay until the light changes" band (sunset photo ideal) | Wide landscape |
| `fish.jpg` | Farm tour section, sea bream dish, gallery | **Portrait** 2:3 |
| `octopus.jpg`, `prawns.jpg`, `sea-bass.jpg` | Dishes and gallery | Landscape |
| `wave.jpg` | Final "Meet us by the water" background | Wide landscape |
| `logo.png` | Restaurant logo in the header and footer | Original restaurant logo, unchanged (transparent margins trimmed only) (full-size original kept as `logo-original.webp`) |
| `logo.svg` | Browser tab icon (shell) | SVG |

**Quality tips**
- Export JPGs at **1400–2000 px wide, quality ~75%**. That's sharp on retina screens and still fast on phones. Try to keep each file **under 400 KB**. [squoosh.app](https://squoosh.app) does this for free.
- Photos are cropped to fill their frames, so keep the subject roughly in the centre.
- Dish photos in "The menu" row are cropped into circles. Shoot those from above.
- Use real photos of the farm, boat, terrace and the bay at sunset. They sell this place better than any stock photo.

**Using a different filename:** search `index.html` for the old name (e.g. `images/table.jpg`) and change it. For dish photos, change `img:` in `js/menu.js`. Also update the `alt="..."` text next to it, which describes the photo for screen readers and Google.

**Adding gallery photos:** in `index.html`, find the `GALLERY` section and copy one line like:
```html
<button class="g" type="button"><img src="images/NEW.jpg" alt="Describe the photo" loading="lazy" decoding="async"></button>
```
Add `g--tall` or `g--wide` to the class for a bigger tile. Keep the grid tidy: one tall or wide tile counts as two normal ones, and 4 per row fills a row on desktop.

## 2. Changing text

All wording is in **`js/i18n.js`**, with English in `en: {...}` and Montenegrin in `me: {...}`. Change the text between the quotes, and keep the quotes and commas. `<br>` makes a line break in headings.

## 3. Menu & prices

Edit **`js/menu.js`**. Each dish has `name` and `desc` as `[English, Montenegrin]` and a `price` in euros. Add `perKg: true` for fish sold by the kilo. Dishes with `signature: true` (max 6) appear in the round-photo row "The menu".

## 4. Phone & WhatsApp availability requests

At the top of `js/i18n.js`:
```js
window.CONTACT = { phoneDisplay: '+382 67 480 655', phoneLink: '+38267480655', whatsapp: '38267480655' };
```
The form under "Is there a table for you?" is an **availability request, not a booking**. When a guest presses the green button, WhatsApp opens with a message to this number:

> Hello Boka Seafood! Do you have a free table?
> Date: 24.06.2027. · Time: 20:00 · Guests: 4 · Name · Phone · (boat tour / notes)

The phone field has a country-code picker (pre-selected from the guest's browser language, Montenegro by default), so the number arrives in full international format, e.g. `+49 151 2345678`. The list of countries is at the top of the "Country dialling codes" block in `js/main.js`.

The guest presses send and the restaurant replies yes/no on WhatsApp. All "Check availability" buttons scroll to this form. The green floating button on phones opens WhatsApp directly with a short version of the question. No server is needed.

## 5. Colours & fonts

These are at the top of `css/style.css` (`--teal`, `--sun`, `--cream` …). Fonts are Marcellus (headings) and Manrope (text) from Google Fonts.

## ⚠ Before going live: replace placeholders

- [x] Phone / WhatsApp number: +382 67 480 655
- [ ] Opening hours, address wording (`js/i18n.js` → h1d…h3t, address)
- [x] Menu items and prices: real menu added (`js/menu.js`)
- [ ] Farm tour: confirm it's offered, price and times
- [ ] Story text (storyP1, storyP2)
- [ ] **Reviews r1–r3 are samples.** Replace them with real guest reviews before launch.
- [ ] All example photos (stock from Unsplash, free to use) → the restaurant's own photos
- [ ] Logo (`images/logo.svg` is a placeholder shell mark)
