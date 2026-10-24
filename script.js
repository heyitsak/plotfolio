/**
 * Personal Portfolio — Core Scripts
 * Clean, lightweight Vanilla JS without external dependencies.
 * Author: Akhilesh Pratap Pandey (@heyitsak)
 */

'use strict';

// -----------------------------------------------------------------------------
// Dynamic Banner Pool (Rotates on Page Refresh / Revisit & Click)
// -----------------------------------------------------------------------------

const BANNER_POOL = [
  'assets/banners/banner-1.jpg',
  'assets/banners/banner-2.jpg',
  'assets/banners/banner-3.jpg',
  'assets/banners/banner-4.jpg',
  'assets/banners/banner-5.jpg',
  'assets/banners/banner-6.jpg',
  'assets/banners/banner-7.jpg',
  'assets/banners/banner-8.jpg',
  'assets/banners/banner-9.jpg',
];

const LAST_BANNER_KEY = 'portfolio-last-banner-idx';

function getRandomBannerIndex(currentIdx) {
  if (BANNER_POOL.length <= 1) return 0;
  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * BANNER_POOL.length);
  } while (nextIdx === currentIdx);
  return nextIdx;
}

function applyBanner(index) {
  const bannerImg = document.getElementById('discord-banner');
  if (!bannerImg || !BANNER_POOL[index]) return;

  sessionStorage.setItem(LAST_BANNER_KEY, index.toString());

  // Subtle smooth crossfade
  bannerImg.style.opacity = '0.4';
  const preloader = new Image();
  preloader.src = BANNER_POOL[index];
  preloader.onload = () => {
    bannerImg.src = BANNER_POOL[index];
    bannerImg.alt = `Profile aesthetic banner #${index + 1}`;
    bannerImg.style.opacity = '1';
  };
}

function initDynamicBanner() {
  const bannerImg = document.getElementById('discord-banner');
  if (!bannerImg || BANNER_POOL.length === 0) return;

  const lastIdx = parseInt(sessionStorage.getItem(LAST_BANNER_KEY), 10);
  const initialIdx = isNaN(lastIdx) 
    ? Math.floor(Math.random() * BANNER_POOL.length) 
    : getRandomBannerIndex(lastIdx);

  applyBanner(initialIdx);

  // Allow clicking the overlay badge to cycle through banners instantly
  const shuffleBtn = document.getElementById('banner-shuffle-btn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentIdx = parseInt(sessionStorage.getItem(LAST_BANNER_KEY), 10) || 0;
      const nextIdx = getRandomBannerIndex(currentIdx);
      applyBanner(nextIdx);
    });
  }
}

// -----------------------------------------------------------------------------
// Theme Management (Light / Dark Mode with System Preference Sync)
// -----------------------------------------------------------------------------

const THEME_STORAGE_KEY = 'portfolio-theme-preference';

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function initThemeSwitcher() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  applyTheme(getInitialTheme());

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// -----------------------------------------------------------------------------
// Interactive Email Copy & Toast Notification
// -----------------------------------------------------------------------------

function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span><span>${message}</span>`;
  toast.classList.add('show');

  if (toast._timer) {
    clearTimeout(toast._timer);
  }

  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function initCopyEmailButton() {
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  if (!copyButtons.length) return;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-copy-email') || 'heyitsak@users.noreply.github.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email address copied to clipboard!');
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Developer Console Easter Egg
// -----------------------------------------------------------------------------

function printConsoleWelcome() {
  const banner = `
  ┌──────────────────────────────────────────────┐
  │  ✦ Crafted with care by Akhilesh (@heyitsak) │
  │  Discord-style dynamic banner architecture   │
  │  100% semantic HTML, vanilla CSS & modern JS │
  │  Thanks for inspecting! Have a great day. ☕ │
  └──────────────────────────────────────────────┘
  `;
  console.log(`%c${banner}`, 'color: #9a3412; font-family: monospace; font-size: 12px; font-weight: bold;');
}

// -----------------------------------------------------------------------------
// Lifecycle Initialization
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initDynamicBanner();
  initCopyEmailButton();
  printConsoleWelcome();
});
