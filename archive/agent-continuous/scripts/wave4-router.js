/**
 * Wave 4 A/B Test Router
 * Routes traffic to Wave 4 test variants with dynamic allocation
 *
 * Tests:
 * - Quad Threat Mega Combo (30% traffic)
 * - Advanced AI Optimization (30% traffic)
 * - Voice Interface Integration (30% traffic)
 * - AR/VR Product Previews (10% traffic)
 *
 * Date: 2026-02-01
 */

class Wave4Router {
  constructor() {
    this.tests = {
      quad_threat: {
        name: 'Quad Threat Mega Combo',
        allocation: 0.30,
        pages: ['trust.html', 'workspace.html', 'apple-style.html'],
        variants: ['quad-trust', 'quad-workspace', 'quad-apple']
      },
      ai_optimization: {
        name: 'Advanced AI Optimization',
        allocation: 0.30,
        pages: ['research.html', 'comparison.html'],
        variants: ['ai-research', 'ai-comparison']
      },
      voice_interface: {
        name: 'Voice Interface Integration',
        allocation: 0.30,
        pages: ['productivity.html', 'future.html'],
        variants: ['voice-productivity', 'voice-future']
      },
      ar_vr_preview: {
        name: 'AR/VR Product Previews',
        allocation: 0.10,
        pages: ['apple-style.html', 'future.html'],
        variants: ['ar-apple', 'ar-future']
      }
    };

    this.cookieName = 'wave4_test_assignment';
    this.cookieDuration = 30; // days
    this.currentPage = this.getCurrentPage();
  }

  /**
   * Get current page filename
   */
  getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1);
  }

  /**
   * Determine which test(s) this page is eligible for
   */
  getEligibleTests() {
    const eligible = [];
    for (const [testId, test] of Object.entries(this.tests)) {
      if (test.pages.includes(this.currentPage)) {
        eligible.push(testId);
      }
    }
    return eligible;
  }

  /**
   * Get user's test assignment from cookie or assign new one
   */
  getUserAssignment() {
    // Check if already assigned
    const existing = this.getCookie(this.cookieName);
    if (existing) {
      return JSON.parse(existing);
    }

    // Assign new user to tests
    const assignment = this.assignToTests();
    this.setCookie(this.cookieName, JSON.stringify(assignment), this.cookieDuration);
    return assignment;
  }

  /**
   * Assign user to test variants based on allocation
   */
  assignToTests() {
    const assignment = {};
    const eligibleTests = this.getEligibleTests();

    for (const testId of eligibleTests) {
      const test = this.tests[testId];
      const random = Math.random();

      // Weighted random assignment based on allocation
      if (random < test.allocation) {
        assignment[testId] = 'variant';
      } else {
        assignment[testId] = 'control';
      }
    }

    return assignment;
  }

  /**
   * Load test variant for current page
   */
  loadVariant() {
    const assignment = this.getUserAssignment();
    const eligibleTests = this.getEligibleTests();

    // Find first test that user is in variant group for
    for (const testId of eligibleTests) {
      if (assignment[testId] === 'variant') {
        const test = this.tests[testId];
        const variantIndex = test.pages.indexOf(this.currentPage);
        if (variantIndex !== -1) {
          const variantId = test.variants[variantIndex];
          this.applyVariant(testId, variantId);
          this.trackAssignment(testId, variantId);
          return;
        }
      }
    }

    // User in control group for all tests
    this.trackAssignment('control', 'baseline');
  }

  /**
   * Apply test variant to page
   */
  applyVariant(testId, variantId) {
    console.log(`[Wave 4] Applying variant: ${testId} - ${variantId}`);

    switch (testId) {
      case 'quad_threat':
        this.loadQuadThreat(variantId);
        break;
      case 'ai_optimization':
        this.loadAIOptimization(variantId);
        break;
      case 'voice_interface':
        this.loadVoiceInterface(variantId);
        break;
      case 'ar_vr_preview':
        this.loadARVR(variantId);
        break;
    }
  }

  /**
   * Load Quad Threat Mega Combo variant
   */
  loadQuadThreat(variantId) {
    // Add Quad Threat specific CSS
    this.injectCSS(`
      /* Quad Threat Mega Combo Styles */
      .quad-threat-container {
        position: relative;
        min-height: 100vh;
      }

      /* Mobile-Optimized: Sticky CTA */
      .sticky-cta-quad {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
        color: white;
        padding: 16px 32px;
        border-radius: 50px;
        font-size: 18px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(66, 133, 244, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .sticky-cta-quad:hover {
        transform: translateX(-50%) translateY(-2px);
        box-shadow: 0 12px 32px rgba(66, 133, 244, 0.4);
      }

      /* Social Proof: Trust Banner */
      .social-proof-banner-quad {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 16px 24px;
        margin: 24px 0;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .social-proof-avatars {
        display: flex;
        margin-right: 8px;
      }

      .social-proof-avatars img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        margin-left: -8px;
      }

      .social-proof-avatars img:first-child {
        margin-left: 0;
      }

      /* Video Integration: Hero Video */
      .hero-video-quad {
        width: 100%;
        max-width: 1200px;
        border-radius: 16px;
        margin: 32px auto;
        display: block;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      }

      /* Interactive Demo: Embedded */
      .interactive-demo-quad {
        background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
        border-radius: 16px;
        padding: 48px 24px;
        margin: 48px 0;
        text-align: center;
      }

      .interactive-demo-quad iframe {
        width: 100%;
        max-width: 800px;
        height: 500px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      }

      @media (max-width: 768px) {
        .sticky-cta-quad {
          bottom: 10px;
          padding: 14px 28px;
          font-size: 16px;
        }

        .social-proof-banner-quad {
          flex-direction: column;
          text-align: center;
        }

        .interactive-demo-quad iframe {
          height: 400px;
        }
      }
    `);

    // Inject Quad Threat elements
    this.injectHTML('quad-threat', `
      <div class="quad-threat-container">
        <!-- Sticky CTA (Mobile-Optimized) -->
        <button class="sticky-cta-quad" onclick="window.open('https://gemini.google.com', '_blank')">
          Try Gemini Free →
        </button>

        <!-- Social Proof Banner -->
        <div class="social-proof-banner-quad">
          <div class="social-proof-avatars">
            <img src="data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='16' fill='%234285f4'/%3E%3C/svg%3E" alt="User 1">
            <img src="data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2334a853'/%3E%3C/svg%3E" alt="User 2">
            <img src="data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23fbbc04'/%3E%3C/svg%3E" alt="User 3">
          </div>
          <span style="font-weight: 600; font-size: 16px;">
            Join 2.5M+ professionals using Gemini
          </span>
        </div>

        <!-- Hero Video (Video Integration) -->
        <video class="hero-video-quad" autoplay muted loop playsinline>
          <source src="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0AAACrQYF//+p3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1MiByMjg1NCBlOWE1OTAzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNyAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEyIGxvb2thaGVhZF90aHJlYWRzPTIgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0yNSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAA9liIQAV/0TAAYdgAAAAwAAAwAAAwAAAwAAHv4BJwAAAMhBmk0VEiPBqQyYcw" type="video/mp4">
        </video>

        <!-- Interactive Demo -->
        <div class="interactive-demo-quad">
          <h3 style="font-size: 32px; margin-bottom: 24px;">Try Gemini Live</h3>
          <iframe src="about:blank" title="Interactive Gemini Demo"></iframe>
        </div>
      </div>
    `);

    // Track events
    this.trackEvent('wave4_quad_threat_loaded', { variant: variantId });
  }

  /**
   * Load AI Optimization variant
   */
  loadAIOptimization(variantId) {
    // Initialize AI personalization engine
    this.injectScript(`
      (function() {
        class AIOptimizer {
          constructor() {
            this.userProfile = this.buildUserProfile();
            this.optimize();
          }

          buildUserProfile() {
            return {
              device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
              source: document.referrer || 'direct',
              timeOfDay: new Date().getHours(),
              behavior: {
                quickScroller: false,
                researcher: false,
                returning: localStorage.getItem('gemini_visited') !== null
              }
            };
          }

          optimize() {
            this.optimizeHero();
            this.optimizeCTA();
            this.optimizeSocialProof();
            localStorage.setItem('gemini_visited', 'true');
          }

          optimizeHero() {
            const profile = this.userProfile;
            let heroText = "Get instant answers with Gemini";

            if (profile.behavior.returning) {
              heroText = "Welcome back! Ready to continue?";
            } else if (profile.timeOfDay >= 22 || profile.timeOfDay < 6) {
              heroText = "Work smarter, even late at night";
            } else if (profile.source.includes('google')) {
              heroText = "Supercharge your Google Workspace";
            }

            const heroElement = document.querySelector('.hero h1, .hero-text, h1');
            if (heroElement) {
              heroElement.setAttribute('data-original', heroElement.textContent);
              heroElement.textContent = heroText;
              heroElement.style.transition = 'opacity 0.5s ease';
              heroElement.style.opacity = '1';
            }
          }

          optimizeCTA() {
            const ctaButton = document.querySelector('.cta-button, .btn-primary, button');
            if (ctaButton && this.userProfile.behavior.returning) {
              ctaButton.textContent = 'Continue with Gemini →';
            }
          }

          optimizeSocialProof() {
            const profile = this.userProfile;
            let testimonial = "Join 2.5M+ users worldwide";

            if (profile.device === 'mobile') {
              testimonial = "2.5M+ users on mobile";
            } else if (profile.source.includes('linkedin')) {
              testimonial = "Trusted by 500K+ professionals";
            }

            const socialProofElement = document.querySelector('.social-proof, .testimonial');
            if (socialProofElement) {
              socialProofElement.textContent = testimonial;
            }
          }
        }

        // Initialize on page load
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => new AIOptimizer());
        } else {
          new AIOptimizer();
        }
      })();
    `);

    this.trackEvent('wave4_ai_optimization_loaded', {
      variant: variantId,
      personalization_enabled: true
    });
  }

  /**
   * Load Voice Interface variant
   */
  loadVoiceInterface(variantId) {
    // Add voice interface CSS
    this.injectCSS(`
      .voice-interface-container {
        position: fixed;
        bottom: 80px;
        right: 24px;
        z-index: 999;
      }

      .voice-trigger {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ea4335 0%, #fbbc04 100%);
        border: none;
        font-size: 32px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(234, 67, 53, 0.3);
        transition: all 0.3s ease;
      }

      .voice-trigger:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 32px rgba(234, 67, 53, 0.4);
      }

      .voice-trigger.listening {
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }

      .voice-transcript {
        position: absolute;
        bottom: 80px;
        right: 0;
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        min-width: 250px;
        max-width: 350px;
        display: none;
      }

      .voice-transcript.active {
        display: block;
      }

      @media (max-width: 768px) {
        .voice-interface-container {
          bottom: 70px;
          right: 16px;
        }

        .voice-trigger {
          width: 56px;
          height: 56px;
          font-size: 28px;
        }
      }
    `);

    // Inject voice interface
    this.injectHTML('voice-interface', `
      <div class="voice-interface-container">
        <button class="voice-trigger" title="Voice Command">🎤</button>
        <div class="voice-transcript"></div>
      </div>
    `);

    // Add voice recognition script
    this.injectScript(`
      (function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          console.log('[Voice] Speech Recognition not supported');
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        const button = document.querySelector('.voice-trigger');
        const transcript = document.querySelector('.voice-transcript');

        button.addEventListener('click', () => {
          button.classList.add('listening');
          transcript.classList.add('active');
          transcript.textContent = 'Listening...';
          recognition.start();
        });

        recognition.onresult = (event) => {
          const command = event.results[0][0].transcript.toLowerCase();
          transcript.textContent = 'You said: "' + command + '"';

          if (command.includes('try gemini') || command.includes('sign up')) {
            transcript.textContent = 'Opening Gemini...';
            setTimeout(() => {
              window.open('https://gemini.google.com', '_blank');
            }, 1000);
          } else if (command.includes('features')) {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
              featuresSection.scrollIntoView({ behavior: 'smooth' });
              transcript.textContent = 'Showing features';
            }
          } else {
            transcript.textContent = 'Try saying: "Try Gemini" or "Show features"';
          }

          button.classList.remove('listening');
          setTimeout(() => {
            transcript.classList.remove('active');
          }, 3000);
        };

        recognition.onerror = (event) => {
          button.classList.remove('listening');
          transcript.textContent = 'Voice not detected. Try again.';
          setTimeout(() => {
            transcript.classList.remove('active');
          }, 2000);
        };
      })();
    `);

    this.trackEvent('wave4_voice_interface_loaded', { variant: variantId });
  }

  /**
   * Load AR/VR Preview variant
   */
  loadARVR(variantId) {
    // Add AR/VR CSS
    this.injectCSS(`
      .ar-vr-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 80px 24px;
        text-align: center;
        margin: 48px 0;
        border-radius: 24px;
      }

      .ar-vr-section h2 {
        font-size: 48px;
        margin-bottom: 24px;
      }

      .ar-button {
        background: white;
        color: #667eea;
        padding: 16px 32px;
        border-radius: 50px;
        font-size: 18px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        margin: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      }

      .ar-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
      }

      .model-placeholder {
        width: 100%;
        max-width: 600px;
        height: 400px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        margin: 32px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 64px;
      }
    `);

    // Inject AR/VR section
    this.injectHTML('ar-vr', `
      <div class="ar-vr-section">
        <h2>Experience Gemini in 3D</h2>
        <p style="font-size: 20px; opacity: 0.9; margin-bottom: 32px;">
          See how Gemini transforms your workspace
        </p>

        <div class="model-placeholder">🥽</div>

        <button class="ar-button" onclick="alert('AR experience launching... (Demo mode)')">
          📱 View in Your Space (AR)
        </button>

        <button class="ar-button" onclick="alert('VR demo launching... (Demo mode)')">
          🥽 Launch VR Demo
        </button>
      </div>
    `);

    this.trackEvent('wave4_ar_vr_loaded', { variant: variantId });
  }

  /**
   * Helper: Inject CSS
   */
  injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Helper: Inject HTML
   */
  injectHTML(position, html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.className = `wave4-inject wave4-${position}`;

    // Insert at appropriate location
    const target = document.querySelector('.hero, main, body');
    if (target) {
      if (position === 'quad-threat') {
        target.insertBefore(container, target.firstChild);
      } else {
        target.appendChild(container);
      }
    }
  }

  /**
   * Helper: Inject Script
   */
  injectScript(code) {
    const script = document.createElement('script');
    script.textContent = code;
    document.body.appendChild(script);
  }

  /**
   * Track test assignment
   */
  trackAssignment(testId, variantId) {
    if (window.gtag) {
      gtag('event', 'wave4_assignment', {
        test_id: testId,
        variant_id: variantId,
        page: this.currentPage
      });
    }
    console.log(`[Wave 4] User assigned to: ${testId} - ${variantId}`);
  }

  /**
   * Track event
   */
  trackEvent(eventName, params = {}) {
    if (window.gtag) {
      gtag('event', eventName, params);
    }
    console.log(`[Wave 4] Event: ${eventName}`, params);
  }

  /**
   * Cookie helpers
   */
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const router = new Wave4Router();
    router.loadVariant();
  });
} else {
  const router = new Wave4Router();
  router.loadVariant();
}
