import { eventConfig } from './config.js';

const SOCIAL_LABELS = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  x: 'X',
  whatsapp: 'WhatsApp',
};

/**
 * Only ever shows a social link that has an actual URL configured in
 * eventConfig.socials. Nothing here invents a profile — an empty value
 * stays hidden, both the icon/link and its list item.
 */
export function initFooterSocials() {
  const container = document.querySelector('[data-footer-socials]');
  if (!container) return;

  let anyVisible = false;
  Object.entries(eventConfig.socials).forEach(([key, value]) => {
    const link = container.querySelector(`[data-social="${key}"]`);
    if (!link) return;
    const url = value.trim();
    const item = link.closest('li');
    if (url) {
      link.href = url;
      link.hidden = false;
      link.textContent = SOCIAL_LABELS[key] ?? key;
      if (item) item.hidden = false;
      anyVisible = true;
    } else {
      link.hidden = true;
      if (item) item.hidden = true;
    }
  });

  container.hidden = !anyVisible;
}
