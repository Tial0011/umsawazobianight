/* The Night / Programme — structured data.
   Replace or extend these entries once the real running order is confirmed.
   Each entry: { time, title, description, placeholder }.
   Set placeholder: true for a "coming soon" slot with no confirmed time. */
export const programme = [
  {
    time: '04:00 PM',
    title: 'Doors Open · Red Carpet',
    description: 'Arrive in your cultural attire, step out on the red carpet and find your spot at NIEPA Field.',
  },
  {
    time: '05:00 PM',
    title: 'Programme Begins',
    description: 'The main programme for the night gets underway.',
  },
  {
    time: '',
    title: 'Eat · Drink · Dance',
    description: 'Small chops, drinks and the dance floor open up.',
  },
  {
    time: '',
    title: 'Celebrate · Connect · Experience',
    description: 'Performances, culture showcases and moments to connect with people from every tribe in the room.',
  },
  {
    time: 'Late',
    title: 'Wazobia Night',
    description: 'The celebration carries on into the night.',
  },
];

export function initProgramme() {
  const list = document.querySelector('[data-programme-list]');
  if (!list) return;

  list.innerHTML = programme
    .map((item) => {
      const rowClass = item.placeholder ? ' programme__row--placeholder' : '';
      const time = item.time
        ? `<p class="programme__time">${item.time}</p>`
        : '<p class="programme__time" aria-hidden="true">&nbsp;</p>';
      return `
        <li class="programme__row${rowClass}">
          <span class="programme__dot" aria-hidden="true"></span>
          ${time}
          <p class="programme__row-title">${item.title}</p>
          <p class="programme__row-desc">${item.description}</p>
        </li>`;
    })
    .join('');
}
