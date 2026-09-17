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

  // The Section 11 payment panel renders each of these independently,
  // so any field left empty shows its own "coming soon" placeholder
  // without hiding the rest.
  payment: {
    bankName: 'UBA (United Bank for Africa)',
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

  // Section 7 — where "Join the wall" should send people (a WhatsApp
  // link, a form, a mailto address...). While this is empty the CTA
  // stays hidden rather than pointing at an invented destination.
  afroWallSubmissionUrl: '',

  // The live domain. Used for sharing, so shared links always point at
  // the real site rather than whatever URL the visitor happens to be on.
  siteUrl: 'https://umsawazobianight.top/',

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
