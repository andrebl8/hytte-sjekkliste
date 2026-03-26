function toggle(li) {
  li.classList.toggle('done');
  updateAll();
}

function updateAll() {
  updateSection('arrive', 5, 'prog-arrive', 'prog-arrive-label');
  updateSection('depart', 14, 'prog-depart', 'prog-depart-label');
}

function updateSection(listId, total, barId, labelId) {
  const list = document.getElementById(listId);
  const done = list.querySelectorAll('li.done').length;
  document.getElementById(barId).style.width = (done / total * 100) + '%';
  document.getElementById(labelId).textContent = `${done} / ${total} fullført`;
}

updateAll();

// PWA install prompt
let deferredPrompt = null;
const banner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');
const dismissBtn = document.getElementById('dismiss-btn');

function showBanner() {
  if (sessionStorage.getItem('install-dismissed')) return;
  banner.classList.remove('hidden');
}

// Android / Chrome
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  showBanner();
});

installBtn.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
  }
  banner.classList.add('hidden');
});

dismissBtn.addEventListener('click', () => {
  banner.classList.add('hidden');
  sessionStorage.setItem('install-dismissed', '1');
});

// iOS Safari — no beforeinstallprompt, show manual tip
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandalone = window.navigator.standalone;
if (isIos && !isInStandalone) {
  document.getElementById('banner-title').textContent = 'Lagre på hjemskjermen';
  document.getElementById('banner-desc').textContent = 'Trykk \uF08A og velg «Legg til på Hjem-skjerm»';
  installBtn.style.display = 'none';
  showBanner();
}

// Service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
