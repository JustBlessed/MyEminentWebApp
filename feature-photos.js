"use strict";

const photoSections = document.querySelectorAll('[data-optional-photo]');
const stories = document.getElementById('photo-stories');
photoSections.forEach(img => {
  const showWhenLoaded = () => {
    img.closest('[data-photo-frame]').classList.add('photo-ready');
    if (img.closest('.hero-layout')) img.closest('.hero-layout').classList.add('hero-has-photo');
    if (img.closest('.feature-grid')) img.closest('.feature-grid').classList.add('about-has-photo');
    if (img.closest('.photo-stories-grid')) stories.hidden = false;
  };
  if (img.complete && img.naturalWidth > 0) showWhenLoaded();
  else img.addEventListener('load', showWhenLoaded, { once: true });
});


const featureDialog = document.getElementById('feature-photo-dialog');
const featureFull = document.getElementById('feature-photo-full');
const featureCaption = document.getElementById('feature-photo-caption');
const featureClose = document.getElementById('feature-photo-close');
let previouslyFocusedPhoto = null;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-feature-photo]');
  if (!trigger) return;
  previouslyFocusedPhoto = trigger;
  const photo = trigger.querySelector('img');
  featureFull.src = trigger.dataset.featurePhoto;
  featureFull.alt = photo ? photo.alt : '';
  featureCaption.textContent = trigger.dataset.featureCaption || '';
  featureDialog.showModal();
  featureClose.focus();
});
featureClose.addEventListener('click', () => featureDialog.close());
featureDialog.addEventListener('click', event => {
  if (event.target === featureDialog) featureDialog.close();
});
featureDialog.addEventListener('close', () => {
  featureFull.removeAttribute('src');
  if (previouslyFocusedPhoto && previouslyFocusedPhoto.isConnected) previouslyFocusedPhoto.focus();
});
