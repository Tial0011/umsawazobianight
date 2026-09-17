/* Slow, seamless marquee. Duplicates each set so the loop has no gap. */
export function initTicker() {
  const rows = Array.from(document.querySelectorAll('[data-ticker-row]'));
  if (!rows.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  rows.forEach((row) => {
    const original = row.firstElementChild;
    if (!original) return;

    // Fill at least twice the viewport width, then duplicate the whole strip.
    let guard = 0;
    while (row.scrollWidth < window.innerWidth * 2 && guard < 12) {
      row.appendChild(original.cloneNode(true));
      guard += 1;
    }
    const half = row.scrollWidth;
    Array.from(row.children).forEach((child) => row.appendChild(child.cloneNode(true)));

    const speed = 22; // px per second — slow enough to read
    const duration = half / speed;
    const dir = row.dataset.dir === 'right' ? 'reverse' : 'normal';
    row.style.animation = `wz-marquee ${duration}s linear infinite ${dir}`;
    row.style.setProperty('--marquee-distance', `-${half}px`);
  });

  const style = document.createElement('style');
  style.textContent =
    '@keyframes wz-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(var(--marquee-distance),0,0)}}';
  document.head.appendChild(style);
}
