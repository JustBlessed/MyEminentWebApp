"use strict";
// The photos remain unchanged. Interactive enlargement is optional;
// the photo grid remains fully visible if JavaScript is disabled.
const photos = Array.from(document.querySelectorAll('.gallery-card'));
const dialog = document.getElementById('gallery-dialog');
const image = document.getElementById('gallery-full-image');
const caption = document.getElementById('gallery-dialog-caption');
const closeButton = document.getElementById('gallery-close');
let currentIndex = 0;
let lastTrigger = null;

function displayPhoto(index) {
  currentIndex = (index + photos.length) % photos.length;
  const card = photos[currentIndex];
  const photo = card.querySelector('img');
  image.src = photo.getAttribute('src');
  image.alt = photo.alt;
  caption.textContent = card.querySelector('figcaption').textContent;
}

photos.forEach((card, index) => {
  card.querySelector('button').addEventListener('click', event => {
    lastTrigger = event.currentTarget;
    displayPhoto(index);
    dialog.showModal();
    closeButton.focus();
  });
});

document.getElementById('gallery-prev').addEventListener('click', () => displayPhoto(currentIndex - 1));
document.getElementById('gallery-next').addEventListener('click', () => displayPhoto(currentIndex + 1));
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus(); });
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); displayPhoto(currentIndex + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); displayPhoto(currentIndex - 1); }
});

const menu = document.getElementById('menu-toggle');
const navigation = document.getElementById('primary-navigation');
menu.addEventListener('click', () => {
  const opened = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(opened));
  menu.setAttribute('aria-label', opened ? 'Close navigation menu' : 'Open navigation menu');
  navigation.classList.toggle('open', opened);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 790) {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation menu');
    navigation.classList.remove('open');
  }
});
