/* Snap-scroll rail for the culture cards (mobile) with optional controls */
export function initCarousel() {
  const rail = document.querySelector('[data-carousel]');
  const controls = document.querySelector('[data-carousel-controls]');
  if (!rail || !controls) return;

  const cards = Array.from(rail.querySelectorAll('[data-card]'));
  const prev = controls.querySelector('[data-prev]');
  const next = controls.querySelector('[data-next]');
  const status = controls.querySelector('[data-status]');

  const scrollable = () => rail.scrollWidth - rail.clientWidth > 8;

  const index = () => {
    const mid = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft <= mid) best = i;
    });
    return Math.min(best, cards.length - 1);
  };

  const sync = () => {
    const on = scrollable();
    controls.hidden = !on;
    if (!on) return;
    const i = index();
    status.textContent = `${i + 1} of ${cards.length}`;
    prev.disabled = rail.scrollLeft <= 4;
    next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4;
  };

  const go = (dir) => {
    const step = cards[0] ? cards[0].getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  rail.addEventListener('scroll', () => window.requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync);
  sync();
}
