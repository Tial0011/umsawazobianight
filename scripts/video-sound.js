// Cultural-experience video: autoplay starts muted (required by every
// browser's autoplay policy). This wires up a small "turn your volume up"
// prompt that unmutes the video, already set to a low, comfortable level,
// the first time someone taps it or the video itself.
export function initVideoSound() {
  const video = document.getElementById('experience-video');
  const toggle = document.getElementById('video-sound-toggle');
  if (!video || !toggle) return;

  const LOW_VOLUME = 0.35;
  video.volume = LOW_VOLUME;

  const unmute = () => {
    video.muted = false;
    video.volume = LOW_VOLUME;
    video.play().catch(() => {});
    toggle.classList.add('is-unmuted');
    toggle.setAttribute('aria-pressed', 'true');
    toggle.querySelector('.video-frame__sound-text').textContent = 'Sound on';
  };

  const mute = () => {
    video.muted = true;
    toggle.classList.remove('is-unmuted');
    toggle.setAttribute('aria-pressed', 'false');
    toggle.querySelector('.video-frame__sound-text').textContent = 'Turn up your volume and listen';
  };

  toggle.addEventListener('click', () => {
    if (video.muted) unmute(); else mute();
  });

  // If the browser happens to allow it, try an early unmuted autoplay once;
  // if that fails (most browsers), the muted autoplay already in the markup
  // keeps playing and the prompt above stays put until someone taps it.
}
