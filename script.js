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
  'assets/banners/banner-10.jpg',
  'assets/banners/banner-11.jpg',
  'assets/banners/banner-12.jpg',
  'assets/banners/banner-13.jpg',
  'assets/banners/banner-14.jpg',
  'assets/banners/banner-15.jpg',
  'assets/banners/banner-16.jpg',
  'assets/banners/banner-17.jpg',
  'assets/banners/banner-18.jpg',
  'assets/banners/banner-19.jpg',
  'assets/banners/banner-20.jpg',
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

// -----------------------------------------------------------------------------
// Dynamic Multi-Tone Palette Extractor & Living Theme Synchronizer
// Samples distinct dominant & complementary hues from the banner to power living aurora
// -----------------------------------------------------------------------------

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function extractAndApplyBannerTheme(imgElement) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 48;
    canvas.height = 24;
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const candidates = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const [h, s, l] = rgbToHsl(r, g, b);
      if (s > 25 && l > 18 && l < 82) {
        candidates.push({ r, g, b, h, s, l, score: s * 1.5 + (50 - Math.abs(50 - l)) });
      }
    }

    candidates.sort((a, b) => b.score - a.score);

    let c1 = candidates[0] ? [candidates[0].r, candidates[0].g, candidates[0].b] : [154, 52, 18];
    let c2 = null;
    let c3 = null;

    if (candidates[0]) {
      const baseHue = candidates[0].h;
      for (let i = 1; i < candidates.length; i++) {
        const diff = Math.abs(candidates[i].h - baseHue);
        if (diff > 35 && diff < 325) {
          c2 = [candidates[i].r, candidates[i].g, candidates[i].b];
          break;
        }
      }
      for (let i = 1; i < candidates.length; i++) {
        const c = candidates[i];
        if (c2 && (c.r !== c2[0] || c.g !== c2[1])) {
          c3 = [c.r, c.g, c.b];
          break;
        }
      }
    }

    if (!c2) {
      const [h, s, l] = rgbToHsl(c1[0], c1[1], c1[2]);
      c2 = hslToRgb((h + 45) % 360, Math.min(s + 15, 95), Math.max(l - 10, 30));
    }
    if (!c3) {
      const [h, s, l] = rgbToHsl(c1[0], c1[1], c1[2]);
      c3 = hslToRgb((h + 180) % 360, Math.min(s + 10, 90), Math.min(l + 15, 75));
    }

    const root = document.documentElement;
    const str1 = `${c1[0]}, ${c1[1]}, ${c1[2]}`;
    const str2 = `${c2[0]}, ${c2[1]}, ${c2[2]}`;
    const str3 = `${c3[0]}, ${c3[1]}, ${c3[2]}`;

    root.style.setProperty('--banner-c1-rgb', str1);
    root.style.setProperty('--banner-c2-rgb', str2);
    root.style.setProperty('--banner-c3-rgb', str3);

    root.style.setProperty('--banner-c1', `rgb(${str1})`);
    root.style.setProperty('--banner-c2', `rgb(${str2})`);
    root.style.setProperty('--banner-c3', `rgb(${str3})`);

    root.style.setProperty('--banner-c1-glow', `rgba(${str1}, 0.28)`);
    root.style.setProperty('--banner-c2-glow', `rgba(${str2}, 0.22)`);

    root.style.setProperty('--banner-gradient', `linear-gradient(135deg, rgb(${str1}), rgb(${str2}))`);
    root.style.setProperty('--banner-accent', `rgb(${str1})`);

    // Update Live Palette Swatches
    const s1 = document.getElementById('swatch-1');
    const s2 = document.getElementById('swatch-2');
    const s3 = document.getElementById('swatch-3');
    if (s1) {
      s1.style.backgroundColor = `rgb(${str1})`;
      s1.title = `Primary Hue: rgb(${str1})`;
      s1.onclick = () => {
        root.style.setProperty('--banner-gradient', `linear-gradient(135deg, rgb(${str1}), rgb(${str2}))`);
        showToast('Primary banner accent activated!');
      };
    }
    if (s2) {
      s2.style.backgroundColor = `rgb(${str2})`;
      s2.title = `Secondary Hue: rgb(${str2})`;
      s2.onclick = () => {
        root.style.setProperty('--banner-gradient', `linear-gradient(135deg, rgb(${str2}), rgb(${str1}))`);
        showToast('Secondary banner accent flipped!');
      };
    }
    if (s3) {
      s3.style.backgroundColor = `rgb(${str3})`;
      s3.title = `Complementary Hue: rgb(${str3})`;
      s3.onclick = () => {
        root.style.setProperty('--banner-gradient', `linear-gradient(135deg, rgb(${str3}), rgb(${str1}))`);
        showToast('Ambient complementary tone activated!');
      };
    }
  } catch (err) {
    // Graceful fallback
  }
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
    extractAndApplyBannerTheme(preloader);
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
const GITHUB_CACHE_KEY = 'plotfolio-github-repos-cache';
const GITHUB_CACHE_TIME_KEY = 'plotfolio-github-repos-time';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes cache

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

    // Filter: only original non-fork repos, excluding profile and website repos
    const filtered = repos.filter(repo =>
      !repo.fork &&
      repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() &&
      repo.name.toLowerCase() !== 'plotfolio'
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
  initLiveProjects();
  printConsoleWelcome();
});
