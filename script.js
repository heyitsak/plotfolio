/**
 * Personal Portfolio — Core Scripts
 * Clean, lightweight Vanilla JS without external dependencies.
 * Author: Ak (@heyitsak)
 */

'use strict';

// -----------------------------------------------------------------------------
// Dynamic Curated Banner Pool & Bespoke Color Themes
// Hand-crafted color palettes paired with each banner artwork for 100% reliable,
// zero-latency dynamic theming across both Light and Dark modes.
// -----------------------------------------------------------------------------

const BANNER_THEMES = [
  { src: "assets/banners/banner-1.jpg",  name: "Oceanic Teal",     hue: 192, sat: "82%" },
  { src: "assets/banners/banner-2.jpg",  name: "Sakura Magenta",    hue: 346, sat: "88%" },
  { src: "assets/banners/banner-3.jpg",  name: "Periwinkle Blue",   hue: 226, sat: "80%" },
  { src: "assets/banners/banner-4.jpg",  name: "Amethyst Violet",   hue: 282, sat: "82%" },
  { src: "assets/banners/banner-5.jpg",  name: "Blush Rose",        hue: 336, sat: "84%" },
  { src: "assets/banners/banner-6.jpg",  name: "Cyber Violet",      hue: 268, sat: "88%" },
  { src: "assets/banners/banner-7.jpg",  name: "Warm Coral",        hue: 6,   sat: "84%" },
  { src: "assets/banners/banner-8.jpg",  name: "Bubblegum Pink",    hue: 330, sat: "94%" },
  { src: "assets/banners/banner-9.jpg",  name: "Tokyo Crimson",     hue: 354, sat: "88%" },
  { src: "assets/banners/banner-10.jpg", name: "Cyberpunk Amber",   hue: 38,  sat: "92%" },
  { src: "assets/banners/banner-11.jpg", name: "Sunlit Gold",       hue: 48,  sat: "88%" },
  { src: "assets/banners/banner-12.jpg", name: "Neon Ice Cyan",     hue: 196, sat: "90%" },
  { src: "assets/banners/banner-13.jpg", name: "Mint Emerald",      hue: 158, sat: "82%" },
  { src: "assets/banners/banner-14.jpg", name: "Electric Lilac",    hue: 264, sat: "86%" },
  { src: "assets/banners/banner-15.jpg", name: "Canary Gold",       hue: 46,  sat: "94%" },
  { src: "assets/banners/banner-16.jpg", name: "Royal Lavender",    hue: 260, sat: "80%" },
  { src: "assets/banners/banner-17.jpg", name: "Warm Terracotta",   hue: 24,  sat: "84%" },
  { src: "assets/banners/banner-18.jpg", name: "Dreamy Rose",       hue: 340, sat: "86%" },
  { src: "assets/banners/banner-19.jpg", name: "Sunset Peach",      hue: 14,  sat: "84%" },
  { src: "assets/banners/banner-20.jpg", name: "Deep Indigo",       hue: 242, sat: "86%" },
];

const LAST_BANNER_KEY = "portfolio-last-banner-idx";

function getRandomBannerIndex(currentIdx) {
  if (BANNER_THEMES.length <= 1) return 0;
  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * BANNER_THEMES.length);
  } while (nextIdx === currentIdx);
  return nextIdx;
}

function applyBanner(index) {
  const bannerImg = document.getElementById("discord-banner");
  const theme = BANNER_THEMES[index];
  if (!bannerImg || !theme) return;

  sessionStorage.setItem(LAST_BANNER_KEY, index.toString());

  // Instantly synchronize site-wide theme accents (0ms latency, zero canvas CORS limitations)
  const root = document.documentElement;
  root.style.setProperty("--accent-h", String(theme.hue));
  root.style.setProperty("--accent-s", theme.sat);

  // Smooth crossfade image load
  bannerImg.style.opacity = "0.35";
  const preloader = new Image();
  preloader.src = theme.src;
  preloader.onload = () => {
    bannerImg.src = theme.src;
    bannerImg.alt = `Profile aesthetic banner: ${theme.name}`;
    bannerImg.style.opacity = "1";
  };
}

function initDynamicBanner() {
  const bannerImg = document.getElementById("discord-banner");
  if (!bannerImg || BANNER_THEMES.length === 0) return;

  const lastIdx = parseInt(sessionStorage.getItem(LAST_BANNER_KEY), 10);
  const initialIdx = isNaN(lastIdx) 
    ? Math.floor(Math.random() * BANNER_THEMES.length) 
    : getRandomBannerIndex(lastIdx);

  applyBanner(initialIdx);

  // Click banner to explore another aesthetic
  const bannerContainer = document.querySelector(".discord-banner-container");
  if (bannerContainer) {
    bannerContainer.style.cursor = "pointer";
    bannerContainer.title = "Click to explore another aesthetic";
    bannerContainer.addEventListener("click", () => {
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

function toggleTheme(event) {
  const toggleBtn = document.getElementById('theme-toggle');
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Playful button spring spin
  if (toggleBtn) {
    toggleBtn.classList.remove('is-spinning');
    void toggleBtn.offsetWidth;
    toggleBtn.classList.add('is-spinning');
  }

  // Fallback if View Transitions API is unsupported
  if (!document.startViewTransition) {
    applyTheme(nextTheme);
    return;
  }

  // Calculate coordinates for expanding circular ripple mask
  const rect = toggleBtn 
    ? toggleBtn.getBoundingClientRect() 
    : { left: window.innerWidth / 2, top: 0, width: 0, height: 0 };
  const x = event && event.clientX ? event.clientX : rect.left + rect.width / 2;
  const y = event && event.clientY ? event.clientY : rect.top + rect.height / 2;

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(() => {
    applyTheme(nextTheme);
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 480,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  });
}

function initThemeSwitcher() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  applyTheme(getInitialTheme());

  toggleBtn.addEventListener('click', (event) => {
    toggleTheme(event);
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
// Live GitHub Projects Synchronizer (Fetches Top 3 Recent Original Repos)
// -----------------------------------------------------------------------------

const GITHUB_USERNAME = 'heyitsak';
const GITHUB_CACHE_KEY = 'plotfolio-github-repos-v3';
const GITHUB_CACHE_TIME_KEY = 'plotfolio-github-repos-time-v3';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache

async function fetchLiveProjects() {
  const cachedData = localStorage.getItem(GITHUB_CACHE_KEY);
  const cachedTime = localStorage.getItem(GITHUB_CACHE_TIME_KEY);
  const now = Date.now();

  if (cachedData && cachedTime && (now - parseInt(cachedTime, 10)) < CACHE_DURATION_MS) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      // Fall through to live network fetch
    }
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
      { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const repos = await response.json();

    // Filter: only original non-fork repos (including this portfolio itself!)
    const filtered = repos.filter(repo =>
      !repo.fork &&
      repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase()
    );

    // Keep top 3 most recently updated
    const topThree = filtered.slice(0, 3);

    localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(topThree));
    localStorage.setItem(GITHUB_CACHE_TIME_KEY, now.toString());
    return topThree;
  } catch (err) {
    console.warn('Live GitHub fetch fallback: keeping pre-rendered projects.', err);
    return null;
  }
}

function formatRepoTitle(name) {
  const customMap = {
    'plotfolio': 'Plotfolio',
    'polycoder': 'PolyCoder',
    'gpchopan-website': 'GPChopan Website',
    'news-map': 'News Map',
    'codeforge': 'CodeForge',
    'onex-portal': 'OneX Portal',
    'onex-spacetech': 'OneX SpaceTech',
    'gpchopan-website-redesign': 'GPChopan Redesign',
  };
  if (customMap[name.toLowerCase()]) {
    return customMap[name.toLowerCase()];
  }
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatRepoDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function renderProjects(repos) {
  const container = document.getElementById('projects-container');
  if (!container || !repos || !repos.length) return;

  container.innerHTML = repos.map(repo => {
    const formattedTitle = formatRepoTitle(repo.name);
    const dateStr = formatRepoDate(repo.updated_at);
    const lang = repo.language || 'Software';
    const stars = repo.stargazers_count > 0 
      ? `<span class="star-count" title="${repo.stargazers_count} star on GitHub">★ ${repo.stargazers_count}</span>` 
      : '';
    const demoLink = repo.homepage 
      ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link-btn"><span>Live Demo</span><span aria-hidden="true">↗</span></a>` 
      : '';

    return `
      <article class="project-card">
        <div>
          <div class="project-header">
            <h3 class="project-title">
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                ${formattedTitle}
                <span class="project-arrow" aria-hidden="true">↗</span>
              </a>
            </h3>
            <div class="project-meta-right">
              ${stars}
              <span class="project-meta">${dateStr}</span>
            </div>
          </div>
          <p class="project-description">
            ${repo.description || 'Modern software engineering repository on GitHub.'}
          </p>
          <ul class="project-tags" aria-label="Technologies used">
            <li class="tech-tag">${lang}</li>
            ${(repo.topics || []).slice(0, 3).map(t => `<li class="tech-tag">${t}</li>`).join('')}
          </ul>
        </div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link-btn">
            <span>View Source</span>
            <span aria-hidden="true">↗</span>
          </a>
          ${demoLink}
        </div>
      </article>
    `;
  }).join('');
}

async function initLiveProjects() {
  const repos = await fetchLiveProjects();
  if (repos && repos.length) {
    renderProjects(repos);
  }
}

// -----------------------------------------------------------------------------
// Developer Console Easter Egg
// -----------------------------------------------------------------------------

function printConsoleWelcome() {
  const banner = `
  ┌──────────────────────────────────────────────┐
  │  ✦ Crafted with care by Ak (@heyitsak) │
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

// -----------------------------------------------------------------------------
// Discord Custom Status Randomizer
// -----------------------------------------------------------------------------

const CUSTOM_STATUSES = [
  { emoji: "🏴‍☠️", text: "sailing uncharted waters" },
  { emoji: "🧭", text: "searching for the next treasure" },
  { emoji: "🌊", text: "sailing an endless ocean" },
  { emoji: "💤", text: "offline most of the time" },
];

function initCustomStatus() {
  const emojiEl = document.getElementById("custom-status-emoji");
  const textEl = document.getElementById("custom-status-text");
  if (!emojiEl || !textEl || CUSTOM_STATUSES.length === 0) return;

  const randomIdx = Math.floor(Math.random() * CUSTOM_STATUSES.length);
  const status = CUSTOM_STATUSES[randomIdx];
  emojiEl.textContent = status.emoji;
  textEl.textContent = status.text;
}

// -----------------------------------------------------------------------------
// Dynamic Footer Quote Randomizer
// True random selection on every page load/refresh
// -----------------------------------------------------------------------------

const FOOTER_QUOTES = [
  "“Sailing an ocean of knowledge; hunting wisdom instead of gold.”",
  "“A pirate across the oceans of knowledge, taking nothing that isn’t freely given.”",
];

function initFooterQuote() {
  const quoteEl = document.getElementById("footer-quote-text");
  if (!quoteEl || FOOTER_QUOTES.length === 0) return;

  // Pure random selection on every refresh (independent probability)
  const randomIdx = Math.floor(Math.random() * FOOTER_QUOTES.length);
  quoteEl.textContent = FOOTER_QUOTES[randomIdx];

}

// -----------------------------------------------------------------------------
// Lifecycle Initialization
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initDynamicBanner();
  initCopyEmailButton();
  initLiveProjects();
  initCustomStatus();
  initFooterQuote();
  printConsoleWelcome();
});
