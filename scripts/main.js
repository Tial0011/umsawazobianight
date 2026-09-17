import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initCarousel } from './carousel.js';
import { initTicker } from './ticker.js';
import { initVideoSound } from './video-sound.js';

const boot = () => {
  initNav();
  initReveal();
  initCarousel();
  initTicker();
  initVideoSound();
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', boot)
  : boot();
