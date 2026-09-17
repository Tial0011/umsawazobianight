import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initCarousel } from './carousel.js';
import { initTicker } from './ticker.js';
import { initVideoSound } from './video-sound.js';
import { initProgramme } from './programme.js';
import { initCountdown } from './countdown.js';
import { initTicketLinks, initPaymentInfo, initConfirmationText } from './tickets.js';
import { initShare } from './share.js';
import { initFooterSocials } from './footer.js';

const boot = () => {
  initNav();
  initProgramme();
  initReveal();
  initCarousel();
  initTicker();
  initVideoSound();
  initCountdown();
  initPaymentInfo();
  initConfirmationText();
  initTicketLinks();
  initShare();
  initFooterSocials();
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', boot)
  : boot();
