/* =====================================================================
   BOKA SEAFOOD: build the two language pages for Google
   ---------------------------------------------------------------------
   Run after changing text (js/i18n.js), the menu (js/menu.js) or the
   page layout (src/template.html):

       node tools/build.js

   It writes:
     index.html      English page   (https://<domain>/)
     me/index.html   Montenegrin    (https://<domain>/me/)
     sitemap.xml, robots.txt

   Every text, the menu and the restaurant details are written straight
   into the HTML, so Google can read both languages without running
   JavaScript. The site still works the same in the browser.
   ===================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* ---- SITE SETTINGS: change SITE to the real domain before going live ---- */
const SITE = 'https://www.bokaseafood.me';        // ← your domain, no trailing slash
const RESTAURANT = {
  name: 'Boka Seafood',
  phone: '+382 67 480 655',
  instagram: 'https://www.instagram.com/bokaseafood/',
  maps: 'https://maps.app.goo.gl/kqeoGZo3ukXcj61r6',
  lat: 42.5001376, lng: 18.6924531,
  locality: 'Risan', region: 'Kotor', country: 'ME',
  // Opening hours for Google: fill in ONLY when confirmed, e.g. ['Mo-Su 12:00-23:00']
  openingHours: []
};

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(read('js/i18n.js'), ctx); vm.runInContext(read('js/menu.js'), ctx);
const I18N = ctx.window.I18N, MENU = ctx.window.MENU, CONTACT = ctx.window.CONTACT;
const template = read('src/template.html');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');
const price = (it) => (typeof it.price === 'number' ? it.price.toFixed(2) + ' €' : it.price);

function build(lang) {
  const T = (k) => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || '';
  const L = lang === 'me' ? 1 : 0;
  const root = lang === 'me' ? '../' : '';
  const url = SITE + (lang === 'me' ? '/me/' : '/');
  let h = template;

  /* 1. texts */
  h = h.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (m, open, tag, key, inner, close) => (T(key) ? open + esc(T(key)) + close : m));
  h = h.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (m, open, tag, key, inner, close) => (T(key) ? open + T(key) + close : m));

  /* 2. menu: featured dishes, category tabs, first category */
  const sig = MENU.flatMap((c) => c.items).filter((i) => i.signature).slice(0, 6);
  h = h.replace(/(<div class="dishes" id="signatures">)[\s\S]*?(<\/div>)/, (m, a, b) => a + sig.map((i) =>
    `<article class="dish"><div class="dish__plate"><img src="${root}${i.img}" alt="${attr(i.name[L])}" loading="lazy" decoding="async"></div>` +
    `<h3>${esc(i.name[L])}</h3><p>${esc([i.size && i.size[L], i.desc && i.desc[L]].filter(Boolean).join(' · '))}</p><span class="price">${price(i)}</span></article>`).join('') + b);
  h = h.replace(/(<div class="tabs"[^>]*id="menuTabs">)(<\/div>)/, (m, a, b) => a + MENU.map((c, n) =>
    `<button class="tab" role="tab" type="button" id="tab-${c.id}" aria-controls="menuPanel" aria-selected="${n === 0}" tabindex="${n === 0 ? 0 : -1}" data-id="${c.id}">${esc(c.title[L])}</button>`).join('') + b);
  const first = MENU[0];
  h = h.replace(/(<div class="menu__panel" id="menuPanel"[^>]*>)(<\/div>)/, (m, a, b) => a +
    (first.note ? `<p class="menu__catnote">${esc(first.note[L])}</p>` : '') + first.items.map((i) => {
      const meta = [i.size && `<span class="size">${esc(i.size[L])}</span>`, i.desc && esc(i.desc[L])].filter(Boolean);
      return `<div class="mi"><h3>${esc(i.name[L])}</h3><span class="price">${price(i)}</span>${meta.length ? `<p>${meta.join(' · ')}</p>` : ''}</div>`;
    }).join('') + b);

  /* 3. language buttons, html lang, paths */
  h = h.replace('<html lang="en" class="no-js">', `<html lang="${lang === 'me' ? 'sr-Latn-ME' : 'en'}" class="no-js" data-root="${root}">`);
  h = h.replace(/<button type="button" data-lang="(en|me)" aria-pressed="(true|false)">/g,
    (m, l) => `<button type="button" data-lang="${l}" aria-pressed="${l === lang}">`);
  h = h.replace(/(<a class="skip" href="#main"[^>]*>)/, '$1');
  if (root) h = h.replace(/(\s(?:src|href|content|data-src|poster))="(images\/|css\/|js\/)/g, `$1="${root}$2`);
  h = h.replace(/href="tel:[^"]*" data-contact="phone">[^<]*</g, `href="tel:${CONTACT.phoneLink}" data-contact="phone">${esc(CONTACT.phoneDisplay)}<`);

  /* 4. head: title, description, canonical, languages, social, structured data */
  const title = T('seoTitle'), desc = T('seoDesc');
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${attr(desc)}">`);
  h = h.replace(/\s*<meta property="og:[^>]*>/g, '');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': SITE + '/#restaurant',
    name: RESTAURANT.name,
    description: desc,
    url,
    image: [SITE + '/images/boka-hero.jpg', SITE + '/images/boka-farm-aerial.jpg', SITE + '/images/boka-mussels.jpg', SITE + '/images/boka-boat.jpg'],
    logo: SITE + '/images/logo.png',
    telephone: RESTAURANT.phone,
    servesCuisine: ['Seafood', 'Mediterranean', 'Montenegrin'],
    priceRange: '€€',
    paymentAccepted: 'Cash',
    currenciesAccepted: 'EUR',
    acceptsReservations: true,
    address: { '@type': 'PostalAddress', addressLocality: RESTAURANT.locality, addressRegion: RESTAURANT.region, addressCountry: RESTAURANT.country },
    geo: { '@type': 'GeoCoordinates', latitude: RESTAURANT.lat, longitude: RESTAURANT.lng },
    hasMap: RESTAURANT.maps,
    areaServed: ['Risan', 'Perast', 'Kotor', 'Bay of Kotor'],
    sameAs: [RESTAURANT.instagram],
    hasMenu: {
      '@type': 'Menu', name: L ? 'Meni' : 'Menu', url: url + '#menu', inLanguage: lang === 'me' ? 'sr-Latn-ME' : 'en',
      hasMenuSection: MENU.map((c) => ({
        '@type': 'MenuSection', name: c.title[L],
        hasMenuItem: c.items.map((i) => ({
          '@type': 'MenuItem', name: i.name[L] + (i.size ? ' (' + i.size[L] + ')' : ''),
          ...(i.desc ? { description: i.desc[L] } : {}),
          offers: { '@type': 'Offer', price: typeof i.price === 'number' ? i.price.toFixed(2) : String(i.price), priceCurrency: 'EUR' }
        }))
      }))
    }
  };
  if (RESTAURANT.openingHours.length) ld.openingHours = RESTAURANT.openingHours;
  const head = `
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${SITE}/">
  <link rel="alternate" hreflang="sr-ME" href="${SITE}/me/">
  <link rel="alternate" hreflang="x-default" href="${SITE}/">
  <meta property="og:type" content="restaurant">
  <meta property="og:site_name" content="Boka Seafood">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/images/boka-hero.jpg">
  <meta property="og:locale" content="${lang === 'me' ? 'sr_ME' : 'en_GB'}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="apple-touch-icon" href="${root}images/logo.png">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
`;
  h = h.replace(/(<link rel="icon"[^>]*>)/, `$1${head}`);
  return h;
}

fs.writeFileSync(path.join(ROOT, 'index.html'), build('en'));
fs.mkdirSync(path.join(ROOT, 'me'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'me/index.html'), build('me'));
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['/', '/me/'].map((u) => `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="sr-ME" href="${SITE}/me/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /src/\nDisallow: /tools/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('Built index.html, me/index.html, sitemap.xml, robots.txt for', SITE);
