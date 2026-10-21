const root = document.documentElement;
const body = document.body;
const cursor = document.querySelector('.cursor-orbit');
const eyes = document.querySelectorAll('.eye i');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.reveal').forEach((element, index) => {
  if (index < 4) setTimeout(() => element.classList.add('in'), 120 + index * 100);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal:not(.in)').forEach((element) => revealObserver.observe(element));

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    const eyeX = (event.clientX / window.innerWidth - 0.5) * 13;
    const eyeY = (event.clientY / window.innerHeight - 0.5) * 10;
    eyes.forEach((eye) => {
      eye.style.setProperty('--eye-x', `${eyeX}px`);
      eye.style.setProperty('--eye-y', `${eyeY}px`);
    });
  });

  document.querySelectorAll('a, button, summary').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -7}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

const chaosButton = document.querySelector('.chaos-toggle');
chaosButton.addEventListener('click', () => {
  const active = body.classList.toggle('chaos');
  chaosButton.setAttribute('aria-pressed', String(active));
  chaosButton.querySelector('.toggle-label').textContent = active ? 'Прибрати хаос' : 'Додати хаосу';
});

function updateClock() {
  const time = new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Europe/Kyiv'
  }).format(new Date());
  document.querySelector('.live-time').textContent = `${time} КИЇВ`;
}
updateClock();
setInterval(updateClock, 1000);

const ideas = [
  ['Радіо для', 'кімнатних', 'рослин.'],
  ['Музей запахів', 'у вигляді', 'відеогри.'],
  ['Шрифт, який', 'соромиться', 'голосних.'],
  ['Кафе для тих,', 'хто говорить', 'із котами.'],
  ['Погода, яку', 'можна вдягти', 'на себе.'],
  ['Космічна опера', 'про останній', 'вареник.'],
  ['Журнал, що', 'читає тебе', 'у відповідь.']
];
let ideaIndex = 1;

document.querySelector('.idea-button').addEventListener('click', () => {
  let next = Math.floor(Math.random() * ideas.length);
  if (next === ideaIndex) next = (next + 1) % ideas.length;
  ideaIndex = next;
  const output = document.querySelector('#idea-output');
  const card = document.querySelector('.idea-card');
  card.animate([
    { transform: 'rotate(2deg) scale(1)' },
    { transform: 'rotate(-5deg) scale(.94)' },
    { transform: 'rotate(2deg) scale(1)' }
  ], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
  output.innerHTML = ideas[next].join('<br>');
  const number = Number(document.querySelector('.idea-count b').textContent) + 1;
  document.querySelector('.idea-count b').textContent = String(number).padStart(3, '0');
});

document.querySelector('.contact-button').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const email = button.dataset.email;
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = `Скопійовано: ${email}`;
    button.querySelector('span:first-child').textContent = 'Сигнал спіймано!';
  } catch {
    status.textContent = `Демонстраційна адреса: ${email}`;
  }
});

document.querySelectorAll('details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('details[open]').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

