/**
 * Personal Portfolio — Core Scripts
 * Clean, lightweight Vanilla JS without external dependencies.
 * Author: Akhilesh Pratap Pandey (@heyitsak)
 */

'use strict';

// -----------------------------------------------------------------------------
// Dynamic Banner Pool (Rotates on Page Refresh / Revisit)
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

function initDynamicBanner() {
  const bannerImg = document.getElementById('discord-banner');
  if (!bannerImg || BANNER_POOL.length === 0) return;

  const lastIdx = parseInt(sessionStorage.getItem(LAST_BANNER_KEY), 10);
  let nextIdx;

  // Pick a random banner different from the previous one
  if (!isNaN(lastIdx) && BANNER_POOL.length > 1) {
    do {
      nextIdx = Math.floor(Math.random() * BANNER_POOL.length);
    } while (nextIdx === lastIdx);
  } else {
    nextIdx = Math.floor(Math.random() * BANNER_POOL.length);
  }

  sessionStorage.setItem(LAST_BANNER_KEY, nextIdx.toString());

  // Apply new banner
  bannerImg.src = BANNER_POOL[nextIdx];
  bannerImg.alt = `Profile banner aesthetic #${nextIdx + 1}`;
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
// Lifecycle Initialization
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initDynamicBanner();
});
