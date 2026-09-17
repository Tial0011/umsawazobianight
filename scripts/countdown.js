/* Live countdown to Wazobia Night 2026.
   Target: 1 October 2026, 4:00 PM WAT (West Africa Time, UTC+1, no DST).
   Expressed directly in UTC (15:00 UTC) so it is correct no matter what
   timezone the visitor's device is set to. To change the event date/time,
   edit TARGET_UTC_MS below — see the README for the conversion note. */

const TARGET_UTC_MS = Date.UTC(2026, 9, 1, 15, 0, 0); // 2026-10-01T15:00:00Z = 16:00 WAT

function pad(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

export function initCountdown() {
  const root = document.querySelector('[data-countdown]');
  if (!root) return;

  const valueEls = {
    days: root.querySelector('[data-countdown-days]'),
    hours: root.querySelector('[data-countdown-hours]'),
    minutes: root.querySelector('[data-countdown-minutes]'),
    seconds: root.querySelector('[data-countdown-seconds]'),
  };
  const liveRegion = document.querySelector('[data-countdown-live]');
  const doneEl = document.querySelector('[data-countdown-done]');

  let announcedDone = false;
  let lastAnnouncedMinute = null;
  let timer = null;

  function render() {
    const diffMs = TARGET_UTC_MS - Date.now();

    if (diffMs <= 0) {
      if (!announcedDone) {
        announcedDone = true;
        root.hidden = true;
        if (doneEl) doneEl.hidden = false;
        if (liveRegion) liveRegion.textContent = 'Wazobia Night is live.';
        if (timer) clearInterval(timer);
      }
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (valueEls.days) valueEls.days.textContent = pad(days);
    if (valueEls.hours) valueEls.hours.textContent = pad(hours);
    if (valueEls.minutes) valueEls.minutes.textContent = pad(minutes);
    if (valueEls.seconds) valueEls.seconds.textContent = pad(seconds);

    // Update the accessible live region on minute changes only, so screen
    // readers aren't asked to announce a new value every second.
    if (liveRegion && minutes !== lastAnnouncedMinute) {
      lastAnnouncedMinute = minutes;
      liveRegion.textContent = `${days} days, ${hours} hours and ${minutes} minutes to Wazobia Night.`;
    }
  }

  render();
  timer = setInterval(render, 1000);
}
