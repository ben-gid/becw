// Bellagio Express Car Wash — vanilla, no dependencies.

// --- Mobile nav -------------------------------------------------------------
const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
document.getElementById('nav').addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    document.body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// --- Open-now status: hero chip + each location card ------------------------
// Every site opens at 7:00am; each card's data-close holds its own closing time.
const OPEN_MIN = 7 * 60;

function laMinutes() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', hour: 'numeric', minute: 'numeric', hour12: false
  }).formatToParts(new Date());
  const get = t => Number(parts.find(p => p.type === t).value);
  return (get('hour') % 24) * 60 + get('minute');
}

const now = laMinutes();
const locCards = [...document.querySelectorAll('.loc')];
let openCount = 0;
for (const card of locCards) {
  const [h, m] = card.dataset.close.split(':').map(Number);
  const open = now >= OPEN_MIN && now < h * 60 + m;
  if (open) openCount++;
  const status = document.createElement('b');
  status.className = 'loc__open' + (open ? ' is-open' : '');
  status.textContent = open ? 'Open now' : 'Closed now';
  card.querySelector('.loc__hours').prepend(status, ' · ');
}

const chip = document.getElementById('openNow');
chip.classList.toggle('is-open', openCount > 0);
chip.textContent =
  openCount === locCards.length ? 'All locations open now' :
  openCount > 0 ? `${openCount} of ${locCards.length} locations open now` :
  'Closed now · opens 7:00am';

// --- Hero video: mute toggle ------------------------------------------------
const video = document.getElementById('heroVideo');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
const mute = document.getElementById('mute');
mute.addEventListener('click', () => {
  video.muted = !video.muted;
  mute.setAttribute('aria-pressed', String(video.muted));
  mute.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
});

// --- Pricing toggle ---------------------------------------------------------
const passes = document.getElementById('passes');
passes.querySelectorAll('.toggle__opt').forEach(btn => {
  btn.addEventListener('click', () => {
    passes.dataset.mode = btn.dataset.mode;
    passes.querySelectorAll('.toggle__opt').forEach(b =>
      b.setAttribute('aria-pressed', String(b === btn)));
  });
});

// --- Nearest location -------------------------------------------------------
// ponytail: straight-line distance from hardcoded store coordinates. Swap for a
// routing/geocoding API if drive time ever matters more than "which is closest".
const locsEl = document.getElementById('locs');
const cards = [...locsEl.children];
const msg = document.getElementById('finderMsg');

function milesBetween(a, b) {
  const R = 3958.8, rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

document.getElementById('findNearest').addEventListener('click', () => {
  if (!navigator.geolocation) {
    msg.textContent = 'This browser cannot share your location. Pick a location below.';
    return;
  }
  msg.textContent = 'Finding you…';
  navigator.geolocation.getCurrentPosition(pos => {
    const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    const ranked = cards.map(card => ({
      card,
      miles: milesBetween(me, { lat: +card.dataset.lat, lng: +card.dataset.lng })
    })).sort((a, b) => a.miles - b.miles);

    ranked.forEach(({ card, miles }, i) => {
      const dist = card.querySelector('.loc__dist');
      dist.textContent = `${miles.toFixed(1)} miles away`;
      dist.hidden = false;
      card.classList.toggle('is-nearest', i === 0);
      locsEl.appendChild(card);
    });
    msg.textContent = `Closest to you: ${ranked[0].card.querySelector('h3').textContent}.`;
  }, () => {
    msg.textContent = 'We could not get your location. Pick a location below.';
  }, { timeout: 10000 });
});

// --- Forms ------------------------------------------------------------------
// No backend yet: validate, then say plainly nothing was sent and keep what they
// typed, so they can copy it or call. Replace this block when a backend exists.
for (const form of document.querySelectorAll('.form')) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const status = form.querySelector('.form__status');
    if (!form.reportValidity()) {
      status.dataset.state = 'error';
      status.textContent = 'Check the highlighted fields and try again.';
      return;
    }
    status.dataset.state = 'error';
    status.textContent = 'Online sending isn’t set up yet, so this wasn’t sent. Please call us at (332) 232-2316.';
  });
}

// --- Nav highlighting -------------------------------------------------------
const links = new Map();
for (const a of document.querySelectorAll('.nav a[href^="#"]')) {
  const section = document.getElementById(a.hash.slice(1));
  if (section) links.set(section, a);
}
const spy = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    links.forEach(a => a.classList.remove('is-here'));
    links.get(entry.target).classList.add('is-here');
  }
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach((_, section) => spy.observe(section));
