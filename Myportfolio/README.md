# 👾 Bharath T J — 8-Bit Pixel Art Engineering Portfolio

A modern, responsive, pixel-art styled portfolio website engineered for **Bharath T J** (Software Engineer & Data Scientist). Built with semantic HTML5, custom CSS3, and vanilla JavaScript featuring retro CRT aesthetics, interactive audio synthesis, an AI chat terminal, project modals, and a contact transmission pipeline.

---

## 🌟 Layered Architecture & Prompt Alignment

| Module | Prompt Requirement | Implementation Details |
|---|---|---|
| **1. Base Skeleton** | Semantic HTML5 structure with comments | Accessible tags (`<header>`, `<main>`, `<aside>`, `<footer>`, `<dialog>`), structured comments for each section. |
| **2. Hero Section** | Pixel art design, background image & theme detection | Integrates `assets/hero-bg.jpg`, CRT grid animation, and detects browser default theme via `@media (prefers-color-scheme)`. |
| **3. Vertical Navbar** | Left-hand vertical navigation bar | Fixed left sidebar on desktop with retro icons, active scrollspy indicators (`▶`), and smooth scrolling. |
| **4. About Me** | Profile image, bio, career highlights | Framed pixel portrait (`assets/profile.jpg`), academic metrics (9.21 CGPA, AIT), and core interests. |
| **5. Skills Matrix** | Competencies, progress bars & filter tabs | Stepped 8-bit XP progress bars, category tabs (Programming, Frontend, Backend, Hardware). |
| **6. Interactive Timeline** | Chronological career milestone cards | Glowing nodes, rounded cards with hover transitions (SIH '26, KishanLink, PID Robot, HackerRank 3★). |
| **7. Projects & Modals** | Clickable thumbnails with detailed dialogs | Retro cartridges launching rich modal dialogs with architecture breakdown, tech pills, and GitHub links. |
| **8. Video Showcase** | Responsive embedded YouTube video | 16:9 arcade cabinet bezel with channel switcher between YouTube embed and local hardware video (`assets/project-demo.mp4`). |
| **9. Testimonials** | Quotes with drop shadows and rounded cards | Pixel quotes (`“`), 5-star ratings, author roles from academic and hackathon mentors. |
| **10. AI Chat Terminal** | Interactive chatbot simulation | `Bharath.AI v1.0` interactive terminal with quick prompt chips, typing animations, and clear OpenAI API integration hooks. |
| **11. Contact Transmission** | Validated form with API integration hook | High-contrast inputs, submit button with feedback, confirmation banner, and Resend API code comments. |
| **12. Footer & Socials** | Accessible pixel social links | GitHub, LinkedIn, Email, and Phone with retro hover tooltips and back-to-top button. |
| **13. Responsive Design** | Fluid across mobile, tablet, and desktop | Collapsible drawer menu for viewports < 1024px, flexible CSS grid layouts, and clamp typography. |
| **14. Visual Enhancements** | Blurs, drop shadows, and audio effects | Backdrop blur, CRT scanline overlay toggle, Web Audio API procedural 8-bit sound effects. |
| **15. Publishing & Testing** | Cross-browser testing and deployment guide | Validated across modern viewports with complete hosting instructions below. |

---

## 🚀 Deployment Guide (Prompt 15)

### Option 1: Deploy to GitHub Pages (Recommended - 100% Free)

1. **Initialize Git in the project directory:**
   ```bash
   cd c:\Users\Lenovo23\Desktop\Myportfolio
   git init
   git add .
   git commit -m "feat: initial release of 8-bit portfolio"
   ```

2. **Create a GitHub repository:**
   - Go to [GitHub New Repository](https://github.com/new).
   - Name your repository (e.g., `bharath-portfolio` or `bharathtj77.github.io`).
   - Click **Create repository**.

3. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/bharathtj77/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - In your GitHub repo, navigate to **Settings** > **Pages** (under the Code and automation section).
   - Under **Build and deployment** > **Branch**, select `main` and root `/`.
   - Click **Save**.
   - Your site will be live at `https://bharathtj77.github.io/<repo-name>/` in 1–2 minutes!

---

### Option 2: Deploy to Vercel (Instant Zero-Config)

1. Install the Vercel CLI or visit [vercel.com](https://vercel.com).
2. Run in powershell / bash:
   ```bash
   npx vercel
   ```
3. Accept the defaults. Vercel automatically detects static HTML/CSS/JS and provisions a global HTTPS CDN URL.

---

### Option 3: Deploy to Netlify

1. Drag and drop the `Myportfolio` folder directly into [Netlify Drop](https://app.netlify.com/drop).
2. Instant global SSL deployment is generated in seconds.

---

## 🔌 API Integration Instructions

### 1. Connecting OpenAI / Gemini to the AI Chat (`script.js`)
Locate line ~370 in [script.js](file:///c:/Users/Lenovo23/Desktop/Myportfolio/script.js) inside `handleUserMessage`:
```javascript
// Replace simulation with serverless backend fetch:
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userText })
});
const data = await response.json();
this.appendMessage('Bharath.AI', data.reply);
```

### 2. Connecting Resend API to the Contact Form (`script.js`)
Locate line ~450 in [script.js](file:///c:/Users/Lenovo23/Desktop/Myportfolio/script.js) inside `handleSubmit`:
```javascript
// POST transmission payload to a serverless function:
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: this.nameInput.value,
    email: this.emailInput.value,
    subject: document.getElementById('contact-subject').value,
    message: this.messageInput.value
  })
});
```

---

## 🛠️ Local Development & Testing

Open `index.html` directly in any web browser, or launch a live local web server:

```powershell
# Using Python's built-in HTTP server:
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.
