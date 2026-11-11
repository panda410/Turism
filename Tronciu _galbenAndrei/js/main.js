/* ==========================================================
   VINĂRIA TRONCIU — script principal
   Toate fotografiile și datele site-ului sunt citite din
   fișierul data/date.json (mica noastră „bază de date”).
   ========================================================== */
'use strict';

const FISIER_DATE = 'data/date.json';

const $ = (sel, parinte = document) => parinte.querySelector(sel);
const $$ = (sel, parinte = document) => [...parinte.querySelectorAll(sel)];

/* ---------- Pictograme SVG ---------- */
const CAI = {
  pahar: '<path d="M7 2h10l-.5 6.5a4.5 4.5 0 0 1-9 0L7 2Z"/><path d="M7.3 6h9.4"/><path d="M12 13v8"/><path d="M8 21h8"/>',
  struguri: '<circle cx="9" cy="9.5" r="2"/><circle cx="14" cy="9.5" r="2"/><circle cx="6.8" cy="13.5" r="2"/><circle cx="11.5" cy="13.5" r="2"/><circle cx="16.2" cy="13.5" r="2"/><circle cx="9.2" cy="17.5" r="2"/><circle cx="13.8" cy="17.5" r="2"/><path d="M11.5 7.5V5c0-1.5 1.5-3 4-3"/>',
  harta: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
  casa: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  frunza: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
  distanta: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  ceas: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  persoane: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  telefon: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
  email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
  sageata: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  inapoi: '<path d="m15 18-6-6 6-6"/>',
  inainte: '<path d="m9 18 6-6-6-6"/>',
  inchide: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>'
};
const icon = (nume) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CAI[nume] || ''}</svg>`;


/* ---------- Utilitare ---------- */
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const numar = (n) => Number(n).toLocaleString('ro-RO');
const lei = (n) => `${numar(n)} lei`;
const euro = (n) => `${Number(n).toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

/* ---------- Imagini din JSON ----------
   Fiecare fotografie din date.json are: id, src, titlu, format.
   Dacă fișierul din „src” nu există încă în folderul imagini/,
   se desenează automat o ilustrație temporară pe tema vinăriei
   (după câmpul „cauta”), până pui fotografiile tale reale. */
const FORMATE = { peisaj: [1200, 800], clasic: [1200, 900], portret: [800, 1100], patrat: [900, 900], afis: [800, 1200], panorama: [1200, 600] };

const PALETE = [
  { cer: ['#f7d29a', '#e08a5f'], deal: '#7a1f35' },   // apus
  { cer: ['#fde6bd', '#e9ad6f'], deal: '#5e2a3a' },   // după-amiază aurie
  { cer: ['#e7c9d6', '#b56a83'], deal: '#4b1121' },   // amurg
  { cer: ['#fff1d6', '#f1c27c'], deal: '#5a6b38' }    // dimineață în vie
];

// generator de numere „aleatoare” stabile, ca ilustrația să fie mereu aceeași
function aleator(text) {
  let s = [...text].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function ilustratie(id, format, cauta = '') {
  const [w, h] = FORMATE[format] || FORMATE.peisaj;
  const r = aleator(id);
  const p = PALETE[Math.floor(r() * PALETE.length)];
  const f = (n) => n.toFixed(1);
  let scena;

  if (/cellar|barrel|bottle|juice/.test(cauta)) {
    // beciul cu butoaie
    const raza = Math.min(w, h) * 0.13;
    const butoaie = [-1.1, 0, 1.1].map((k) => {
      const cx = w / 2 + k * raza * 2.1, cy = h * 0.72;
      return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(raza)}" fill="#7b3f24" stroke="#c9973f" stroke-width="${f(raza * 0.08)}"/>
        <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(raza * 0.62)}" fill="none" stroke="#5a2a17" stroke-width="${f(raza * 0.05)}"/>
        <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(raza * 0.12)}" fill="#c9973f"/>`;
    }).join('');
    scena = `<rect width="${w}" height="${h}" fill="url(#beci)"/>
      <path d="M${f(w * .12)} ${h} V${f(h * .42)} A${f(w * .38)} ${f(h * .3)} 0 0 1 ${f(w * .88)} ${f(h * .42)} V${h}" fill="#3a0d18" stroke="#c9973f" stroke-opacity=".35" stroke-width="${f(w * .006)}"/>
      <circle cx="${f(w / 2)}" cy="${f(h * .3)}" r="${f(h * .22)}" fill="#f3c06b" opacity=".12"/>
      <circle cx="${f(w / 2)}" cy="${f(h * .3)}" r="${f(h * .03)}" fill="#ffe2a0"/>
      ${butoaie}
      <rect y="${f(h * .86)}" width="${w}" height="${f(h * .14)}" fill="#2a0912"/>`;
  } else if (/glass|tasting|cheese|red,wine|wine,sunset/.test(cauta)) {
    // pahare de vin la apus
    const pahar = (cx, s) => {
      const top = h * 0.42, lat = w * 0.075 * s;
      return `<path d="M${f(cx - lat)} ${f(top)} h${f(lat * 2)} l-${f(lat * .08)} ${f(lat * 1.1)} a${f(lat * .92)} ${f(lat * .92)} 0 0 1 -${f(lat * 1.84)} 0 Z" fill="#ffffff" fill-opacity=".18" stroke="#fff4dc" stroke-width="${f(lat * .06)}"/>
        <path d="M${f(cx - lat * .93)} ${f(top + lat * .55)} h${f(lat * 1.86)} l-${f(lat * .04)} ${f(lat * .55)} a${f(lat * .92)} ${f(lat * .92)} 0 0 1 -${f(lat * 1.78)} 0 Z" fill="#8e1e36"/>
        <path d="M${f(cx)} ${f(top + lat * 2)} V${f(h * .84)} M${f(cx - lat * .6)} ${f(h * .84)} h${f(lat * 1.2)}" stroke="#fff4dc" stroke-width="${f(lat * .07)}" stroke-linecap="round"/>`;
    };
    const bule = Array.from({ length: 9 }, () =>
      `<circle cx="${f(r() * w)}" cy="${f(r() * h * .6)}" r="${f(h * (.02 + r() * .05))}" fill="#fff3d6" opacity="${(.1 + r() * .2).toFixed(2)}"/>`).join('');
    scena = `<rect width="${w}" height="${h}" fill="url(#cer)"/>${bule}
      <rect y="${f(h * .84)}" width="${w}" height="${f(h * .16)}" fill="${p.deal}"/>
      ${pahar(w * .4, 1)}${pahar(w * .62, .85)}`;
  } else {
    // peisaj cu dealuri și rânduri de vie
    const soareX = w * (.2 + r() * .6), soareY = h * (.24 + r() * .12);
    const randuri = Array.from({ length: 7 }, (_, i) => {
      const y = h * (.8 + i * .04);
      return `<path d="M-20 ${f(y)} Q${f(w * (.3 + r() * .4))} ${f(y - h * .09)} ${w + 20} ${f(y - h * .02)}" stroke="#ffe6b0" stroke-opacity=".38" stroke-width="${f(h * .009)}" stroke-dasharray="${f(h * .006)} ${f(h * .022)}" stroke-linecap="round" fill="none"/>`;
    }).join('');
    const casa = /church/.test(cauta)
      ? (() => {
          // biserică: corp, acoperiș, turlă cu cupolă și cruce
          const x = w * .58, y = h * .64, s = Math.min(w, h) * .1;
          return `<g fill="#3a0d18">
            <rect x="${f(x)}" y="${f(y - s * 1.1)}" width="${f(s * 2)}" height="${f(s * 1.1)}"/>
            <path d="M${f(x - s * .15)} ${f(y - s * 1.1)} L${f(x + s)} ${f(y - s * 1.8)} L${f(x + s * 2.15)} ${f(y - s * 1.1)} Z"/>
            <rect x="${f(x + s * .7)}" y="${f(y - s * 2.6)}" width="${f(s * .6)}" height="${f(s * 1.2)}"/>
            <circle cx="${f(x + s)}" cy="${f(y - s * 2.7)}" r="${f(s * .36)}"/>
            <path d="M${f(x + s)} ${f(y - s * 3.5)} v${f(s * .5)} M${f(x + s * .82)} ${f(y - s * 3.3)} h${f(s * .36)}" stroke="#3a0d18" stroke-width="${f(s * .08)}"/>
          </g>
          <rect x="${f(x + s * .85)}" y="${f(y - s * .7)}" width="${f(s * .3)}" height="${f(s * .7)}" rx="${f(s * .15)}" fill="#ffd27a"/>`;
        })()
      : /house|cottage|farmhouse|village|well|bedroom|countryside/.test(cauta)
      ? (() => {
          const x = w * (.55 + r() * .2), y = h * .6, s = Math.min(w, h) * .09;
          return `<path d="M${f(x)} ${f(y)} h${f(s * 1.6)} v-${f(s)} l-${f(s * .8)} -${f(s * .7)} l-${f(s * .8)} ${f(s * .7)} Z" fill="#3a0d18"/>
            <rect x="${f(x + s * .55)}" y="${f(y - s * .65)}" width="${f(s * .5)}" height="${f(s * .4)}" fill="#ffd27a"/>`;
        })()
      : '';
    scena = `<rect width="${w}" height="${h}" fill="url(#cer)"/>
      <circle cx="${f(soareX)}" cy="${f(soareY)}" r="${f(h * .2)}" fill="#fff3d6" opacity=".25"/>
      <circle cx="${f(soareX)}" cy="${f(soareY)}" r="${f(h * .085)}" fill="#fff3d6" opacity=".95"/>
      <path d="M0 ${f(h * .55)} Q${f(w * .3)} ${f(h * (.36 + r() * .1))} ${f(w * .6)} ${f(h * .54)} T${w} ${f(h * .5)} V${h} H0Z" fill="${p.deal}" opacity=".35"/>
      <path d="M0 ${f(h * .68)} Q${f(w * .35)} ${f(h * (.5 + r() * .08))} ${f(w * .7)} ${f(h * .66)} T${w} ${f(h * .62)} V${h} H0Z" fill="${p.deal}" opacity=".62"/>
      ${casa}
      <path d="M0 ${f(h * .8)} Q${f(w * .45)} ${f(h * .66)} ${w} ${f(h * .78)} V${h} H0Z" fill="${p.deal}"/>
      ${randuri}`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <defs>
      <linearGradient id="cer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.cer[0]}"/><stop offset="1" stop-color="${p.cer[1]}"/></linearGradient>
      <radialGradient id="beci" cx=".5" cy=".3" r=".9"><stop offset="0" stop-color="#6b2133"/><stop offset="1" stop-color="#1e060c"/></radialGradient>
    </defs>${scena}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// dacă poza lipsește, punem ilustrația în locul ei (o singură dată)
document.addEventListener('error', (e) => {
  const img = e.target;
  if (img.tagName !== 'IMG' || !img.dataset.ph || img.dataset.inlocuita) return;
  img.dataset.inlocuita = '1';
  const [id, format, cauta] = img.dataset.ph.split('|');
  img.src = ilustratie(id, format, cauta);
}, true);

const datePh = (foto) => esc(`${foto.id}|${foto.format || 'peisaj'}|${foto.cauta || ''}`);

function imagine(foto, clasa = '', lazy = true) {
  return `<img src="${esc(foto.src)}" alt="${esc(foto.titlu)}" class="${clasa}"${lazy ? ' loading="lazy"' : ''} data-ph="${datePh(foto)}">`;
}

/* ==========================================================
   PORNIRE
   ========================================================== */
document.addEventListener('DOMContentLoaded', pornire);

async function pornire() {
  initAntet();
  const inceput = performance.now();

  try {
    const date = await incarcaDate();

    completeazaSite(date.site);
    randeazaBanner(date);

    const pagini = { acasa: paginaAcasa, trasee: paginaTrasee, galerie: paginaGalerie, cazare: paginaCazare, contact: paginaContact };
    const randeaza = pagini[document.body.dataset.page];
    if (randeaza) randeaza(date);
  } catch (eroare) {
    console.error('Nu am putut încărca datele:', eroare);
    arataEroareDate();
  }

  initReveal();
  initContoare();
  initParallax();

  // preloader-ul stă minim 0,9 s, ca să se vadă paharul umplându-se
  const asteapta = Math.max(0, 900 - (performance.now() - inceput));
  setTimeout(() => document.body.classList.add('loaded'), asteapta);
}

/* ---------- Încărcarea bazei de date ----------
   1. Dacă site-ul rulează printr-un server (Live Server sau online),
      citim direct fișierul data/date.json.
   2. Dacă site-ul e deschis cu dublu-click (adresă file://), browserul
      nu permite citirea fișierelor JSON, așa că folosim copia lor din
      data/date.js (generată din date.json cu actualizeaza-date.bat). */
async function incarcaDate() {
  if (location.protocol !== 'file:') {
    try {
      const raspuns = await fetch(FISIER_DATE, { cache: 'no-cache' });
      if (raspuns.ok) return await raspuns.json();
    } catch (e) {
      console.warn('date.json nu a putut fi citit, folosesc data/date.js', e);
    }
  }
  if (window.DATE_TRONCIU) return window.DATE_TRONCIU;
  throw new Error('Nu există nici date.json accesibil, nici data/date.js');
}

/* ---------- Antet, meniu, progres ---------- */
function initAntet() {
  const antet = $('.header');
  const bara = $('.scroll-progress');
  const sus = $('.to-top');

  const laDerulare = () => {
    const y = window.scrollY;
    antet.classList.toggle('scrolled', y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bara) bara.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (sus) sus.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', laDerulare, { passive: true });
  laDerulare();

  if (sus) sus.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const burger = $('.burger');
  burger.addEventListener('click', () => {
    const deschis = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', deschis);
  });
  $$('.nav a').forEach((a) => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  const pagina = document.body.dataset.page;
  $$('[data-link]').forEach((a) => a.classList.toggle('active', a.dataset.link === pagina));
}

/* ---------- Date generale (nume, telefon, e-mail) ---------- */
function completeazaSite(site) {
  $$('[data-site]').forEach((el) => {
    const valoare = site[el.dataset.site];
    if (valoare) el.textContent = valoare;
  });
  $$('[data-tel]').forEach((a) => (a.href = 'tel:' + site.telefon.replace(/\s/g, '')));
  $$('[data-mail]').forEach((a) => (a.href = 'mailto:' + site.email));
  $$('[data-fb]').forEach((a) => (a.href = site.facebook));
  $$('[data-an]').forEach((el) => (el.textContent = new Date().getFullYear()));
  if (site.logo) $$('[data-logo]').forEach((el) => (el.innerHTML = imagine(site.logo)));
}

function randeazaBanner(date) {
  const fundal = $('.page-hero__bg');
  const foto = date.pagini && date.pagini[document.body.dataset.page];
  if (fundal && foto) fundal.innerHTML = imagine(foto, '', false);
}

/* ==========================================================
   PAGINA: ACASĂ
   ========================================================== */
function paginaAcasa(date) {
  // 1. Videoclipul din hero (fotografia „poster” apare până pornește video-ul)
  const h = date.hero;
  // fundal: fotografia + o „pânză” pe care desenăm videoclipul mărit și estompat
  $('#heroMedia').innerHTML = `
    ${imagine(h.poster, 'hero__poster', false)}
    <canvas class="hero__blur" width="160" height="90" aria-hidden="true"></canvas>`;
  $('#heroFilm').innerHTML = `
    <video class="hero__video" autoplay muted loop playsinline preload="auto" poster="${esc(h.poster.src)}" aria-label="${esc(h.titlu)}">
      <source src="${esc(h.video)}" type="video/mp4">
    </video>
    <figcaption class="hero__film-tag"><span></span>${esc(h.eticheta || 'Video')}</figcaption>`;
  $('#heroCaption').textContent = h.titlu;
  initVideo();

  imparteLitere($('.hero__title'));
  creeazaBule($('#bubbles'), 18);

  // 2. Despre — colaj de fotografii
  $('#collage').insertAdjacentHTML('afterbegin', date.despre.imagini.map((f, i) =>
    `<figure class="collage__item collage__item--${i + 1} reveal reveal--zoom" style="--d:${i * 0.18}s">${imagine(f)}</figure>`).join(''));
  $('#despreText').innerHTML = date.despre.paragrafe.map((p) => `<p>${esc(p)}</p>`).join('');
  $('#despreSemnatura').textContent = date.despre.semnatura;

  // 3. Cifrele vinăriei (numerele „cresc” când apar pe ecran)
  $('#stats').innerHTML = date.cifre.map((c, i) => `
    <div class="stat reveal" style="--d:${i * 0.1}s">
      <strong><span class="counter" data-tinta="${c.valoare}" data-start="${c.start || 0}" data-grupare="${c.grupare !== false}">${c.start || 0}</span>${c.sufix || ''}</strong>
      <span>${esc(c.eticheta)}</span>
    </div>`).join('');

  // 3b. Citatul fondatorului
  const citat = date.citat;
  $('#citat').innerHTML = `
    <figure class="quote__photo reveal reveal--zoom">${imagine(citat.imagine)}</figure>
    <blockquote class="quote__text reveal reveal--right" style="--d:.15s">
      <p>${esc(citat.text)}</p>
      <footer><strong>${esc(citat.autor)}</strong><span>${esc(citat.rol)}</span></footer>
    </blockquote>`;

  // 3c. Vinurile din portofoliu, grupate pe culori
  const grup = (culoare, titlu) => `
    <div class="wines__group">
      <h3 class="wines__title reveal">${titlu}</h3>
      <div class="wines__list">
        ${date.vinuri.filter((v) => v.culoare === culoare).map((v, i) => `
          <article class="wine wine--${v.culoare} reveal" style="--d:${i * 0.12}s">
            ${paharSvg()}
            <span class="wine__type">${esc(v.tip)}</span>
            <h4>${esc(v.nume)}</h4>
            <p>${esc(v.descriere)}</p>
          </article>`).join('')}
      </div>
    </div>`;
  randeazaRandFoto($('#vinuriFoto'), date.vinuriImagini);
  $('#vinuri').innerHTML = grup('alb', 'Vinuri albe') + grup('rosu', 'Vinuri roșii');
  $('#soiuri').innerHTML =
    date.soiuri.albe.map((s) => `<li class="chip chip--alb">${esc(s)}</li>`).join('') +
    date.soiuri.rosii.map((s) => `<li class="chip chip--rosu">${esc(s)}</li>`).join('');

  // 3d. Unde găsești vinurile
  $('#distributie').innerHTML = date.distributie.map((d, i) => `
    <li class="shop reveal" style="--d:${i * 0.12}s">
      <span class="shop__icon">${icon(d.icon)}</span>
      <small>${esc(d.tip)}</small>
      <h4>${esc(d.nume)}</h4>
      <p>${esc(d.text)}</p>
    </li>`).join('');

  // 4. Avantaje
  $('#avantaje').innerHTML = date.avantaje.map((a, i) => `
    <li class="feature reveal" style="--d:${i * 0.12}s">
      <span class="feature__icon">${icon(a.icon)}</span>
      <h3>${esc(a.titlu)}</h3>
      <p>${esc(a.text)}</p>
    </li>`).join('');

  // 5. Experiențe recomandate
  $('#traseePreview').innerHTML = date.trasee.slice(0, 3).map(cardTraseu).join('');

  // 5b. Evenimente, cu al doilea videoclip
  randeazaEvenimente(date.evenimente);

  // 6. Galerie „bento” (fotografiile marcate recomandat)
  const selectie = date.galerie.filter((f) => f.recomandat).slice(0, 6);
  const bento = $('#galerieTeaser');
  bento.innerHTML = selectie.map((f, i) => `
    <figure class="bento__item reveal reveal--zoom" style="--d:${i * 0.08}s" data-i="${i}" tabindex="0">
      ${imagine(f)}<figcaption>${esc(f.titlu)}</figcaption>
    </figure>`).join('');
  activeazaLightbox($$('.bento__item', bento), () => selectie);

  // 7. Fundal CTA
  $('#ctaBg').innerHTML = imagine(date.cta);
}

// videoclipul din hero rulează singur, fără sunet, în buclă
function initVideo() {
  const video = $('.hero__video');
  if (!video) return;

  video.muted = true; // browserele pornesc automat doar videoclipuri fără sunet

  // video-ul apare lin peste fotografie abia când chiar rulează
  video.addEventListener('playing', () => $('.hero').classList.add('video-on'));
  deseneazaFundalVideo(video);
  // dacă fișierul video lipsește, rămâne fotografia
  video.addEventListener('error', () => $('#heroFilm').remove(), true);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  } else {
    video.play().catch(() => {});
  }

  // oprim videoclipul când nu se vede, ca să nu consume degeaba
  new IntersectionObserver(([intrare]) => {
    if (!intrare.isIntersecting && !video.paused) { video.pause(); video.dataset.auto = '1'; }
    else if (intrare.isIntersecting && video.dataset.auto) { delete video.dataset.auto; video.play().catch(() => {}); }
  }, { threshold: 0.1 }).observe(video);
}

/* Clipul Tronciu.mp4 este vertical (608×1080, aproape 9:16). Pe ecrane late
   desenăm o „felie” din mijlocul lui pe o pânză mică, pe care CSS-ul o
   mărește și o estompează ca fundal. Formula merge pentru orice clip:
   din clipuri mai late se ia doar banda verticală din mijloc. */
function deseneazaFundalVideo(video) {
  const panza = $('.hero__blur');
  if (!panza) return;
  const ctx = panza.getContext('2d');
  const ecranLat = window.matchMedia('(min-width: 701px)');
  let ultimul = 0;

  const deseneaza = (timp) => {
    requestAnimationFrame(deseneaza);
    if (!ecranLat.matches || video.paused || video.readyState < 2 || timp - ultimul < 50) return;
    ultimul = timp;
    const latimeUtila = video.videoHeight * 9 / 16;           // banda verticală din mijloc
    const inaltimeDecupata = latimeUtila * 9 / 16;            // o „felie” 16:9 din ea
    ctx.drawImage(
      video,
      (video.videoWidth - latimeUtila) / 2, (video.videoHeight - inaltimeDecupata) / 2,
      latimeUtila, inaltimeDecupata,
      0, 0, panza.width, panza.height
    );
  };
  requestAnimationFrame(deseneaza);
}

// un rând de fotografii care se deschid mărite la click
function randeazaRandFoto(container, poze) {
  if (!container || !poze) return;
  container.innerHTML = poze.map((f, i) => `
    <figure class="photo-row__item reveal reveal--zoom" style="--d:${i * 0.12}s" data-i="${i}" tabindex="0">
      ${imagine(f)}<figcaption>${esc(f.titlu)}</figcaption>
    </figure>`).join('');
  activeazaLightbox($$('.photo-row__item', container), () => poze);
}

// secțiunea „Evenimente la Tronciu”: videoclip vertical, evenimentul principal și restul
function randeazaEvenimente(ev) {
  const cutie = $('#evenimente');
  if (!cutie || !ev) return;
  const p = ev.principal;

  cutie.innerHTML = `
    <div class="events__top">
      <figure class="event-film reveal reveal--zoom">
        <video class="event-film__video" muted loop playsinline preload="metadata" poster="${esc(ev.poster.src)}" aria-label="${esc(ev.videoTitlu)}">
          <source src="${esc(ev.video)}" type="video/mp4">
        </video>
        <figcaption class="hero__film-tag"><span></span>${esc(ev.videoEticheta)}</figcaption>
      </figure>

      <article class="event-main reveal reveal--right" style="--d:.15s">
        <button class="event-main__poster" type="button" aria-label="Vezi afișul mărit">
          ${imagine(p.afis)}
          <span>${icon('plus')} Vezi afișul</span>
        </button>
        <div class="event-main__body">
          <span class="badge badge--mediu">${esc(p.eticheta)}</span>
          <h3>${esc(p.titlu)}</h3>
          <p class="event-main__date">${icon('calendar')} ${esc(p.data)}</p>
          <p>${esc(p.text)}</p>
          <ul class="chips">${p.program.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
          <p class="event-main__dinner"><strong>Cina:</strong> ${esc(p.cina)}</p>
          <ul class="event-main__details">${p.detalii.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
      </article>
    </div>

    <div class="events__list">
      ${ev.lista.map((e, i) => `
        <article class="event-card reveal" style="--d:${i * 0.1}s">
          <div class="event-card__media">${imagine(e.imagine)}</div>
          <div class="event-card__body">
            <small>${esc(e.data)}</small>
            <h4>${esc(e.titlu)}</h4>
            <p>${esc(e.text)}</p>
          </div>
        </article>`).join('')}
    </div>`;

  $('.event-main__poster', cutie).addEventListener('click', () => Lightbox.deschide([p.afis], 0));

  // videoclipul pornește doar când e pe ecran și se oprește când nu se mai vede
  const video = $('.event-film__video', cutie);
  video.muted = true;
  video.addEventListener('error', () => video.closest('.event-film').classList.add('fara-video'), true);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  new IntersectionObserver(([intrare]) => {
    if (intrare.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0.35 }).observe(video);
}

// pahar de vin desenat în SVG; vinul „se toarnă” când cardul apare pe ecran
let nrPahar = 0;
function paharSvg() {
  const id = 'bol' + (++nrPahar);
  return `
    <svg class="wine__glass" viewBox="0 0 60 100" aria-hidden="true">
      <defs><clipPath id="${id}"><path d="M12 6h36l-2 22a16 16 0 0 1-32 0Z"/></clipPath></defs>
      <g clip-path="url(#${id})"><rect class="wine__liquid" x="0" y="20" width="60" height="40"/></g>
      <path class="wine__outline" d="M12 6h36l-2 22a16 16 0 0 1-32 0Z M30 60v28 M18 92h24"/>
    </svg>`;
}

// împarte titlul în litere, ca să apară animat una câte una
function imparteLitere(titlu) {
  if (!titlu) return;
  const cuvinte = titlu.textContent.trim().split(' ');
  titlu.setAttribute('aria-label', titlu.textContent.trim());
  let i = 0;
  // fiecare cuvânt stă într-un bloc care nu se rupe pe două rânduri
  titlu.innerHTML = cuvinte.map((cuvant, k) => {
    const litere = [...cuvant].map((c) => `<span class="ch" aria-hidden="true" style="--i:${i++}">${c}</span>`).join('');
    const tag = k === cuvinte.length - 1 ? 'em' : 'span';
    return `<${tag} class="word">${litere}</${tag}>`;
  }).join('<span class="sp" aria-hidden="true"></span>');
}

// bule aurii care urcă prin hero
function creeazaBule(container, cate) {
  if (!container) return;
  const r = (a, b) => (a + Math.random() * (b - a)).toFixed(2);
  container.innerHTML = Array.from({ length: cate }, () =>
    `<span style="--x:${r(0, 100)}%;--s:${r(5, 18)}px;--t:${r(9, 18)}s;--dl:-${r(0, 18)}s;--dx:${r(-40, 40)}px"></span>`).join('');
}

function cardTraseu(t, i) {
  return `
    <article class="trail-card reveal" style="--d:${i * 0.12}s">
      <a href="trasee.html#${t.id}" class="trail-card__media" aria-label="${esc(t.nume)}">
        ${imagine(t.imagine)}
        <span class="badge badge--mediu">${esc(t.eticheta)}</span>
      </a>
      <div class="trail-card__body">
        <div class="meta"><span>${icon('pin')} ${esc(t.loc)}</span></div>
        <h3>${esc(t.nume)}</h3>
        <p>${esc(t.descriere)}</p>
        <a class="link-arrow" href="trasee.html#${t.id}">Vezi detalii ${icon('sageata')}</a>
      </div>
    </article>`;
}

/* ==========================================================
   PAGINA: TRASEE
   ========================================================== */
function paginaTrasee(date) {
  deseneazaHarta(date.trasee);

  $('#listaTrasee').innerHTML = date.trasee.map((t, i) => `
    <article class="trail" id="${t.id}">
      <div class="trail__media reveal reveal--zoom">
        <span class="trail__nr">0${i + 1}</span>
        <div class="trail__frame">${imagine(t.imagine)}</div>
      </div>
      <div class="trail__body reveal ${i % 2 ? 'reveal--left' : 'reveal--right'}" style="--d:.15s">
        <span class="badge badge--mediu">${esc(t.eticheta)}</span>
        <h3>${esc(t.nume)}</h3>
        <ul class="trail__meta">
          <li>${icon('pin')}<strong>${esc(t.loc)}</strong><small>unde</small></li>
          <li>${icon('calendar')}<strong>${esc(t.disponibil)}</strong><small>când</small></li>
          <li>${icon('persoane')}<strong>Română, rusă</strong><small>ghid</small></li>
        </ul>
        <p>${esc(t.descriere)}</p>
        <h4>Ce vei descoperi</h4>
        <ol class="stops">${t.puncte.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
      </div>
    </article>`).join('');

  $('#sfaturi').innerHTML = date.sfaturi.map((s, i) =>
    `<li class="reveal" style="--d:${i * 0.08}s">${icon('check')}<span>${esc(s)}</span></li>`).join('');

  // dacă s-a venit cu un link de tip trasee.html#vii, derulăm după randare
  if (location.hash) {
    const tinta = document.getElementById(location.hash.slice(1));
    if (tinta) setTimeout(() => tinta.scrollIntoView({ behavior: 'smooth' }), 700);
  }
}

// plasează numerele traseelor de-a lungul drumului din hartă
function deseneazaHarta(trasee) {
  const drum = $('.map-path--draw');
  if (!drum) return;
  const lungime = drum.getTotalLength();
  drum.style.setProperty('--len', lungime);

  $('#pins').innerHTML = trasee.map((t, i) => {
    const p = drum.getPointAtLength(lungime * (i + 0.7) / (trasee.length + 0.1));
    return `
      <a href="#${t.id}" class="pin" style="--d:${1.4 + i * 0.3}s" aria-label="${esc(t.nume)}">
        <g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
          <g class="pin__inner">
            <circle class="pin__pulse" r="24"/>
            <circle class="pin__dot" r="17"/>
            <text y="6">${i + 1}</text>
          </g>
        </g>
      </a>`;
  }).join('');

  $('#hartaLegenda').innerHTML = trasee.map((t, i) =>
    `<li><a href="#${t.id}"><span>${i + 1}</span>${esc(t.nume)}</a></li>`).join('');
}

/* ==========================================================
   PAGINA: GALERIE
   ========================================================== */
function paginaGalerie(date) {
  const filtre = $('#filtre');
  const grila = $('#grila');
  const poze = date.galerie;

  filtre.innerHTML = date.categoriiGalerie.map((c, i) => {
    const cate = c.id === 'toate' ? poze.length : poze.filter((f) => f.categorie === c.id).length;
    return `<button class="filter${i === 0 ? ' active' : ''}" data-cat="${c.id}" aria-pressed="${i === 0}">${esc(c.nume)}<small>${cate}</small></button>`;
  }).join('');

  grila.innerHTML = poze.map((f, i) => `
    <figure class="g-item reveal" style="--d:${(i % 6) * 0.07}s" data-cat="${f.categorie}" data-i="${i}" tabindex="0">
      ${imagine(f, 'f-' + (f.format || 'peisaj'))}
      <span class="g-item__zoom">${icon('plus')}</span>
      <figcaption><strong>${esc(f.titlu)}</strong><span>${esc(f.descriere)}</span></figcaption>
    </figure>`).join('');

  const elemente = $$('.g-item', grila);

  // lightbox-ul arată doar fotografiile din categoria aleasă
  const vizibile = () => elemente.filter((el) => !el.hidden && !el.classList.contains('out'));
  elemente.forEach((el) => {
    const deschide = () => {
      const lista = vizibile();
      Lightbox.deschide(lista.map((e) => poze[e.dataset.i]), lista.indexOf(el));
    };
    el.addEventListener('click', deschide);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') deschide(); });
  });

  // filtrare animată
  filtre.addEventListener('click', (e) => {
    const buton = e.target.closest('.filter');
    if (!buton) return;
    $$('.filter', filtre).forEach((b) => {
      b.classList.toggle('active', b === buton);
      b.setAttribute('aria-pressed', b === buton);
    });
    const cat = buton.dataset.cat;
    elemente.forEach((el, i) => {
      const arata = cat === 'toate' || el.dataset.cat === cat;
      if (arata) {
        el.hidden = false;
        el.classList.add('visible');
        el.style.setProperty('--d', `${(i % 6) * 0.05}s`);
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('out')));
      } else {
        el.classList.add('out');
        setTimeout(() => { if (el.classList.contains('out')) el.hidden = true; }, 400);
      }
    });
  });
}

/* ---------- Lightbox (vizualizare mărită) ---------- */
const Lightbox = {
  lista: [],
  index: 0,
  el: null,

  construieste() {
    this.el = document.createElement('div');
    this.el.className = 'lightbox';
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-label', 'Galerie foto');
    this.el.innerHTML = `
      <button class="lb-btn lb-close" aria-label="Închide">${icon('inchide')}</button>
      <button class="lb-btn lb-prev" aria-label="Fotografia anterioară">${icon('inapoi')}</button>
      <figure class="lb-figure">
        <img class="lb-img" alt="">
        <figcaption><strong class="lb-title"></strong><span class="lb-desc"></span><span class="lb-count"></span></figcaption>
      </figure>
      <button class="lb-btn lb-next" aria-label="Fotografia următoare">${icon('inainte')}</button>`;
    document.body.append(this.el);

    const img = $('.lb-img', this.el);
    img.addEventListener('load', () => img.classList.add('in'));
    $('.lb-close', this.el).addEventListener('click', () => this.inchide());
    $('.lb-prev', this.el).addEventListener('click', () => this.arata(this.index - 1));
    $('.lb-next', this.el).addEventListener('click', () => this.arata(this.index + 1));
    this.el.addEventListener('click', (e) => { if (e.target === this.el) this.inchide(); });

    document.addEventListener('keydown', (e) => {
      if (!this.el.classList.contains('open')) return;
      if (e.key === 'Escape') this.inchide();
      if (e.key === 'ArrowLeft') this.arata(this.index - 1);
      if (e.key === 'ArrowRight') this.arata(this.index + 1);
    });

    // glisare pe telefon
    let startX = 0;
    this.el.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    this.el.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) this.arata(this.index + (dx < 0 ? 1 : -1));
    });
  },

  deschide(lista, index) {
    if (!this.el) this.construieste();
    this.lista = lista;
    this.el.classList.add('open');
    document.body.classList.add('no-scroll');
    this.arata(index);
    $('.lb-close', this.el).focus();
  },

  arata(n) {
    this.index = (n + this.lista.length) % this.lista.length;
    const foto = this.lista[this.index];
    const img = $('.lb-img', this.el);
    img.classList.remove('in');
    img.dataset.ph = `${foto.id}|${foto.format || 'peisaj'}|${foto.cauta || ''}`;
    delete img.dataset.inlocuita;
    img.alt = foto.titlu;
    img.src = foto.src;
    if (img.complete && img.naturalWidth) img.classList.add('in');
    $('.lb-title', this.el).textContent = foto.titlu;
    $('.lb-desc', this.el).textContent = foto.descriere || '';
    $('.lb-count', this.el).textContent = `${this.index + 1} / ${this.lista.length}`;
  },

  inchide() {
    this.el.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
};

function activeazaLightbox(elemente, lista) {
  elemente.forEach((el) => {
    const deschide = () => Lightbox.deschide(lista(), Number(el.dataset.i));
    el.addEventListener('click', deschide);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') deschide(); });
  });
}

/* ==========================================================
   PAGINA: CAZARE
   ========================================================== */
function paginaCazare(date) {
  // cardurile de cazare (camere, corturi, colibe)
  $('#camere').innerHTML = date.cazare.map((c, i) => `
    <article class="room reveal" style="--d:${i * 0.12}s">
      <div class="room__media">
        ${imagine(c.imagine)}
        <span class="room__price"><strong>${c.numar}</strong> ${esc(c.unitate)}</span>
      </div>
      <div class="room__body">
        <h3>${esc(c.nume)}</h3>
        <p>${esc(c.descriere)}</p>
        <ul class="chips">${c.facilitati.map((f) => `<li>${icon('check')}${esc(f)}</li>`).join('')}</ul>
        <a href="contact.html?interes=${c.id}" class="btn btn--primary btn--sm">Cere ofertă ${icon('sageata')}</a>
      </div>
    </article>`).join('');

  // tabelul 1: pachetele excursie + degustare (în euro, pe persoană)
  $('#tabelPachete tbody').innerHTML = date.pachete.map((p, i) => `
    <tr style="--r:${i}">
      <th scope="row">${esc(p.nume)}<small>${esc(p.descriere)}</small></th>
      <td>${esc(p.durata)}</td>
      <td>${p.grupMinim}+ pers.</td>
      <td class="pret">${euro(p.pret)}</td>
      <td class="pret">${euro(p.pretWeekend)}</td>
    </tr>`).join('');

  // tabelul 2: degustări cu bucate gătite (în lei)
  $('#tabelDegustari tbody').innerHTML = date.degustari.map((d, i) => `
    <tr style="--r:${i}">
      <th scope="row">Degustare ${d.vinuri} vinuri</th>
      <td>${d.vinuri} vinuri + bucate gătite</td>
      <td class="pret">${lei(d.pret)}</td>
    </tr>`).join('');

  // tabelul 3: tipurile de cazare
  $('#tabelCazare tbody').innerHTML = date.cazare.map((c, i) => `
    <tr style="--r:${i}">
      <th scope="row">${esc(c.nume)}</th>
      <td>${c.numar} ${esc(c.unitate)}</td>
      <td>${esc(c.facilitati.join(' · '))}</td>
      <td class="pret">la cerere</td>
    </tr>`).join('');

  // reguli (copii, nr. maxim de vizitatori) și restaurant / evenimente
  $('#reguli').innerHTML = date.reguli.map((r, i) =>
    `<li class="reveal" style="--d:${i * 0.1}s"><strong>${esc(r.valoare)}</strong><span>${esc(r.text)}</span></li>`).join('');
  randeazaRandFoto($('#restaurantFoto'), date.restaurantImagini);
  $('#restaurant').innerHTML = date.restaurant.map((r, i) => `
    <li class="info-card reveal" style="--d:${(i % 3) * 0.1}s">
      <span class="info-card__icon">${icon(r.icon)}</span>
      <span><strong>${esc(r.titlu)}</strong><small>${esc(r.text)}</small></span>
    </li>`).join('');
}

/* ==========================================================
   PAGINA: CONTACT
   ========================================================== */
function paginaContact(date) {
  const s = date.site;
  const carduri = [
    { icon: 'pin', eticheta: 'Adresă', valoare: `Vinăria Tronciu, ${s.localitate}` },
    { icon: 'telefon', eticheta: 'Telefon mobil', valoare: s.telefon, link: 'tel:' + s.telefon.replace(/\s/g, '') },
    { icon: 'telefon', eticheta: 'Telefon fix', valoare: s.telefonFix, link: 'tel:' + s.telefonFix.replace(/\s/g, '') },
    { icon: 'email', eticheta: 'E-mail', valoare: s.email, link: 'mailto:' + s.email },
    { icon: 'facebook', eticheta: 'Pagina de Facebook', valoare: 'Vinăria Tronciu pe Facebook', link: s.facebook, extern: true },
    { icon: 'ceas', eticheta: 'Program', valoare: s.program },
    { icon: 'persoane', eticheta: 'Limbi', valoare: s.limbi }
  ];
  $('#contactInfo').innerHTML = carduri.map((c, i) => {
    // linkul de Facebook se deschide într-o filă nouă
    const tag = c.link ? `a href="${esc(c.link)}"${c.extern ? ' target="_blank" rel="noopener"' : ''}` : 'div';
    return `
      <${tag} class="info-card reveal reveal--left" style="--d:${i * 0.1}s">
        <span class="info-card__icon">${icon(c.icon)}</span>
        <span><small>${c.eticheta}</small><strong>${esc(c.valoare)}</strong></span>
      </${c.link ? 'a' : 'div'}>`;
  }).join('');

  $('#informatii').innerHTML = date.informatii.map((t, i) =>
    `<li class="reveal" style="--d:${i * 0.08}s">${icon('check')}<span>${esc(t)}</span></li>`).join('');

  // lista din formular: pachete, degustări, cazare, evenimente
  const select = $('#cazareSelect');
  const optiuni = (eticheta, lista) => `<optgroup label="${eticheta}">${lista.join('')}</optgroup>`;
  select.innerHTML = '<option value="">Alege o opțiune…</option>'
    + optiuni('Excursie + degustare', date.pachete.map((p, i) => `<option value="pack${i + 1}">${esc(p.nume)}</option>`))
    + optiuni('Degustări cu bucate gătite', date.degustari.map((d) => `<option value="degustare${d.vinuri}">Degustare ${d.vinuri} vinuri</option>`))
    + optiuni('Cazare', date.cazare.map((c) => `<option value="${c.id}">${esc(c.nume)}</option>`))
    + optiuni('Altele', ['<option value="eveniment">Eveniment privat (până la 50 de oameni)</option>', '<option value="transport">Transport din Chișinău</option>']);
  const ales = new URLSearchParams(location.search).get('interes');
  if (ales) select.value = ales;

  $('#harta').src = `https://maps.google.com/maps?q=${encodeURIComponent(s.harta)}&z=13&output=embed`;

  initFormular();
}

function initFormular() {
  const form = $('#formular');
  const { sosire, plecare } = form.elements;
  const azi = new Date().toISOString().split('T')[0];
  sosire.min = azi;
  plecare.min = azi;
  sosire.addEventListener('change', () => { plecare.min = sosire.value || azi; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form.elements;
    let valid = true;

    const verifica = (camp, mesaj) => {
      const cutie = camp.closest('.field');
      cutie.classList.toggle('error', Boolean(mesaj));
      $('.field__err', cutie).textContent = mesaj || '';
      if (mesaj) valid = false;
    };

    verifica(f.nume, f.nume.value.trim().length < 3 ? 'Scrie numele complet.' : '');
    verifica(f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()) ? '' : 'Adresa de e-mail nu este validă.');
    verifica(f.plecare, sosire.value && plecare.value && plecare.value <= sosire.value ? 'Plecarea trebuie să fie după sosire.' : '');
    verifica(f.mesaj, f.mesaj.value.trim().length < 10 ? 'Mesajul e prea scurt (minim 10 caractere).' : '');

    if (!valid) {
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      return;
    }

    // simulare trimitere (site-ul nu are server)
    const buton = $('button[type="submit"]', form);
    buton.classList.add('loading');
    buton.disabled = true;
    setTimeout(() => {
      buton.classList.remove('loading');
      buton.disabled = false;
      form.reset();
      $('#succes').classList.add('show');
    }, 1300);
  });

  $('#succesInchide').addEventListener('click', () => $('#succes').classList.remove('show'));
}

/* ==========================================================
   ANIMAȚII GENERALE
   ========================================================== */
function initReveal() {
  const observator = new IntersectionObserver((intrari) => {
    intrari.forEach((intrare) => {
      if (intrare.isIntersecting) {
        intrare.target.classList.add('visible');
        observator.unobserve(intrare.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => observator.observe(el));
}

// numerele care „cresc” când apar pe ecran
function initContoare() {
  const observator = new IntersectionObserver((intrari) => {
    intrari.forEach((intrare) => {
      if (!intrare.isIntersecting) return;
      observator.unobserve(intrare.target);
      const el = intrare.target;
      const tinta = Number(el.dataset.tinta);
      const deLa = Number(el.dataset.start || 0);           // de la ce număr pornește
      const grupare = el.dataset.grupare !== 'false';   // anul 1997 se scrie fără punct
      const zecimale = Number.isInteger(tinta) ? 0 : 1;
      const durata = 1800;
      const start = performance.now();
      const pas = (acum) => {
        const p = Math.min((acum - start) / durata, 1);
        const usor = 1 - Math.pow(1 - p, 3);
        el.textContent = (deLa + (tinta - deLa) * usor).toLocaleString('ro-RO', { minimumFractionDigits: zecimale, maximumFractionDigits: zecimale, useGrouping: grupare });
        if (p < 1) requestAnimationFrame(pas);
      };
      requestAnimationFrame(pas);
    });
  }, { threshold: 0.6 });
  $$('.counter').forEach((el) => observator.observe(el));
}

// fundalurile se mișcă mai încet decât pagina (efect de adâncime)
function initParallax() {
  const elemente = $$('.page-hero__bg, .cta__bg');
  if (!elemente.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let asteapta = false;
  const actualizeaza = () => {
    elemente.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const deplasare = (r.top + r.height / 2 - window.innerHeight / 2) * -0.15;
      el.style.transform = `translateY(${deplasare.toFixed(1)}px)`;
    });
    asteapta = false;
  };
  window.addEventListener('scroll', () => {
    if (!asteapta) { asteapta = true; requestAnimationFrame(actualizeaza); }
  }, { passive: true });
  actualizeaza();
}

function arataEroareDate() {
  const mesaj = document.createElement('div');
  mesaj.className = 'data-error';
  mesaj.innerHTML = `<strong>Datele nu au putut fi încărcate.</strong><br>
    Lipsește fișierul <code>data/date.js</code>. Rulează <code>actualizeaza-date.bat</code>
    (dublu-click pe el, în folderul proiectului) și reîncarcă pagina.`;
  document.body.append(mesaj);
}
