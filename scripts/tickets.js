import { eventConfig } from './config.js';

/**
 * Activates every "Get your ticket" button on the site the moment a real
 * payment link is added to eventConfig.payment.paymentLink. Until then,
 * these buttons keep their default in-page anchor (never a fake "#" or a
 * placeholder checkout), so they always do something safe and real.
 */
export function initTicketLinks() {
  const link = eventConfig.payment.paymentLink.trim();
  if (!link) return;

  document.querySelectorAll('[data-ticket-cta]').forEach((el) => {
    el.setAttribute('href', link);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
    el.removeAttribute('data-ticket-pending');
  });
}

/**
 * Renders the Section 11 payment panel from eventConfig.payment. The
 * markup already contains the known details as a no-JS fallback; this
 * keeps config.js as the single source of truth so editing one file is
 * enough. A field left empty in config renders as "Coming soon" rather
 * than hiding the whole panel — bank name can lag behind account number
 * and account name without blocking either.
 */
export function initPaymentInfo() {
  const details = document.querySelector('[data-payment-details]');
  if (!details) return;

  const { bankName, accountNumber, accountName, contacts } = eventConfig.payment;

  const setField = (selector, value) => {
    const el = details.querySelector(selector);
    if (!el) return;
    const trimmed = (value || '').trim();
    el.textContent = trimmed || 'Coming soon';
    el.classList.toggle('is-pending', !trimmed);
  };

  setField('[data-payment-bank]', bankName);
  setField('[data-payment-account]', accountNumber);
  setField('[data-payment-name]', accountName);

  const contactList = document.querySelector('[data-payment-contacts]');
  if (contactList && Array.isArray(contacts) && contacts.length) {
    contactList.innerHTML = '';
    contacts.forEach(({ role, name, phone }) => {
      const digits = phone.replace(/[^\d+]/g, '');
      const li = document.createElement('li');
      li.className = 'payment-contact';

      const roleEl = document.createElement('span');
      roleEl.className = 'payment-contact__role';
      roleEl.textContent = role;

      const nameEl = document.createElement('span');
      nameEl.className = 'payment-contact__name';
      nameEl.textContent = name;

      const linksEl = document.createElement('span');
      linksEl.className = 'payment-contact__links';

      const telLink = document.createElement('a');
      telLink.href = `tel:${digits}`;
      telLink.textContent = phone;

      const waLink = document.createElement('a');
      waLink.href = `https://wa.me/${digits.replace('+', '')}`;
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      waLink.textContent = 'WhatsApp';

      linksEl.append(telLink, document.createTextNode(' '), waLink);
      li.append(roleEl, nameEl, linksEl);
      contactList.appendChild(li);
    });
  }
}

/** Swaps in the real confirmation process once one is configured. */
export function initConfirmationText() {
  const el = document.querySelector('[data-confirmation-text]');
  const instructions = eventConfig.confirmation.instructions.trim();
  if (!el || !instructions) return;
  el.textContent = instructions;
}
