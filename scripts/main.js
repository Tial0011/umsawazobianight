import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initCarousel } from './carousel.js';
import { initTicker } from './ticker.js';

const boot = () => {
  initNav();
  initReveal();
  initCarousel();
  initTicker();
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', boot)
  : boot();
