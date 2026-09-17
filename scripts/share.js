import { eventConfig } from './config.js';

const SHARE_TITLE = 'Wazobia Night 2026';
const WHATSAPP_TEXT =
  'Wazobia Night 2026 is happening on 01 October 2026 at NIEPA Field from 4:00 PM. Come as your culture.';
const X_TEXT =
  'Wazobia Night 2026 \u2014 one night, many cultures, one Nigeria. 01 October 2026 \u00B7 NIEPA Field \u00B7 4:00 PM.';
const NATIVE_TEXT = 'Join UMSA Wazobia Night 2026 \u2014 01 October 2026, NIEPA Field, 4:00 PM.';

function getShareUrl() {
  const configured = eventConfig.siteUrl.trim();
  return configured || window.location.href;
}

function announce(text) {
  const status = document.querySelector('[data-share-status]');
  if (status) status.textContent = text;
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for browsers without the async Clipboard API.
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.setAttribute('readonly', '');
  temp.style.position = 'fixed';
  temp.style.left = '-9999px';
  document.body.appendChild(temp);
  temp.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(temp);
  }
}

export function initShare() {
  const url = getShareUrl();

  const whatsappLink = document.querySelector('[data-share-whatsapp]');
  const xLink = document.querySelector('[data-share-x]');
  const facebookLink = document.querySelector('[data-share-facebook]');
  const copyBtn = document.querySelector('[data-share-copy]');
  const nativeBtn = document.querySelector('[data-share-native]');

  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(`${WHATSAPP_TEXT} ${url}`)}`;
  }
  if (xLink) {
    xLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(X_TEXT)}&url=${encodeURIComponent(url)}`;
  }
  if (facebookLink) {
    facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  }

  if (copyBtn) {
    const label = copyBtn.querySelector('[data-share-copy-label]');
    const defaultLabel = label ? label.textContent : 'Copy link';
    let resetTimer;

    copyBtn.addEventListener('click', async () => {
      try {
        await copyToClipboard(url);
        if (label) label.textContent = 'Link copied \u2713';
        copyBtn.setAttribute('data-copied', 'true');
        announce('Link copied to clipboard.');
      } catch {
        announce('Could not copy the link. Please copy it from the address bar.');
        return;
      }
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        if (label) label.textContent = defaultLabel;
        copyBtn.removeAttribute('data-copied');
      }, 2400);
    });
  }

  if (nativeBtn) {
    if (typeof navigator.share === 'function') {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', async () => {
        try {
          await navigator.share({ title: SHARE_TITLE, text: NATIVE_TEXT, url });
        } catch {
          /* User cancelled the native share sheet — nothing to do. */
        }
      });
    } else {
      nativeBtn.hidden = true;
    }
  }
}
