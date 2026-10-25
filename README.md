# Personal Portfolio — Akhilesh Pratap Pandey (@heyitsak)

> A modern, handcrafted personal developer portfolio featuring a Discord-inspired profile header with dynamic refreshing banners and clean editorial typography.

[![Live Showcase](https://img.shields.io/badge/Live_Showcase-heyitsak.github.io%2Fplotfolio-ea580c?style=flat-square&logo=safari&logoColor=white)](https://heyitsak.github.io/plotfolio/)
[![CI Verification](https://github.com/heyitsak/plotfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/heyitsak/plotfolio/actions/workflows/ci.yml)
[![Discussions](https://img.shields.io/badge/Discussions-Join_Community-blue?style=flat-square&logo=github)](https://github.com/heyitsak/plotfolio/discussions)
[![Code Style](https://img.shields.io/badge/Code-100%25%20Handcrafted-blueviolet?style=flat-square)](#philosophy--architecture)
[![Design](https://img.shields.io/badge/Design-Editorial%20%2B%20Discord-orange?style=flat-square)](#features)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## ✦ Philosophy & Architecture

Built with an uncompromising focus on **human software craftsmanship**:
- **Discord-Inspired Profile Header:** Custom header with overlapping avatar, online status indicator, and dynamic rotating banners.
- **Dynamic Banner Engine:** Cycles through a curated collection of aesthetic banners on every page load/refresh without disrupting active browsing.
- **Zero Build Tools Overhead:** Handcrafted with semantic HTML5, CSS custom properties, and modular Vanilla JavaScript.
- **Performance & Accessibility:** Instant load times, zero layout shifts, smooth transitions, and high contrast ratios.
- **Editorial Typography:** Refined serif headings (`Newsreader`) paired with clean modern body typography (`Plus Jakarta Sans`) and code fonts (`JetBrains Mono`).

---

## ✨ Features

- **🎮 Discord Profile Card:** Overlapping avatar with circular border, live online status indicator, custom status badge, and social action buttons.
- **🖼 Dynamic Refresh Banners:** Rotates between 9 aesthetic banner images whenever the site is opened or refreshed, keeping each visit fresh.
- **🌓 Persistent Dark/Light Mode:** Full system preference sync (`prefers-color-scheme`) with instant toggle saved in `localStorage`.
- **💼 Featured Projects:** Responsive cards highlighting software projects, technology tags, and direct GitHub/preview links.
- **🛠 Skills Matrix:** Clean categorized grid spanning Languages, Frameworks, Databases, and DevOps tooling.
- **📋 One-Click Email Copy:** Built-in clipboard helper with floating toast notification feedback.
- **🐣 DevTools Easter Egg:** Friendly custom banner output in the browser console.

---

## 📂 Project Structure

```text
plotfolio/
├── assets/
│   ├── banners/       # Golden-ratio banners (734x206, banner-1.jpg .. banner-N.jpg)
│   └── pfp/           # Static profile picture (avatar.jpg)
├── .gitignore         # Clean repository ignore rules
├── index.html         # Semantic, accessible HTML5 structure & SEO meta tags
├── styles.css         # Design tokens, Discord profile card & dark/light themes
├── script.js          # Lightweight Vanilla JS (banner rotation, theme switch, toast)
├── process_banners.py # Tool to auto-scale new banners to the 734x206 golden ratio
└── README.md          # Project documentation & GitHub Pages deployment guide
```

---

## 🎨 Adding & Curating Banners

Whenever you find new banners and drop them into your `Desktop/pfp and banner/banner` folder:

```bash
# Run the built-in optimizer
python process_banners.py
```
This tool:
1. Auto-resizes and center-fits every banner to the golden **734x206** dimension using high-quality Lanczos resampling.
2. Updates `plotfolio/assets/banners/`.
3. Automatically updates `script.js` with the new banner pool count.

---

## 🚀 Running Locally

No installation or build step is required:

### Option 1: Direct in Browser
Simply double-click `index.html` or open it with your favorite browser.

### Option 2: Local Static Server
If you prefer running a local HTTP server:

```bash
# Using Python
python -m http.server 3000

# Or using Node
npx serve .
```
Then open `http://localhost:3000`.

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

To link this repository to your GitHub profile and enable GitHub Pages:

### 1. Create a repository on GitHub
Create a new public repository named `plotfolio` (or `<username>.github.io`) on GitHub.

### 2. Push this local repository to GitHub
```bash
cd "C:\Users\Admin\Desktop\plotfolio"

# Add your GitHub repository remote
git remote add origin https://github.com/heyitsak/plotfolio.git

# Push the main branch
git branch -M main
git push -u origin main
```

### 3. Turn on GitHub Pages
1. Go to your repository on GitHub: `Settings` → `Pages`.
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`.
4. Click **Save**. Within ~1 minute, your portfolio is live at:
   `https://heyitsak.github.io/plotfolio/`

---

## 📄 License

MIT © [Akhilesh Pratap Pandey](https://github.com/heyitsak)

---

## 🤝 Community & Contributions

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/heyitsak/plotfolio/issues) or join the [Discussions](https://github.com/heyitsak/plotfolio/discussions).
