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
// Atmospheric Corner Butterfly Sanctuary (The Last of Us Inspired Signature)
// High-performance canvas rendering with 3D wing-flap perspective,
// natural flap-and-glide flight cycles, glowing spore trails, and gentle cursor evasion.
// -----------------------------------------------------------------------------

function initButterflySanctuary() {
  const canvas = document.getElementById('butterfly-sanctuary');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = null;
  let isTabActive = true;

  // Track cursor for gentle proximity evasion
  const mouse = { x: -9999, y: -9999, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Responsive canvas sizing with retina crispness
  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // Spore (luminous dust mote) particle pool
  const spores = [];
  const MAX_SPORES = 48;

  function spawnSpore(x, y, isDarkMode) {
    if (spores.length >= MAX_SPORES) return;
    spores.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.15 + Math.random() * 0.35,
      radius: 0.6 + Math.random() * 1.2,
      alpha: 0.7 + Math.random() * 0.3,
      decay: 0.004 + Math.random() * 0.006,
      isDark: isDarkMode
    });
  }

  // Butterfly entity with organic flight dynamics
  class Butterfly {
    constructor(id, scaleMultiplier, anchorOffsetX, anchorOffsetY) {
      this.id = id;
      this.scale = scaleMultiplier;
      this.anchorOffsetX = anchorOffsetX;
      this.anchorOffsetY = anchorOffsetY;

      // Position & Velocity
      this.x = width * 0.85 + anchorOffsetX;
      this.y = height * 0.15 + anchorOffsetY;
      this.vx = 0;
      this.vy = 0;
      this.heading = -Math.PI * 0.25;

      // Wing animation states
      this.wingPhase = Math.random() * Math.PI * 2;
      this.wingSpeed = 0.28;
      this.mode = 'flutter'; // 'flutter' or 'glide'
      this.modeTimer = 30 + Math.random() * 60;

      // Individual oscillation offsets
      this.timeOffset = Math.random() * 1000;
      this.evasionAlert = 0;
    }

    update(now, isDarkMode) {
      // Dynamic Sanctuary Anchor in the upper-right corner
      // Shifts slightly towards center on smaller screens for perfect framing
      const sanctuaryX = width > 768 ? width * 0.84 + this.anchorOffsetX : width * 0.76 + this.anchorOffsetX * 0.6;
      const sanctuaryY = width > 768 ? height * 0.16 + this.anchorOffsetY : height * 0.12 + this.anchorOffsetY * 0.6;

      // Mode cycle: alternating between active fluttering and serene gliding
      this.modeTimer--;
      if (this.modeTimer <= 0) {
        if (this.mode === 'flutter') {
          this.mode = 'glide';
          this.modeTimer = 45 + Math.random() * 75;
        } else {
          this.mode = 'flutter';
          this.modeTimer = 30 + Math.random() * 50;
        }
      }

      // Proximity cursor evasion
      const dxMouse = this.x - mouse.x;
      const dyMouse = this.y - mouse.y;
      const distMouse = Math.hypot(dxMouse, dyMouse);
      const evasionRadius = 145;

      let ax = 0;
      let ay = 0;

      if (mouse.active && distMouse < evasionRadius) {
        this.mode = 'flutter';
        this.evasionAlert = Math.min(1, this.evasionAlert + 0.1);
        const pushForce = ((evasionRadius - distMouse) / evasionRadius) * 0.9;
        ax += (dxMouse / (distMouse || 1)) * pushForce;
        ay += (dyMouse / (distMouse || 1)) * pushForce;

        if (Math.random() < 0.3) {
          spawnSpore(this.x, this.y, isDarkMode);
        }
      } else {
        this.evasionAlert = Math.max(0, this.evasionAlert - 0.02);
      }

      // Sanctuary homing pull gently drawing them back to their corner home
      const dxHome = sanctuaryX - this.x;
      const dyHome = sanctuaryY - this.y;
      const distHome = Math.hypot(dxHome, dyHome);
      const homeForce = 0.0018 + (distHome > 200 ? 0.003 : 0);
      ax += dxHome * homeForce;
      ay += dyHome * homeForce;

      // Organic Lissajous & sinusoidal atmospheric wandering
      const t = (now * 0.001) + this.timeOffset;
      const wanderX = Math.cos(t * 1.1) * 0.22 + Math.sin(t * 2.3) * 0.12;
      const wanderY = Math.sin(t * 0.9) * 0.20 + Math.cos(t * 1.7) * 0.15;
      ax += wanderX;
      ay += wanderY;

      // Integrate velocity with gentle air resistance
      const friction = this.mode === 'glide' ? 0.975 : 0.94;
      this.vx = (this.vx + ax) * friction;
      this.vy = (this.vy + ay) * friction;

      // Clamp max velocity
      const maxSpeed = 3.2 + this.evasionAlert * 2.0;
      const currentSpeed = Math.hypot(this.vx, this.vy);
      if (currentSpeed > maxSpeed) {
        this.vx = (this.vx / currentSpeed) * maxSpeed;
        this.vy = (this.vy / currentSpeed) * maxSpeed;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Keep within bounds of sanctuary quadrant with soft padding
      if (this.x > width - 15) { this.x = width - 15; this.vx *= -0.5; }
      if (this.x < width * 0.45) { this.x = width * 0.45; this.vx *= -0.5; }
      if (this.y < 15) { this.y = 15; this.vy *= -0.5; }
      if (this.y > height * 0.55) { this.y = height * 0.55; this.vy *= -0.5; }

      // Update heading angle towards movement vector with smooth interpolation
      if (currentSpeed > 0.1) {
        const targetAngle = Math.atan2(this.vy, this.vx) + Math.PI / 2;
        let diff = targetAngle - this.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.heading += diff * 0.12;
      }

      // Wing flapping speed & phase
      if (this.mode === 'flutter' || this.evasionAlert > 0.2) {
        const speedBoost = 1 + this.evasionAlert * 0.8;
        this.wingSpeed = 0.32 * speedBoost;
        this.wingPhase += this.wingSpeed;

        if (Math.random() < 0.08) {
          spawnSpore(this.x, this.y, isDarkMode);
        }
      } else {
        this.wingSpeed = 0.04;
        this.wingPhase += this.wingSpeed;
      }
    }

    draw(ctx, isDarkMode) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.heading);

      const s = this.scale;

      // 3D Perspective Wing Flap illusion via horizontal cosine projection
      let flapSpan;
      if (this.mode === 'flutter' || this.evasionAlert > 0.2) {
        flapSpan = Math.abs(Math.cos(this.wingPhase));
        flapSpan = 0.08 + flapSpan * 0.92;
      } else {
        flapSpan = 0.82 + Math.sin(this.wingPhase) * 0.14;
      }

      // Palette selection matching active mode
      const wingFill = isDarkMode
        ? 'rgba(255, 255, 255, 0.82)'
        : 'rgba(38, 45, 56, 0.78)';
      const wingAccent = isDarkMode
        ? 'rgba(235, 245, 255, 0.45)'
        : 'rgba(50, 60, 75, 0.35)';
      const bodyColor = isDarkMode
        ? 'rgba(220, 230, 245, 0.92)'
        : 'rgba(25, 30, 38, 0.88)';
      const glowColor = isDarkMode
        ? 'rgba(255, 255, 255, 0.45)'
        : 'rgba(60, 75, 95, 0.25)';

      // Soft ethereal atmospheric radiance
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = isDarkMode ? 10 * s : 4 * s;

      // Left Wing
      ctx.save();
      ctx.scale(-flapSpan, 1);
      this.drawHalfWings(ctx, s, wingFill, wingAccent);
      ctx.restore();

      // Right Wing
      ctx.save();
      ctx.scale(flapSpan, 1);
      this.drawHalfWings(ctx, s, wingFill, wingAccent);
      ctx.restore();

      ctx.shadowBlur = 0;

      // Slender Body & Antennae
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.ellipse(0, 1 * s, 1.1 * s, 6.5 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(0, -6 * s, 1.4 * s, 0, Math.PI * 2);
      ctx.fill();

      // Delicate curved antennae
      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = 0.75 * s;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(-0.5 * s, -7 * s);
      ctx.quadraticCurveTo(-3 * s, -11 * s, -5 * s, -12 * s);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0.5 * s, -7 * s);
      ctx.quadraticCurveTo(3 * s, -11 * s, 5 * s, -12 * s);
      ctx.stroke();

      ctx.restore();
    }

    drawHalfWings(ctx, s, wingFill, wingAccent) {
      // Forewing (Upper Wing)
      ctx.beginPath();
      ctx.moveTo(0.8 * s, -1 * s);
      ctx.bezierCurveTo(6 * s, -11 * s, 14 * s, -15 * s, 17.5 * s, -9 * s);
      ctx.bezierCurveTo(18.5 * s, -4 * s, 14 * s, 3 * s, 1.5 * s, 2 * s);
      ctx.closePath();
      ctx.fillStyle = wingFill;
      ctx.fill();

      // Hindwing (Lower Wing)
      ctx.beginPath();
      ctx.moveTo(1 * s, 1.5 * s);
      ctx.bezierCurveTo(11 * s, 4 * s, 14 * s, 12 * s, 8.5 * s, 16 * s);
      ctx.bezierCurveTo(4 * s, 16.5 * s, 0.5 * s, 12 * s, 0.5 * s, 4 * s);
      ctx.closePath();
      ctx.fillStyle = wingFill;
      ctx.fill();

      // Delicate inner wing-cell vein accents
      ctx.beginPath();
      ctx.moveTo(1.2 * s, -1 * s);
      ctx.quadraticCurveTo(8 * s, -7 * s, 13 * s, -6 * s);
      ctx.moveTo(1.2 * s, -1 * s);
      ctx.quadraticCurveTo(7 * s, -3 * s, 11 * s, 0.5 * s);
      ctx.strokeStyle = wingAccent;
      ctx.lineWidth = 0.6 * s;
      ctx.stroke();
    }
  }

  // Three harmonious butterflies
  const butterflies = [
    new Butterfly(1, 1.15, -15, -20),
    new Butterfly(2, 0.88, 38, -5),
    new Butterfly(3, 0.65, 12, 35)
  ];

  // Pause rendering when tab is hidden to save 100% CPU/battery
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive) {
      if (!animId) {
        animId = requestAnimationFrame(renderLoop);
      }
    } else if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  });

  // Main animation render loop
  function renderLoop(now) {
    if (!isTabActive) return;

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    ctx.clearRect(0, 0, width, height);

    // Glowing dust motes
    for (let i = spores.length - 1; i >= 0; i--) {
      const sp = spores[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= sp.decay;

      if (sp.alpha <= 0) {
        spores.splice(i, 1);
        continue;
      }

      ctx.save();
      const sporeGlow = sp.isDark
        ? `rgba(255, 255, 255, ${sp.alpha})`
        : `rgba(60, 70, 85, ${sp.alpha * 0.75})`;
      ctx.fillStyle = sporeGlow;
      ctx.shadowColor = sp.isDark ? 'rgba(255, 255, 255, 0.6)' : 'transparent';
      ctx.shadowBlur = sp.isDark ? 5 : 0;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Render butterflies
    butterflies.forEach((b) => {
      b.update(now, isDarkMode);
      b.draw(ctx, isDarkMode);
    });

    animId = requestAnimationFrame(renderLoop);
  }

  animId = requestAnimationFrame(renderLoop);
}

// -----------------------------------------------------------------------------
// Living Floral Duality Sanctuary (The Beginning & The End)
// Pure White Lily (Beginning / Genesis) in the bottom-left corner and
// Black Spider Lily (The End / The Void) in the bottom-right corner.
// Features procedural botanical curves, organic wind sway, living tendrils,
// pulsating low-frequency eerie purple luminescence, and interactive cursor reactions.
// -----------------------------------------------------------------------------

function initFloralSanctuary() {
  const canvas = document.getElementById('floral-sanctuary');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = null;
  let isTabActive = true;

  // Track cursor for organic proximity reactions
  const mouse = { x: -9999, y: -9999, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Responsive canvas sizing with high-DPI retina sharpness
  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // Ember & starlight spore particle pool
  const embers = [];
  const MAX_EMBERS = 54;

  function spawnEmber(x, y, type) {
    if (embers.length >= MAX_EMBERS) return;
    embers.push({
      x: x + (Math.random() - 0.5) * 24,
      y: y + (Math.random() - 0.5) * 18,
      vx: (Math.random() - 0.5) * 0.35 + (type === 'void' ? -0.15 : 0.15),
      vy: -0.25 - Math.random() * 0.45,
      radius: 0.7 + Math.random() * 1.5,
      alpha: 0.75 + Math.random() * 0.25,
      decay: 0.0035 + Math.random() * 0.0055,
      type: type // 'void' (purple-black flame ash) or 'light' (white-gold starlight)
    });
  }

  // Spider Lily Stamens configuration (arachnid claws & sweeping filaments)
  const spiderStamenDefs = [
    { angle: -1.45, length: 135, curve: -45, speed: 1.1, phase: 0.2 },
    { angle: -1.15, length: 165, curve: -60, speed: 1.3, phase: 1.1 },
    { angle: -0.75, length: 185, curve: -65, speed: 1.0, phase: 2.3 },
    { angle: -0.35, length: 175, curve: -55, speed: 1.2, phase: 3.5 },
    { angle: 0.05,  length: 155, curve: -45, speed: 1.4, phase: 4.2 },
    { angle: 0.50,  length: 130, curve: -35, speed: 0.9, phase: 5.1 },
    { angle: -0.55, length: 200, curve: -72, speed: 1.15, phase: 1.8 } // Prominent center style/pistil
  ];

  // Pause rendering when tab is inactive to preserve 100% CPU/battery
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive) {
      if (!animId) {
        animId = requestAnimationFrame(renderLoop);
      }
    } else if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  });

  // Main animation render loop
  function renderLoop(time) {
    if (!isTabActive) return;

    ctx.clearRect(0, 0, width, height);

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const isMobile = width < 768;
    const globalScale = isMobile ? 0.72 : 1.0;
    const t = time * 0.001;

    // Organic pulses for luminescence
    const purplePulse = (Math.sin(t * 1.6) + 1) * 0.5; // slow ominous heartbeat
    const whitePulse = (Math.sin(t * 1.3 + 1.2) + 1) * 0.5;

    // =========================================================================
    // 1. BLACK SPIDER LILY (Bottom-Right Corner — The End & The Void)
    // =========================================================================
    const spiderX = isMobile ? width - 52 : width - 85;
    const spiderY = isMobile ? height - 75 : height - 110;

    // Proximity alert: cursor approaching the abyss
    const distSpider = Math.hypot(spiderX - mouse.x, spiderY - mouse.y);
    const spiderAlert = mouse.active ? Math.max(0, 1 - distSpider / 220) : 0;

    // Low-frequency tangible purple luminescence core ("feelable purple light")
    const purpleIntensity = (0.24 + purplePulse * 0.16 + spiderAlert * 0.35) * (isDarkMode ? 1.0 : 0.85);
    const auraRadius = (150 + spiderAlert * 45) * globalScale;
    const purpleGrad = ctx.createRadialGradient(spiderX, spiderY, 8 * globalScale, spiderX, spiderY, auraRadius);
    purpleGrad.addColorStop(0, `rgba(147, 51, 234, ${purpleIntensity})`);
    purpleGrad.addColorStop(0.35, `rgba(88, 28, 135, ${purpleIntensity * 0.65})`);
    purpleGrad.addColorStop(0.7, `rgba(46, 16, 101, ${purpleIntensity * 0.25})`);
    purpleGrad.addColorStop(1, 'transparent');

    ctx.save();
    ctx.fillStyle = purpleGrad;
    ctx.beginPath();
    ctx.arc(spiderX, spiderY, auraRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Spawn void embers / black ash motes
    if (Math.random() < 0.24 + spiderAlert * 0.3) {
      spawnEmber(spiderX, spiderY, 'void');
    }

    // Stem rising from the bottom edge
    ctx.save();
    ctx.strokeStyle = isDarkMode ? '#0d0d12' : '#1e1c26';
    ctx.lineWidth = 4 * globalScale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(width - 38 * globalScale, height + 10);
    ctx.quadraticCurveTo(width - 55 * globalScale, height - 50 * globalScale, spiderX, spiderY);
    ctx.stroke();

    // Stem dark violet rim light
    ctx.strokeStyle = `rgba(126, 34, 206, ${0.45 + purplePulse * 0.25})`;
    ctx.lineWidth = 1.2 * globalScale;
    ctx.beginPath();
    ctx.moveTo(width - 37 * globalScale, height + 10);
    ctx.quadraticCurveTo(width - 54 * globalScale, height - 50 * globalScale, spiderX + 1, spiderY);
    ctx.stroke();
    ctx.restore();

    // Spider Lily Blossom Rendering
    ctx.save();
    ctx.translate(spiderX, spiderY);
    ctx.scale(globalScale, globalScale);
    ctx.rotate(-0.24); // Angled gently inward toward the center of the world

    // 6 Recurved Obsidian Petals with undulating ruffled edges
    const spiderPetalAngles = [-1.3, -0.9, -0.5, -0.1, 0.35, 0.85];
    spiderPetalAngles.forEach((ang, i) => {
      const petalSway = Math.sin(t * 1.2 + i * 0.9) * 0.05 + spiderAlert * 0.07;
      ctx.save();
      ctx.rotate(ang + petalSway);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(15, -12, 38, -25, 55, -18);
      ctx.bezierCurveTo(68, -12, 75, -2, 78, 12);
      ctx.bezierCurveTo(62, 5, 42, -5, 20, 2);
      ctx.closePath();

      // Pitch obsidian void black with deep violet gradient
      const pGrad = ctx.createLinearGradient(0, 0, 75, 0);
      pGrad.addColorStop(0, '#040407');
      pGrad.addColorStop(0.7, '#0e0b17');
      pGrad.addColorStop(1, '#1b122c');
      ctx.fillStyle = pGrad;
      ctx.fill();

      // Delicate purple margin rim
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.32 + purplePulse * 0.22 + spiderAlert * 0.3})`;
      ctx.lineWidth = 0.85;
      ctx.stroke();
      ctx.restore();
    });

    // 7 Long Sweeping Spider Stamens (The Signature Arachnid Filaments)
    spiderStamenDefs.forEach((st, idx) => {
      const windSway = Math.sin(t * st.speed + st.phase) * (6 + spiderAlert * 12);
      const alertPull = spiderAlert * 10;
      ctx.save();
      ctx.rotate(st.angle);

      // Sinister violet stamen aura glow
      ctx.shadowColor = `rgba(168, 85, 247, ${0.52 + purplePulse * 0.35 + spiderAlert * 0.4})`;
      ctx.shadowBlur = 8 + spiderAlert * 8;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      const cp1x = st.length * 0.45;
      const cp1y = st.curve * 0.5 + windSway * 0.3;
      const cp2x = st.length * 0.85;
      const cp2y = st.curve + windSway * 0.7;
      const tipX = st.length + alertPull;
      const tipY = st.curve * 0.85 + windSway;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);
      ctx.strokeStyle = idx === 6 ? '#2e1065' : (isDarkMode ? '#09080e' : '#1a1824');
      ctx.lineWidth = idx === 6 ? 1.6 : 1.25;
      ctx.stroke();

      // Tip Anther (delicate horizontal pollen capsule)
      ctx.shadowBlur = 0;
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(0.4 + windSway * 0.04);
      ctx.fillStyle = idx === 6 ? '#581c87' : '#140f22';
      ctx.fillRect(-3, -1.2, 6, 2.4);

      // Pulsing purple stamen tip spark
      ctx.fillStyle = `rgba(192, 132, 252, ${0.75 + purplePulse * 0.25})`;
      ctx.fillRect(-1, -0.6, 2, 1.2);
      ctx.restore();

      ctx.restore();
    });

    // Central abyss core
    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = '#050508';
    ctx.fill();
    ctx.strokeStyle = `rgba(147, 51, 234, ${0.65 + purplePulse * 0.35})`;
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.restore();

    // =========================================================================
    // 2. PURE WHITE LILY (Bottom-Left Corner — The Beginning & Genesis)
    // =========================================================================
    const whiteX = isMobile ? 52 : 85;
    const whiteY = isMobile ? height - 70 : height - 105;

    const distWhite = Math.hypot(whiteX - mouse.x, whiteY - mouse.y);
    const whiteAlert = mouse.active ? Math.max(0, 1 - distWhite / 220) : 0;

    // Celestial Starlight Core Glow
    const whiteIntensity = (0.22 + whitePulse * 0.14 + whiteAlert * 0.25) * (isDarkMode ? 1.0 : 0.7);
    const whiteAuraRadius = (135 + whiteAlert * 35) * globalScale;
    const whiteGrad = ctx.createRadialGradient(whiteX, whiteY, 8 * globalScale, whiteX, whiteY, whiteAuraRadius);
    whiteGrad.addColorStop(0, `rgba(255, 255, 255, ${whiteIntensity})`);
    whiteGrad.addColorStop(0.35, `rgba(240, 248, 255, ${whiteIntensity * 0.6})`);
    whiteGrad.addColorStop(0.7, `rgba(215, 230, 255, ${whiteIntensity * 0.2})`);
    whiteGrad.addColorStop(1, 'transparent');

    ctx.save();
    ctx.fillStyle = whiteGrad;
    ctx.beginPath();
    ctx.arc(whiteX, whiteY, whiteAuraRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Spawn starlight spores
    if (Math.random() < 0.22 + whiteAlert * 0.25) {
      spawnEmber(whiteX, whiteY, 'light');
    }

    // Stem rising from the bottom-left edge
    ctx.save();
    ctx.strokeStyle = isDarkMode ? 'rgba(75, 95, 80, 0.85)' : 'rgba(45, 65, 50, 0.85)';
    ctx.lineWidth = 4 * globalScale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(38 * globalScale, height + 10);
    ctx.quadraticCurveTo(52 * globalScale, height - 45 * globalScale, whiteX, whiteY);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(235, 250, 240, 0.45)';
    ctx.lineWidth = 1.2 * globalScale;
    ctx.beginPath();
    ctx.moveTo(37 * globalScale, height + 10);
    ctx.quadraticCurveTo(51 * globalScale, height - 45 * globalScale, whiteX - 1, whiteY);
    ctx.stroke();
    ctx.restore();

    // White Lily Blossom Rendering
    ctx.save();
    ctx.translate(whiteX, whiteY);
    ctx.scale(globalScale, globalScale);
    ctx.rotate(0.28); // Angled gently inward toward the center of the world

    // 6 Broad Immaculate White Tepals
    const whitePetalAngles = [-1.4, -0.85, -0.3, 0.25, 0.8, 1.35];
    whitePetalAngles.forEach((ang, i) => {
      const petalSway = Math.sin(t * 1.1 + i * 0.8) * 0.04 + whiteAlert * 0.05;
      ctx.save();
      ctx.rotate(ang + petalSway);

      ctx.shadowColor = `rgba(255, 255, 255, ${0.45 + whitePulse * 0.25})`;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(16, -14, 45, -20, 68, -8);
      ctx.bezierCurveTo(76, -4, 76, 4, 68, 8);
      ctx.bezierCurveTo(45, 20, 16, 14, 0, 0);
      ctx.closePath();

      const wGrad = ctx.createLinearGradient(0, 0, 70, 0);
      wGrad.addColorStop(0, isDarkMode ? 'rgba(230, 240, 250, 0.88)' : 'rgba(240, 245, 250, 0.94)');
      wGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      wGrad.addColorStop(1, 'rgba(245, 250, 255, 0.92)');
      ctx.fillStyle = wGrad;
      ctx.fill();

      ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(210, 220, 230, 0.85)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Midrib vein
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.quadraticCurveTo(35, 0, 62, 0);
      ctx.strokeStyle = 'rgba(200, 225, 240, 0.55)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.restore();
    });

    // Golden stamens and central pistil
    const whiteStamens = [-0.6, -0.3, 0, 0.3, 0.6];
    whiteStamens.forEach((ang, i) => {
      const stSway = Math.sin(t * 1.3 + i) * 3;
      ctx.save();
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(20, -5 + stSway * 0.5, 42, stSway);
      ctx.strokeStyle = 'rgba(240, 235, 200, 0.9)';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.save();
      ctx.translate(42, stSway);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.95)';
      ctx.fillRect(-2, -1, 4, 2);
      ctx.restore();
      ctx.restore();
    });

    // Central bloom core
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 250, 235, 0.95)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(202, 230, 180, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    // =========================================================================
    // 3. UPDATE & DRAW EMBERS / SPORES
    // =========================================================================
    for (let i = embers.length - 1; i >= 0; i--) {
      const em = embers[i];
      em.x += em.vx;
      em.y += em.vy;
      em.alpha -= em.decay;

      if (em.alpha <= 0) {
        embers.splice(i, 1);
        continue;
      }

      ctx.save();
      if (em.type === 'void') {
        ctx.fillStyle = `rgba(168, 85, 247, ${em.alpha})`;
        ctx.shadowColor = 'rgba(147, 51, 234, 0.7)';
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${em.alpha})`;
        ctx.shadowColor = 'rgba(240, 248, 255, 0.8)';
        ctx.shadowBlur = 6;
      }

      ctx.beginPath();
      ctx.arc(em.x, em.y, em.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animId = requestAnimationFrame(renderLoop);
  }

  animId = requestAnimationFrame(renderLoop);
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
  initButterflySanctuary();
  initFloralSanctuary();
  printConsoleWelcome();
});
