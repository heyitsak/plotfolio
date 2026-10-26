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
// The True North Star (Subtle Dedication to Ak's Wife)
// -----------------------------------------------------------------------------

function initTrueNorthStar() {
  const star = document.getElementById('true-north-star');
  const whisper = document.getElementById('true-north-whisper');
  if (!star || !whisper) return;

  const whisperMessages = [
    "“My anchor across every ocean.”",
    "“In an endless sea of uncharted waters, you are my True North.”",
    "“The one treasure that makes every voyage worth returning from.”",
    "“My constant star in an expanding universe.”"
  ];

  let currentIdx = 0;
  const quoteEl = whisper.querySelector('.whisper-quote');

  star.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx + 1) % whisperMessages.length;
    if (quoteEl) {
      quoteEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = whisperMessages[currentIdx];
        quoteEl.style.opacity = '1';
      }, 150);
    }
    whisper.classList.toggle('active');
  });

  // Close whisper when clicking anywhere else
  document.addEventListener('click', (e) => {
    if (!star.contains(e.target) && !whisper.contains(e.target)) {
      whisper.classList.remove('active');
    }
  });

  // Dedicated quiet DevTools console love note
  console.log(
    '%c★ Dedicated to my beloved wife — my True North across every ocean.',
    'color: #fde047; font-style: italic; font-size: 11px; padding: 4px 0;'
  );
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
  initTrueNorthStar();
  printConsoleWelcome();
});
