/* Sticky navbar + accessible mobile menu */
export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const toggle = nav.querySelector('[data-nav-toggle]');
  const panel = nav.querySelector('[data-nav-panel]');
  const links = panel ? Array.from(panel.querySelectorAll('a')) : [];
  let open = false;

  const setOpen = (next) => {
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    nav.classList.toggle('is-open', next);
    document.body.style.overflow = next ? 'hidden' : '';
    if (next) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('is-visible'));
      links[0]?.focus({ preventScroll: true });
    } else {
      panel.classList.remove('is-visible');
      const hide = () => { if (!open) panel.hidden = true; };
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? hide()
        : window.setTimeout(hide, 240);
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close if the viewport grows into the desktop layout
  const desktop = window.matchMedia('(min-width: 900px)');
  desktop.addEventListener('change', (e) => { if (e.matches && open) setOpen(false); });

  // Solid background once the page is scrolled
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Highlight the section currently in view
  const targets = Array.from(document.querySelectorAll('main section[id], #hero'));
  const navLinks = Array.from(nav.querySelectorAll('.nav__list a'));
  if ('IntersectionObserver' in window && targets.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) =>
          a.toggleAttribute('aria-current', a.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((t) => spy.observe(t));
  }
}
