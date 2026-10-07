/**
 * ==============================================================================
 * BHARATH T J - RETRO PIXEL PORTFOLIO INTERACTION ENGINE
 * Handcrafted Modular JavaScript powering Navigation, Themes, AI Chat,
 * Project Modals, Audio Synthesis, and API Hooks.
 * ==============================================================================
 */

// Strict Mode for execution safety
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------------
   * 1. 8-BIT WEB AUDIO API SYNTHESIZER (RETRO SOUND FX)
   * Procedural retro audio blips without external MP3 dependencies!
   * ---------------------------------------------------------------------------- */
  const AudioEngine = {
    enabled: true,
    audioCtx: null,

    init() {
      // AudioContext is initialized on first user interaction to comply with browser autoplay policies
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    },

    playBlip(freq = 440, type = 'square', duration = 0.08) {
      if (!this.enabled) return;
      try {
        if (!this.audioCtx) this.init();
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        console.warn('Audio playback inhibited:', e);
      }
    },

    playSelect() {
      this.playBlip(580, 'square', 0.06);
    },

    playAction() {
      this.playBlip(820, 'square', 0.12);
    },

    playSuccess() {
      if (!this.enabled) return;
      this.playBlip(523.25, 'triangle', 0.1);
      setTimeout(() => this.playBlip(659.25, 'triangle', 0.1), 100);
      setTimeout(() => this.playBlip(783.99, 'triangle', 0.18), 200);
    }
  };

  /* ----------------------------------------------------------------------------
   * 2. THEME ENGINE & NIGHT MODE MEDIA QUERY DETECTION (PROMPTS 1 & 2)
   * Automatically detects user's system preference and supports manual toggle
   * with localStorage caching.
   * ---------------------------------------------------------------------------- */
  const ThemeManager = {
    themeToggleBtn: document.getElementById('theme-toggle'),
    mobileThemeToggleBtn: document.getElementById('mobile-theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    themeStatusText: document.getElementById('theme-status-text'),
    htmlEl: document.documentElement,

    init() {
      // 1. Check saved user preference in localStorage
      const savedTheme = localStorage.getItem('portfolio-theme');
      
      // 2. Fall back to CSS media query detecting system browser theme (Prompt 2 requirement)
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      this.applyTheme(initialTheme);

      // Listen for system preference changes if user hasn't explicitly overridden
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });

      // Bind click handlers
      if (this.themeToggleBtn) {
        this.themeToggleBtn.addEventListener('click', () => {
          AudioEngine.playSelect();
          this.toggleTheme();
        });
      }
      if (this.mobileThemeToggleBtn) {
        this.mobileThemeToggleBtn.addEventListener('click', () => {
          AudioEngine.playSelect();
          this.toggleTheme();
        });
      }
    },

    applyTheme(theme) {
      this.htmlEl.setAttribute('data-theme', theme);
      const isDark = theme === 'dark';

      if (this.themeIcon) this.themeIcon.textContent = isDark ? '🌙' : '☀️';
      if (this.themeStatusText) this.themeStatusText.textContent = isDark ? 'DARK' : 'LIGHT';

      // Update mobile button icon
      if (this.mobileThemeToggleBtn) {
        const mobileIcon = this.mobileThemeToggleBtn.querySelector('.theme-icon');
        if (mobileIcon) mobileIcon.textContent = isDark ? '🌙' : '☀️';
      }
    },

    toggleTheme() {
      const currentTheme = this.htmlEl.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    }
  };
  ThemeManager.init();

  /* ----------------------------------------------------------------------------
   * 3. HUD CONTROLS: AUDIO FX & CRT SCANLINES (PROMPT 14)
   * ---------------------------------------------------------------------------- */
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  const sfxStatusText = document.getElementById('sfx-status-text');
  const sfxIcon = document.getElementById('sfx-icon');

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      AudioEngine.enabled = !AudioEngine.enabled;
      if (sfxStatusText) sfxStatusText.textContent = AudioEngine.enabled ? 'ON' : 'OFF';
      if (sfxIcon) sfxIcon.textContent = AudioEngine.enabled ? '🔊' : '🔇';
      if (AudioEngine.enabled) AudioEngine.playSelect();
    });
  }

  const crtToggleBtn = document.getElementById('crt-toggle');
  const crtStatusText = document.getElementById('crt-status-text');
  const crtOverlay = document.getElementById('crt-overlay');

  if (crtToggleBtn && crtOverlay) {
    crtToggleBtn.addEventListener('click', () => {
      AudioEngine.playSelect();
      crtOverlay.classList.toggle('disabled');
      const isEnabled = !crtOverlay.classList.contains('disabled');
      if (crtStatusText) crtStatusText.textContent = isEnabled ? 'ON' : 'OFF';
    });
  }

  /* ----------------------------------------------------------------------------
   * 4. VERTICAL NAVIGATION & SCROLLSPY (PROMPT 3 & 13)
   * Tracks user scroll position, highlights active nav links with ▶,
   * handles smooth section navigation and mobile drawer toggling.
   * ---------------------------------------------------------------------------- */
  const NavigationManager = {
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section[id], header[id]'),
    navToggleBtn: document.getElementById('nav-toggle-btn'),
    sidebarWrapper: document.getElementById('sidebar-wrapper'),

    init() {
      // Mobile drawer toggle
      if (this.navToggleBtn && this.sidebarWrapper) {
        this.navToggleBtn.addEventListener('click', () => {
          AudioEngine.playSelect();
          const expanded = this.navToggleBtn.getAttribute('aria-expanded') === 'true';
          this.navToggleBtn.setAttribute('aria-expanded', !expanded);
          this.sidebarWrapper.classList.toggle('mobile-open', !expanded);
        });
      }

      // Close mobile drawer upon clicking any nav link
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          AudioEngine.playSelect();
          if (this.sidebarWrapper && this.sidebarWrapper.classList.contains('mobile-open')) {
            this.sidebarWrapper.classList.remove('mobile-open');
            if (this.navToggleBtn) this.navToggleBtn.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // ScrollSpy setup using IntersectionObserver
      this.setupScrollSpy();
    },

    setupScrollSpy() {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            this.setActiveLink(currentId);
          }
        });
      }, observerOptions);

      this.sections.forEach(section => observer.observe(section));
    },

    setActiveLink(id) {
      this.navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }
  };
  NavigationManager.init();

  /* ----------------------------------------------------------------------------
   * 5. SKILLS FILTERING MATRIX (PROMPT 5)
   * Allows filtering competencies across Programming, Frontend, Backend & IoT.
   * ---------------------------------------------------------------------------- */
  const SkillFilterManager = {
    filterBtns: document.querySelectorAll('.skill-tab-btn'),
    skillCards: document.querySelectorAll('.skill-card'),

    init() {
      this.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          AudioEngine.playSelect();
          const filter = btn.getAttribute('data-filter');

          // Update active state
          this.filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          // Filter card display
          this.skillCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.style.display = 'block';
              card.style.animation = 'message-pop 0.3s ease';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
  };
  SkillFilterManager.init();

  /* ----------------------------------------------------------------------------
   * 6. PROJECTS DATA & MODAL DETAIL OVERLAY (PROMPT 7)
   * Connects project cartridges to comprehensive detail views.
   * ---------------------------------------------------------------------------- */
  const projectDatabase = {
    'pid-robot': {
      title: 'Autonomous PID Line-Following Robot',
      badge: 'HARDWARE & IOT // 6-MONTH RESEARCH',
      image: 'assets/pid-robot.jpg',
      description: `
        An advanced autonomous ground vehicle engineered to execute microsecond path tracking along intricate track geometries. The system combines an array of infrared reflectance sensors with a high-speed Arduino microcontroller running a custom Proportional-Integral-Derivative (PID) closed-loop algorithm.
      `,
      highlights: [
        'Implemented precision real-time feedback loops minimizing overshoot and steady-state error.',
        'Extensively tuned proportional (Kp), integral (Ki), and derivative (Kd) coefficients for seamless cornering at top motor speeds.',
        'Custom motor driver circuitry interfacing high-torque DC motors with PWM pulse shaping.'
      ],
      techStack: ['Embedded C', 'Arduino IDE', 'PID Control Theory', 'IR Sensor Array', 'H-Bridge Motor Driver', 'Hardware Prototyping'],
      repoUrl: 'https://github.com/bharathtj77'
    },
    'kishanlink': {
      title: 'KishanLink Agritech Platform',
      badge: 'FULL-STACK & DATA ANALYTICS // 24-HOUR SPRINT',
      image: 'assets/kishanlink.jpg',
      description: `
        A full-stack agricultural marketplace platform built during a 24-hour hackathon sprint. KishanLink bridges smallholder farmers directly with regional market vendors, offering real-time pricing feeds, inventory transparency, and predictive yield metrics to maximize farm income.
      `,
      highlights: [
        'Architected clean REST APIs in Node.js connected to an optimized relational SQL database.',
        'Integrated interactive Power BI dashboards delivering actionable agricultural market insights.',
        'Crafted a high-contrast responsive interface operable on low-bandwidth rural mobile networks.'
      ],
      techStack: ['Node.js', 'Express', 'SQL', 'REST API', 'Power BI', 'HTML5 / CSS3', 'Data Visualization'],
      repoUrl: 'https://github.com/bharathtj77'
    },
    'datascience': {
      title: 'NeuroData Predictive Analytics Suite',
      badge: 'DATA SCIENCE & SCIENTIFIC COMPUTING',
      image: 'assets/datascience.jpg',
      description: `
        A scientific data modeling and machine learning workspace developed with Python's core numerical libraries. It provides automated data cleansing, feature normalization, multivariate regression analysis, and publication-ready charting.
      `,
      highlights: [
        'Utilized NumPy and Pandas for high-performance tabular computation and missing value interpolation.',
        'Generated interactive exploratory distribution plots using Matplotlib and Seaborn.',
        'Evaluated prediction accuracy metrics (RMSE, R2 score) across multiple training splits.'
      ],
      techStack: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Scikit-Learn', 'Statistical Modeling'],
      repoUrl: 'https://github.com/bharathtj77'
    }
  };

  const ModalManager = {
    modal: document.getElementById('project-modal'),
    backdrop: document.getElementById('modal-backdrop'),
    closeBtn: document.getElementById('modal-close-btn'),
    dismissBtn: document.getElementById('modal-dismiss-btn'),
    titleEl: document.getElementById('modal-project-title'),
    bodyEl: document.getElementById('modal-body-content'),
    linkEl: document.getElementById('modal-primary-link'),

    init() {
      // Connect project cards and trigger buttons (Prompt 7 requirement)
      document.querySelectorAll('.open-modal-trigger, .project-card').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          // If clicked inside link button or card
          const card = trigger.closest('.project-card');
          const projectId = card ? card.getAttribute('data-project-id') : null;
          if (projectId && projectDatabase[projectId]) {
            e.stopPropagation();
            AudioEngine.playAction();
            this.openModal(projectId);
          }
        });
      });

      // Close events
      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());
      if (this.dismissBtn) this.dismissBtn.addEventListener('click', () => this.closeModal());
      if (this.backdrop) this.backdrop.addEventListener('click', () => this.closeModal());

      // Keyboard ESC key accessibility
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
          this.closeModal();
        }
      });
    },

    openModal(id) {
      const data = projectDatabase[id];
      if (!data) return;

      this.titleEl.textContent = data.title;
      this.linkEl.href = data.repoUrl;

      // Construct rich modal body
      let highlightsHtml = data.highlights.map(h => `<li>${h}</li>`).join('');
      let pillsHtml = data.techStack.map(t => `<span class="modal-pill">${t}</span>`).join('');

      this.bodyEl.innerHTML = `
        <img src="${data.image}" alt="${data.title} preview" class="modal-hero-img" onerror="this.src='assets/hero-bg.jpg'">
        <p>${data.description}</p>
        
        <h4 class="modal-section-h4">KEY ACHIEVEMENTS & ARCHITECTURE:</h4>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem;">
          ${highlightsHtml}
        </ul>

        <h4 class="modal-section-h4">TECHNOLOGY STACK:</h4>
        <div class="modal-pills">
          ${pillsHtml}
        </div>
      `;

      this.modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    },

    closeModal() {
      AudioEngine.playSelect();
      this.modal.classList.add('hidden');
      document.body.style.overflow = ''; // Restore background scroll
    }
  };
  ModalManager.init();

  /* ----------------------------------------------------------------------------
   * 7. VIDEO SHOWCASE CHANNELS SWITCHER (PROMPT 8)
   * Allows toggling between the YouTube embed and the local demo recording.
   * ---------------------------------------------------------------------------- */
  const ytBtn = document.getElementById('show-yt-btn');
  const localBtn = document.getElementById('show-local-btn');
  const ytFrame = document.getElementById('youtube-embed-frame');
  const localVideo = document.getElementById('local-demo-video');

  if (ytBtn && localBtn && ytFrame && localVideo) {
    ytBtn.addEventListener('click', () => {
      AudioEngine.playSelect();
      ytBtn.classList.add('active');
      localBtn.classList.remove('active');
      ytFrame.classList.remove('hidden');
      localVideo.classList.add('hidden');
      localVideo.pause();
    });

    localBtn.addEventListener('click', () => {
      AudioEngine.playSelect();
      localBtn.classList.add('active');
      ytBtn.classList.remove('active');
      ytFrame.classList.add('hidden');
      localVideo.classList.remove('hidden');
      localVideo.play().catch(() => {}); // Play or allow user control
    });
  }

  /* ----------------------------------------------------------------------------
   * 8. AI CHAT INTERFACE SIMULATION & API INTEGRATION HOOK (PROMPT 10)
   * Simulated smart replies representing Bharath's persona, with clear comments
   * showing where and how to integrate external APIs like OpenAI or Gemini.
   * ---------------------------------------------------------------------------- */
  const ChatEngine = {
    form: document.getElementById('chat-form'),
    input: document.getElementById('chat-user-input'),
    container: document.getElementById('chat-messages'),
    quickChips: document.querySelectorAll('.chip-btn'),

    // Knowledge base for instant client-side answers about Bharath
    knowledgeBase: [
      {
        keywords: ['pid', 'robot', 'arduino', 'hardware', 'sensor'],
        response: "Bharath engineered an autonomous PID line-following robot over 6 months using Embedded C and Arduino. It integrates infrared sensor arrays with tuned Kp/Ki/Kd mathematical feedback parameters for jitter-free, high-speed line tracking!"
      },
      {
        keywords: ['kishan', 'farmer', 'agritech', 'sql', 'power bi'],
        response: "KishanLink was created in a 24-hour sprint. It is a full-stack platform designed to connect farmers directly with market pricing using Node.js REST APIs, SQL databases, and Power BI visual dashboards."
      },
      {
        keywords: ['skill', 'stack', 'languages', 'tech', 'python', 'react'],
        response: "Bharath's core competencies span: Python (NumPy, Pandas, Matplotlib), Frontend (HTML5, CSS3, React), Backend (Node.js, REST APIs), Databases (MySQL, MongoDB, PostgreSQL), and Embedded IoT (Arduino, C, PID control)."
      },
      {
        keywords: ['sih', 'hackathon', 'smart india', 'achievement'],
        response: "Bharath successfully qualified for the Smart India Hackathon (SIH) 2026, a premier nationwide innovation challenge! He also holds a 3-Star Python rating on HackerRank."
      },
      {
        keywords: ['internship', 'hire', 'available', 'job', 'work', 'opportunity'],
        response: "Yes! Bharath is actively seeking software engineering and data science internships. You can send him a direct message via the contact form below or email him at bharathtj77@gmail.com!"
      },
      {
        keywords: ['college', 'ait', 'cgpa', 'education', 'degree', 'gpa'],
        response: "Bharath is pursuing his B.E. in Computer Science (Data Science) at Adichunchanagiri Institute of Technology (AIT), Chikkamagaluru (2025–2029). He currently holds an outstanding 9.21 / 10 CGPA."
      },
      {
        keywords: ['contact', 'email', 'phone', 'reach', 'linkedin', 'github'],
        response: "Coordinates: Email: bharathtj77@gmail.com | Phone: +91 6360592938 | GitHub: github.com/bharathtj77 | LinkedIn: linkedin.com/in/bharath-t-j-788b47375."
      }
    ],

    init() {
      if (!this.form || !this.input || !this.container) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.input.value.trim();
        if (!text) return;
        this.handleUserMessage(text);
        this.input.value = '';
      });

      // Quick chip clicks
      this.quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const query = chip.getAttribute('data-query');
          if (query) {
            AudioEngine.playSelect();
            this.handleUserMessage(query);
          }
        });
      });
    },

    appendMessage(sender, text, isUser = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

      const avatar = isUser ? '🧑‍💻' : '👾';
      const senderLabel = isUser ? 'You:' : 'Bharath.AI:';
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      msgDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
          <span class="message-sender">${senderLabel}</span>
          <p>${this.escapeHTML(text)}</p>
          <span class="message-time">${now}</span>
        </div>
      `;

      this.container.appendChild(msgDiv);
      this.scrollToBottom();
    },

    showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-message bot-message typing-indicator-item';
      typingDiv.id = 'bot-typing-indicator';
      typingDiv.innerHTML = `
        <div class="message-avatar">👾</div>
        <div class="message-content">
          <span class="message-sender">Bharath.AI is computing...</span>
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      this.container.appendChild(typingDiv);
      this.scrollToBottom();
    },

    removeTypingIndicator() {
      const indicator = document.getElementById('bot-typing-indicator');
      if (indicator) indicator.remove();
    },

    scrollToBottom() {
      this.container.scrollTop = this.container.scrollHeight;
    },

    escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    },

    async handleUserMessage(userText) {
      AudioEngine.playAction();
      this.appendMessage('You', userText, true);

      // Display typing indicator
      this.showTypingIndicator();

      // =========================================================================
      // API INTEGRATION POINT (PROMPT 10 COMMENT REQUIREMENT)
      // To connect to a live OpenAI, Anthropic, or Gemini API, replace the
      // simulated timeout below with a fetch call to your serverless backend proxy:
      //
      // Example implementation:
      // try {
      //   const response = await fetch('/api/chat', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ message: userText, conversationHistory: [] })
      //   });
      //   const data = await response.json();
      //   this.removeTypingIndicator();
      //   this.appendMessage('Bharath.AI', data.reply);
      // } catch (err) {
      //   this.removeTypingIndicator();
      //   this.appendMessage('Bharath.AI', 'Transmission disrupted. Check connection.');
      // }
      // =========================================================================

      setTimeout(() => {
        this.removeTypingIndicator();
        const reply = this.computeResponse(userText);
        this.appendMessage('Bharath.AI', reply, false);
        AudioEngine.playSuccess();
      }, 700);
    },

    computeResponse(query) {
      const lower = query.toLowerCase();

      for (const item of this.knowledgeBase) {
        if (item.keywords.some(kw => lower.includes(kw))) {
          return item.response;
        }
      }

      return "That sounds intriguing! Bharath specializes in Data Science, IoT microcontrollers, and modern full-stack web applications. Feel free to explore his projects in the quest log or drop a transmission in the contact section!";
    }
  };
  ChatEngine.init();

  /* ----------------------------------------------------------------------------
   * 9. CONTACT FORM WITH EMAIL API FUNCTIONALITY (PROMPT 11)
   * Client-side validation, submit states, and confirmation message.
   * Includes code comment demonstrating integration with Resend API / EmailJS.
   * ---------------------------------------------------------------------------- */
  const ContactManager = {
    form: document.getElementById('contact-form'),
    submitBtn: document.getElementById('contact-submit-btn'),
    successBanner: document.getElementById('contact-success-banner'),
    nameInput: document.getElementById('contact-name'),
    emailInput: document.getElementById('contact-email'),
    messageInput: document.getElementById('contact-message'),

    init() {
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    },

    validate() {
      let isValid = true;

      // Name validation
      if (!this.nameInput.value.trim()) {
        this.showError('name-error', true);
        this.nameInput.classList.add('error');
        isValid = false;
      } else {
        this.showError('name-error', false);
        this.nameInput.classList.remove('error');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.emailInput.value.trim())) {
        this.showError('email-error', true);
        this.emailInput.classList.add('error');
        isValid = false;
      } else {
        this.showError('email-error', false);
        this.emailInput.classList.remove('error');
      }

      // Message validation
      if (!this.messageInput.value.trim()) {
        this.showError('message-error', true);
        this.messageInput.classList.add('error');
        isValid = false;
      } else {
        this.showError('message-error', false);
        this.messageInput.classList.remove('error');
      }

      return isValid;
    },

    showError(errorId, show) {
      const el = document.getElementById(errorId);
      if (el) el.style.display = show ? 'block' : 'none';
    },

    async handleSubmit() {
      if (!this.validate()) {
        AudioEngine.playBlip(220, 'sawtooth', 0.15); // Error sound
        return;
      }

      AudioEngine.playAction();
      const originalBtnText = this.submitBtn.innerHTML;
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = `<span>TRANSMITTING...</span> ⏳`;

      // =========================================================================
      // EMAIL API INTEGRATION POINT (PROMPT 11 COMMENT REQUIREMENT)
      // To integrate with an email sending provider like Resend API or EmailJS:
      //
      // Using Resend API (via serverless API endpoint /api/send-email):
      // const payload = {
      //   from: 'portfolio@yourdomain.com',
      //   to: 'bharathtj77@gmail.com',
      //   subject: document.getElementById('contact-subject').value || 'New Portfolio Message',
      //   html: `<p><strong>Name:</strong> ${this.nameInput.value}</p>
      //          <p><strong>Email:</strong> ${this.emailInput.value}</p>
      //          <p><strong>Message:</strong> ${this.messageInput.value}</p>`
      // };
      // await fetch('https://api.resend.com/emails', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(payload)
      // });
      // =========================================================================

      // Simulate network request latency
      setTimeout(() => {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = originalBtnText;

        // Display success confirmation message
        if (this.successBanner) {
          this.successBanner.classList.remove('hidden');
          this.successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        AudioEngine.playSuccess();
        this.form.reset();

        // Automatically hide notification after 8 seconds
        setTimeout(() => {
          if (this.successBanner) this.successBanner.classList.add('hidden');
        }, 8000);
      }, 900);
    }
  };
  ContactManager.init();

  console.log('👾 Bharath T J Portfolio interaction engine initialized successfully.');
});
