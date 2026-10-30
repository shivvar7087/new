/**
 * Shiv Anuj - Portfolio JavaScript
 * Modern, Lightweight, Accessible, and High Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticleCanvas();
  initTypewriter();
  initStatsCounter();
  initSkillsFilter();
  initMobileNav();
  initActiveNavSpy();
  initContactForm();
  initYear();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Compliant with Modern Web Guidance)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  if (!toggleBtn || !metaColorScheme) return;

  function getCurrentTheme() {
    const stored = localStorage.getItem('color-scheme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = systemPrefersDark ? 'dark' : 'light';

    // If target matches system, remove override so it tracks system; otherwise store target
    if (targetTheme === systemTheme) {
      localStorage.removeItem('color-scheme');
      metaColorScheme.content = 'light dark';
    } else {
      localStorage.setItem('color-scheme', targetTheme);
      metaColorScheme.content = targetTheme;
    }
  }

  toggleBtn.addEventListener('click', toggleTheme);

  // Sync across tabs
  window.addEventListener('storage', (event) => {
    if (event.key === 'color-scheme') {
      metaColorScheme.content = event.newValue ?? 'light dark';
    }
  });
}

/* --------------------------------------------------------------------------
   2. Interactive Background Particle Canvas
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.5 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.18 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typedTextEl = document.getElementById('typed-text');
  if (!typedTextEl) return;

  const roles = [
    'Full-Stack Developer',
    'Machine Learning Engineer',
    'Python & FastAPI Architect',
    'React.js Specialist',
    'Open Source Contributor'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const holdDelay = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. Stats Counter on Scroll
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute('data-count'), 10);
            const isPercent = stat.textContent.includes('%');
            let count = 0;
            const duration = 1500;
            const stepTime = 30;
            const increment = Math.ceil(target / (duration / stepTime));

            const timer = setInterval(() => {
              count += increment;
              if (count >= target) {
                count = target;
                clearInterval(timer);
              }
              stat.textContent = count + (isPercent ? '%' : '+');
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   5. Skills Category Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.skill-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Active Navigation Spy on Scroll
   -------------------------------------------------------------------------- */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
}

/* --------------------------------------------------------------------------
   8. Accessible Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const gmailBtn = document.getElementById('gmail-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  const targetEmail = 'shivvar70878@gmail.com';

  if (!form || !toast) return;

  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Handle Copy Email button
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(targetEmail).then(() => {
        showToast(`Copied ${targetEmail} to clipboard!`, 'success');
      }).catch(() => {
        showToast(`Email: ${targetEmail}`, 'success');
      });
    });
  }

  function getFormData() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Reset errors
    [nameInput, emailInput, messageInput].forEach((el) => {
      el.parentElement.classList.remove('has-error');
    });

    let isValid = true;

    if (!nameInput.value.trim()) {
      nameInput.parentElement.classList.add('has-error');
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      emailInput.parentElement.classList.add('has-error');
      emailError.textContent = 'Please enter your email.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailInput.parentElement.classList.add('has-error');
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      messageInput.parentElement.classList.add('has-error');
      messageError.textContent = 'Please enter a message.';
      isValid = false;
    }

    if (!isValid) return null;

    return {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput?.value.trim() || 'New Portfolio Message from Shiv.dev',
      message: messageInput.value.trim()
    };
  }

  // Handle "Open in Web Gmail" button
  if (gmailBtn) {
    gmailBtn.addEventListener('click', () => {
      const data = getFormData();
      if (!data) return;

      const body = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      
      window.open(gmailUrl, '_blank');
      showToast('Opening Web Gmail with pre-filled message...', 'success');
    });
  }

  // Send through FormSubmit and report the actual result. Do not launch mailto
  // at the same time: leaving the page can interrupt the background request.
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = getFormData();
    if (!data) return;

    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending message...</span> <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          _replyto: data.email,
          subject: data.subject,
          message: data.message,
          _captcha: 'false',
          _template: 'table'
        })
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('The mail service returned an unreadable response.');
      }

      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error(result.message || 'The mail service could not accept your message.');
      }

      form.reset();
      showToast('Your message was submitted successfully. Thank you for reaching out!', 'success');
    } catch (error) {
      const reason = error.name === 'AbortError'
        ? 'The request timed out.'
        : 'The message could not be sent right now.';
      showToast(`${reason} Please try Open in Web Gmail or use the email link below. Your message is still here.`, 'error');
    } finally {
      clearTimeout(timeoutId);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

/* --------------------------------------------------------------------------
   9. Footer Dynamic Year
   -------------------------------------------------------------------------- */
function initYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
