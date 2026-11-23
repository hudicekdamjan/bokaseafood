/* =====================================================================
   BOKA SEAFOOD — behaviour & animation
   No content lives here; edit text in i18n.js and dishes in menu.js.
   ===================================================================== */
(function () {
  'use strict';
  const html = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------------- Language ---------------- */
  /* Each language has its own page: / (English) and /me/ (Montenegrin).
     The page's <html lang> says which one this is; data-root is the path back to the site root. */
  let lang = (html.lang || '').toLowerCase().startsWith('sr') ? 'me' : 'en';
  const ROOT = html.dataset.root || '';
  const L = () => (lang === 'me' ? 1 : 0);
  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || '';

  function applyLang() {
    html.lang = lang === 'me' ? 'sr-Latn-ME' : 'en';
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = t(el.dataset.i18nHtml); if (v) el.innerHTML = v; });
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    renderSignatures(); renderTabs(); renderMenu(false); fillSelects(); fillCountries(); updateWA();
  }
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    location.href = (b.dataset.lang === 'me' ? ROOT + 'me/' : (ROOT || './')) + location.hash;
  }));

  /* ---------------- Contact ---------------- */
  $$('[data-contact="phone"]').forEach((a) => { a.textContent = CONTACT.phoneDisplay; a.href = 'tel:' + CONTACT.phoneLink; });

  /* ---------------- Signature dishes ---------------- */
  function priceHTML(it) {
    const v = typeof it.price === 'number' ? it.price.toFixed(2) + ' €' : it.price;
    return v + (it.perKg ? ' <small>' + t('perKg') + '</small>' : '');
  }
  const metaHTML = (it) => {
    const parts = [it.size && `<span class="size">${it.size[L()]}</span>`, it.desc && it.desc[L()]].filter(Boolean);
    return parts.length ? `<p>${parts.join(' · ')}</p>` : '';
  };
  function renderSignatures() {
    const wrap = $('#signatures');
    const items = MENU.flatMap((c) => c.items).filter((i) => i.signature).slice(0, 6);
    wrap.style.setProperty('--n', items.length);
    wrap.innerHTML = items.map((i) => `
      <article class="dish">
        <div class="dish__plate"><img src="${ROOT + i.img}" alt="${i.name[L()]}" loading="lazy" decoding="async"></div>
        <h3>${i.name[L()]}</h3>
        <p>${[i.size && i.size[L()], i.desc && i.desc[L()]].filter(Boolean).join(' · ')}</p>
        <span class="price">${priceHTML(i)}</span>
      </article>`).join('');
  }

  /* ---------------- Menu tabs ---------------- */
  let active = MENU[0].id;
  function renderTabs() {
    const tabs = $('#menuTabs');
    tabs.innerHTML = MENU.map((c) => `<button class="tab" role="tab" type="button" id="tab-${c.id}" aria-controls="menuPanel" aria-selected="${c.id === active}" tabindex="${c.id === active ? 0 : -1}" data-id="${c.id}">${c.title[L()]}</button>`).join('');
  }
  function renderMenu(animate = true) {
    const cat = MENU.find((c) => c.id === active);
    const panel = $('#menuPanel');
    panel.setAttribute('aria-labelledby', 'tab-' + active);
    panel.innerHTML = (cat.note ? `<p class="menu__catnote">${cat.note[L()]}</p>` : '') + cat.items.map((i) => `
      <div class="mi"><h3>${i.name[L()]}</h3><span class="price">${priceHTML(i)}</span>${metaHTML(i)}</div>`).join('');
    if (animate && hasGsap && !reduce) gsap.from(panel.children, { y: 16, opacity: 0, duration: .55, stagger: .06, ease: 'power3.out' });
  }
  $('#menuTabs').addEventListener('click', (e) => {
    const b = e.target.closest('.tab'); if (!b || b.dataset.id === active) return;
    active = b.dataset.id; renderTabs(); renderMenu(); $('#tab-' + active).focus({ preventScroll: true });
    $('#tab-' + active).scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
  });
  $('#menuTabs').addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const i = MENU.findIndex((c) => c.id === active);
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + MENU.length) % MENU.length;
    active = MENU[n].id; renderTabs(); renderMenu(); $('#tab-' + active).focus();
  });

  /* ---------------- Availability request → WhatsApp ----------------
     The form does NOT book a table. It opens WhatsApp with a ready
     "Do you have a free table?" message to CONTACT.whatsapp (js/i18n.js).
     The green floating button on phones opens WhatsApp with a short question. */
  const waURL = (text) => 'https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent(text);
  function updateWA() { $$('[data-wa]').forEach((a) => { a.href = waURL(t('waMsg')); a.target = '_blank'; a.rel = 'noopener'; }); }

  function fillSelects() {
    const time = $('#f-time'), guests = $('#f-guests');
    if (!time || !guests) return;
    const tv = time.value, gv = guests.value, slots = [];
    for (let h = 11; h <= 19; h++) for (const m of ['00', '30']) slots.push(`${h}:${m}`);   // 11:00 – 19:30
    time.innerHTML = '<option value="">—</option>' + slots.map((x) => `<option>${x}</option>`).join('');
    const word = (n) => n === 1 ? t('guest') : (lang === 'me' && n >= 2 && n <= 4 ? t('guests24') : t('guests'));
    guests.innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1} ${word(i + 1)}</option>`).join('')
      + `<option value="12+">12+ ${t('guests')}</option>`;
    time.value = tv; guests.value = gv || '2';
  }
  /* ---------------- Country dialling codes ----------------
     [ISO code, dialling code, English name, Montenegrin name].
     TOP = shown first under "Most common"; the rest are sorted by name. */
  const TOP = ['ME', 'RS', 'BA', 'HR', 'AL', 'XK', 'MK', 'SI', 'DE', 'GB', 'FR', 'IT', 'AT', 'US', 'RU', 'TR'];
  const COUNTRIES = [
    ['ME','382','Montenegro','Crna Gora'],['RS','381','Serbia','Srbija'],['BA','387','Bosnia and Herzegovina','Bosna i Hercegovina'],
    ['HR','385','Croatia','Hrvatska'],['AL','355','Albania','Albanija'],['XK','383','Kosovo','Kosovo'],
    ['MK','389','North Macedonia','Sjeverna Makedonija'],['SI','386','Slovenia','Slovenija'],['DE','49','Germany','Njemačka'],
    ['GB','44','United Kingdom','Velika Britanija'],['FR','33','France','Francuska'],['IT','39','Italy','Italija'],
    ['AT','43','Austria','Austrija'],['US','1','United States','SAD'],['RU','7','Russia','Rusija'],['TR','90','Turkey','Turska'],
    ['AE','971','United Arab Emirates','Ujedinjeni Arapski Emirati'],['AM','374','Armenia','Jermenija'],['AR','54','Argentina','Argentina'],
    ['AU','61','Australia','Australija'],['AZ','994','Azerbaijan','Azerbejdžan'],['BE','32','Belgium','Belgija'],
    ['BG','359','Bulgaria','Bugarska'],['BR','55','Brazil','Brazil'],['BY','375','Belarus','Bjelorusija'],
    ['CA','1','Canada','Kanada'],['CH','41','Switzerland','Švajcarska'],['CN','86','China','Kina'],['CY','357','Cyprus','Kipar'],
    ['CZ','420','Czechia','Češka'],['DK','45','Denmark','Danska'],['EE','372','Estonia','Estonija'],['EG','20','Egypt','Egipat'],
    ['ES','34','Spain','Španija'],['FI','358','Finland','Finska'],['GE','995','Georgia','Gruzija'],['GR','30','Greece','Grčka'],
    ['HU','36','Hungary','Mađarska'],['IE','353','Ireland','Irska'],['IL','972','Israel','Izrael'],['IN','91','India','Indija'],
    ['IS','354','Iceland','Island'],['JP','81','Japan','Japan'],['KR','82','South Korea','Južna Koreja'],['KZ','7','Kazakhstan','Kazahstan'],
    ['LT','370','Lithuania','Litvanija'],['LU','352','Luxembourg','Luksemburg'],['LV','371','Latvia','Letonija'],
    ['MD','373','Moldova','Moldavija'],['MT','356','Malta','Malta'],['MX','52','Mexico','Meksiko'],['NL','31','Netherlands','Holandija'],
    ['NO','47','Norway','Norveška'],['NZ','64','New Zealand','Novi Zeland'],['PL','48','Poland','Poljska'],['PT','351','Portugal','Portugalija'],
    ['RO','40','Romania','Rumunija'],['SA','966','Saudi Arabia','Saudijska Arabija'],['SE','46','Sweden','Švedska'],
    ['SG','65','Singapore','Singapur'],['SK','421','Slovakia','Slovačka'],['TH','66','Thailand','Tajland'],['UA','380','Ukraine','Ukrajina'],
    ['ZA','27','South Africa','Južna Afrika']
  ];
  const byIso = Object.fromEntries(COUNTRIES.map((c) => [c[0], c]));

  /* Pre-select the visitor's country from the browser language (fallback: Montenegro) */
  function guessCountry() {
    const langMap = { sr: 'RS', hr: 'HR', bs: 'BA', sq: 'AL', mk: 'MK', sl: 'SI', de: 'DE', fr: 'FR', it: 'IT', ru: 'RU', uk: 'UA',
      pl: 'PL', tr: 'TR', nl: 'NL', he: 'IL', cs: 'CZ', sk: 'SK', hu: 'HU', ro: 'RO', bg: 'BG', el: 'GR', es: 'ES', pt: 'PT',
      sv: 'SE', da: 'DK', nb: 'NO', no: 'NO', fi: 'FI', ja: 'JP', ko: 'KR', zh: 'CN' };
    for (const l of (navigator.languages || [navigator.language || ''])) {
      const [code, region] = l.split('-');
      if (code === 'cnr' || region === 'ME') return 'ME';
      if (region && byIso[region.toUpperCase()] && l !== 'en-US') return region.toUpperCase();
      if (langMap[code]) return langMap[code];
    }
    return 'ME';
  }

  function fillCountries() {
    const sel = $('#f-cc'); if (!sel) return;
    const keep = sel.value || guessCountry();
    const name = (c) => c[L() + 2];
    const opt = (c) => `<option value="${c[0]}">${name(c)} (+${c[1]})</option>`;
    const rest = COUNTRIES.filter((c) => !TOP.includes(c[0]))
      .sort((a, b) => name(a).localeCompare(name(b), lang === 'me' ? 'sr-Latn' : 'en'));
    sel.innerHTML = `<optgroup label="${t('ccTop')}">${TOP.map((i) => opt(byIso[i])).join('')}</optgroup>`
      + `<optgroup label="${t('ccAll')}">${rest.map(opt).join('')}</optgroup>`;
    sel.value = keep;
    sel.setAttribute('aria-label', t('fCC'));
    showCountry();
  }
  function showCountry() {
    const c = byIso[$('#f-cc').value] || byIso.ME;
    $('#ccIso').textContent = c[0]; $('#ccDial').textContent = '+' + c[1];
  }
  $('#f-cc') && $('#f-cc').addEventListener('change', showCountry);

  /* Combine country code + number. If the guest typed a full international
     number (+44… or 0044…), keep it as typed. Drops the leading 0 of local numbers. */
  function fullPhone(d) {
    const raw = (d.phone || '').trim();
    if (/^(\+|00)/.test(raw)) return raw.replace(/^00/, '+');
    const c = byIso[d.cc] || byIso.ME;
    return '+' + c[1] + ' ' + raw.replace(/^0+/, '');
  }

  const form = $('#availForm');
  if (form) {
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    $('#f-date').min = today;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = $('#formError');
      let bad = null;
      ['name', 'phone', 'date', 'time'].forEach((n) => {
        const el = form.elements[n], ok = el.value.trim() !== '';
        el.setAttribute('aria-invalid', String(!ok)); if (!ok && !bad) bad = el;
      });
      if (bad) { err.hidden = false; bad.focus(); return; }
      err.hidden = true;
      const d = Object.fromEntries(new FormData(form));
      const [y, mo, da] = d.date.split('-');
      const lines = [
        t('waAsk'), '',
        `${t('fDate')}: ${da}.${mo}.${y}.`,
        `${t('fTime')}: ${d.time}`,
        `${t('fGuests')}: ${d.guests}`,
        `${t('fName')}: ${d.name}`,
        `${t('fPhone')}: ${fullPhone(d)}`
      ];
      if (d.tour) lines.push(t('waTour'));
      if (d.note && d.note.trim()) lines.push(`${t('waNote')}: ${d.note.trim()}`);
      window.open(waURL(lines.join('\n')), '_blank', 'noopener');
      $('#formDone').hidden = false;
    });
    form.addEventListener('input', (e) => { if (e.target.value) e.target.removeAttribute('aria-invalid'); });
  }

  /* Hide the floating WhatsApp button while the form is on screen */
  /* Floating WhatsApp button: always visible, only hidden while the mobile menu is open */
  function updateBar() {}

  /* ---------------- Nav: scrolled state, hide on scroll down ---------------- */
  const nav = $('#nav');
  let lastY = 0, ticking = false;
  function onScroll() {
    const y = scrollY;
    nav.classList.add('is-scrolled'); // header is always light so the logo reads well
    updateBar();
    lastY = y; ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------------- Header stays visible; highlight the current section ---------------- */
  const navLinks = $$('.nav__links a, .drawer nav a:not(.btn)');
  const sections = ['farm', 'menu', 'tour', 'gallery', 'visit'].map((id) => document.getElementById(id)).filter(Boolean);
  let secTick = false;
  function markSection() {
    secTick = false;
    const line = innerHeight * .35;
    let current = '';
    sections.forEach((sec) => { const r = sec.getBoundingClientRect(); if (r.top <= line && r.bottom > line) current = sec.id; });
    navLinks.forEach((a) => {
      const on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => { if (!secTick) { secTick = true; requestAnimationFrame(markSection); } }, { passive: true });
  markSection();

  /* ---------------- Mobile drawer ---------------- */
  const burger = $('.burger'), drawer = $('#drawer');
  function toggleDrawer(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    updateBar();
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && hasGsap && !reduce) gsap.fromTo($$('a', drawer), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .6, delay: .2, ease: 'power3.out' });
  }
  burger.addEventListener('click', () => toggleDrawer(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', drawer).forEach((a) => a.addEventListener('click', () => toggleDrawer(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) toggleDrawer(false); });

  /* ---------------- Reviews rotator ---------------- */
  const quotes = $$('.quote'), dots = $('.dots');
  let qi = 0, qTimer;
  dots.innerHTML = quotes.map((_, i) => `<button type="button" role="tab" aria-label="Review ${i + 1}" aria-selected="${i === 0}"></button>`).join('');
  function showQuote(i) {
    qi = i;
    quotes.forEach((q, n) => q.classList.toggle('is-active', n === i));
    $$('button', dots).forEach((b, n) => b.setAttribute('aria-selected', String(n === i)));
  }
  function autoplay() { clearInterval(qTimer); if (!reduce) qTimer = setInterval(() => showQuote((qi + 1) % quotes.length), 6500); }
  dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; showQuote($$('button', dots).indexOf(b)); autoplay(); });
  autoplay();

  /* ---------------- Lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('img', lb), gItems = $$('.g');
  let li = 0, lastFocus;
  function openLB(i) {
    li = i; const src = $('img', gItems[i]);
    lbImg.src = src.currentSrc || src.src; lbImg.alt = src.alt;
    lastFocus = document.activeElement;
    lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-open'));
    document.body.style.overflow = 'hidden'; $('.lightbox__close', lb).focus();
  }
  function closeLB() {
    lb.classList.remove('is-open'); document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; }, 350); lastFocus && lastFocus.focus();
  }
  const step = (d) => openLB((li + d + gItems.length) % gItems.length);
  gItems.forEach((g, i) => g.addEventListener('click', () => openLB(i)));
  $('.lightbox__close', lb).addEventListener('click', closeLB);
  $('.lightbox__prev', lb).addEventListener('click', () => step(-1));
  $('.lightbox__next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  let tx = 0;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });

  /* ---------------- Story video: load and play only when on screen ---------------- */
  $$('video.story__video, video[data-autoplay]').forEach((v) => {
    if (reduce) { if (!v.hasAttribute('data-autoplay')) v.controls = true; return; }   // reduced motion: poster only
    new IntersectionObserver((en) => {
      if (en[0].isIntersecting) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } else v.pause();
    }, { threshold: .25 }).observe(v);
  });

  /* ---------------- Map: load only when near the viewport ---------------- */
  const map = $('.visit__map iframe');
  new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { map.src = map.dataset.src; o.disconnect(); } }, { rootMargin: '400px' }).observe(map);

  $('#year').textContent = new Date().getFullYear();

  /* ---------------- Initial render ---------------- */
  applyLang();

  /* =====================================================================
     ANIMATIONS (GSAP + ScrollTrigger)
     Only transform / opacity / clip-path are animated, so it stays smooth
     on phones. Everything is skipped when reduced motion is requested.
     ===================================================================== */
  if (!hasGsap || reduce) { html.classList.remove('anim'); return; }
  window.__animReady = true;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  const desktop = '(min-width: 900px)';

  // Hero intro sequence
  const isDesk = matchMedia(desktop).matches;
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .to('.hero__media', { clipPath: 'inset(0 0 0 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
    .to('.hero__media img', { scale: 1, duration: 2.4 }, .2)
    .to('.hero__title .line > span', { y: 0, duration: 1.3, stagger: .1 }, isDesk ? .55 : .35)
    .to('.reveal-hero', { y: 0, opacity: 1, duration: 1, stagger: .12 }, isDesk ? .95 : .75)
    .to('.nav', { opacity: 1, duration: .8, ease: 'power2.out' }, isDesk ? 1 : .6);

  // Hero image drifts slightly as you leave
  gsap.to('.hero__media img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Generic fade-up reveals (batched for performance)
  /* Scroll reveals: on every scroll frame we check the elements that are still
     hidden. Anything on screen animates in; anything above the screen (after a
     jump via menu links or "Check availability") is shown at once.
     Positions are measured live, so content can never get stuck invisible. */
  const revealText = (el) => gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', overwrite: true });
  const revealClip = (el) => {
    const img = $('img', el);
    const tl = gsap.timeline();
    tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' });
    if (img) tl.from(img, { scale: 1.25, duration: 1.8, ease: 'expo.out', clearProps: 'scale' }, .15);
  };
  const showNow = (el) => gsap.set(el, el.classList.contains('reveal-clip') ? { clipPath: 'inset(0% 0 0 0)' } : { y: 0, opacity: 1 });
  const pending = new Set($$('.reveal, .reveal-clip'));
  let rvTick = false;
  function checkReveals() {
    rvTick = false;
    let i = 0; const vh = innerHeight;
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || (r.top < 0 && r.bottom < vh * .25)) { showNow(el); pending.delete(el); }
      else if (r.top < vh * .92) {
        pending.delete(el);
        gsap.delayedCall(i++ * .1, () => (el.classList.contains('reveal-clip') ? revealClip(el) : revealText(el)));
      }
    });
    if (!pending.size) { removeEventListener('scroll', onRevealScroll); removeEventListener('resize', onRevealScroll); }
  }
  function onRevealScroll() { if (!rvTick) { rvTick = true; requestAnimationFrame(checkReveals); } }
  addEventListener('scroll', onRevealScroll, { passive: true });
  addEventListener('resize', onRevealScroll);
  checkReveals();

  // Signature plates: "set down on the table"
  ScrollTrigger.create({
    trigger: '#signatures', start: 'top 85%', once: true,
    onEnter: () => {
      gsap.from('.dish__plate', { rotate: -35, scale: .85, opacity: 0, duration: 1.4, stagger: .09, ease: 'expo.out' });
      gsap.from('.dish h3, .dish p, .dish .price', { y: 14, opacity: 0, duration: .9, stagger: .03, delay: .3, ease: 'power3.out' });
    }
  });

  // Parallax only on larger screens (keeps phones light)
  mm.add(desktop, () => {
    $$('.parallax').forEach((el) => {
      const s = parseFloat(el.dataset.speed || .08);
      gsap.fromTo($('img, video', el), { yPercent: -s * 60 }, { yPercent: s * 60, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.parallax-img').forEach((img) => {
      gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
