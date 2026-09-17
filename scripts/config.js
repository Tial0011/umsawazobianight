/* =========================================================
   Wazobia Night 2026 — central event configuration
   ---------------------------------------------------------
   Edit values here rather than scattering them across the
   HTML/JS. Every field that is still empty ("") is a known
   gap: nothing has been invented in its place, and the page
   is written to render sensibly until the real value arrives.
   ========================================================= */

export const eventConfig = {
  name: 'Wazobia Night 2026',
  organizer: 'UMSA',
  organizerFull: "University of Medical Students' Association",
  university: 'UNIMED',
  universityFull: 'University of Medical Sciences, Ondo',

  date: '01 October 2026',
  isoDate: '2026-10-01',
  time: '4:00 PM',
  venue: 'NIEPA Field',

  ticketPrices: {
    umsa: 2000,
    nonUmsa: 3500,
  },

  // Fill in bankName once it's confirmed — everything else here is
  // already official. The Section 11 payment panel renders each of
  // these independently, so a still-missing field (bankName) shows
  // its own "coming soon" placeholder without hiding the rest.
  payment: {
    bankName: '',
    accountNumber: '2392045814',
    accountName: 'UMSA TRUST FUND UNIMED',
    paymentLink: '',
    // People to contact for payment enquiries and for sending proof
    // of payment after transferring. Rendered as tap-to-call and
    // tap-to-WhatsApp links.
    contacts: [
      { role: 'Financial Secretary', name: 'Abass', phone: '+2349166055878' },
      { role: 'Treasurer', name: 'Areta', phone: '+2347013361189' },
    ],
  },

  // Shown as the "Confirm your ticket" step in Section 11. Leave
  // empty until an official confirmation process (a form, a
  // WhatsApp number, an email address, etc.) is decided.
  confirmation: {
    instructions: 'After payment, send your receipt to the Financial Secretary or Treasurer listed in the payment details below.',
  },

  // The live domain, once known, e.g. "https://wazobianight.com/".
  // Used for sharing; falls back to the browser's current URL
  // when empty, so Share/Copy Link still work correctly today.
  siteUrl: '',

  // Only a link that is filled in here will ever be shown or
  // linked to from the site.
  socials: {
    instagram: '',
    tiktok: '',
    facebook: '',
    x: '',
    whatsapp: '',
  },
};

/** ₦2,000 style formatting for the ticket prices above. */
export function formatNaira(amount) {
  return `\u20A6${amount.toLocaleString('en-NG')}`;
}
