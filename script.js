const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const themeToggle = document.querySelector('.theme-toggle');
const faqItems = document.querySelectorAll('.faq-item');
const heroCards = document.querySelectorAll('.hero-card');

const setTheme = (isLight) => {
  document.body.classList.toggle('theme-light', isLight);
  if (themeToggle instanceof HTMLElement) {
    themeToggle.querySelector('.theme-icon').textContent = isLight ? '🌙' : '☀️';
  }
  window.localStorage.setItem('pathpilot-theme', isLight ? 'light' : 'dark');
};

const savedTheme = window.localStorage.getItem('pathpilot-theme');
setTheme(savedTheme === 'light');

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.classList.toggle('open');
  mainNav?.classList.toggle('open');
});

themeToggle?.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('theme-light'));
});

faqItems.forEach((item) => {
  item.addEventListener('click', () => {
    const expanded = item.getAttribute('aria-expanded') === 'true';
    item.setAttribute('aria-expanded', String(!expanded));
    const panel = item.nextElementSibling;

    if (panel instanceof HTMLElement) {
      if (expanded) {
        panel.style.maxHeight = '0';
        panel.style.paddingTop = '0';
        panel.style.paddingBottom = '0';
        item.querySelector('.faq-icon')?.textContent = '+';
      } else {
        panel.style.maxHeight = `${panel.scrollHeight + 24}px`;
        panel.style.paddingTop = '18px';
        panel.style.paddingBottom = '20px';
        item.querySelector('.faq-icon')?.textContent = '−';
      }
    }
  });
});

const passwordToggles = document.querySelectorAll('.password-toggle');
passwordToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = toggle.previousElementSibling;
    if (input instanceof HTMLInputElement) {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.textContent = isPassword ? 'Hide' : 'Show';
    }
  });
});

const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
};

const redirectTo = (url, message = 'Success! Redirecting...') => {
  showToast(message, 'success');
  setTimeout(() => {
    window.location.href = url;
  }, 900);
};

const handleAuthForm = (form, redirect) => {
  const getInputValue = (selector) => {
    const input = form.querySelector(selector);
    return input instanceof HTMLInputElement ? input.value.trim() : '';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = getInputValue('input[type="email"]');
    const password = getInputValue('input[type="password"]');
    const name = getInputValue('input[name="name"]');
    const confirmPassword = getInputValue('input[name="confirm_password"]');

    if (!email || !password) {
      showToast('Please fill in both email and password.', 'error');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      showToast('Passwords do not match. Please check and try again.', 'error');
      return;
    }

    if (form.querySelector('input[name="name"]') && name === '') {
      showToast('Please enter your full name.', 'error');
      return;
    }

    redirectTo(redirect, name ? `Welcome, ${name}!` : 'Login successful!');
  });
};

const handleContactForm = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector('#contact-name')?.value.trim();
    const email = form.querySelector('#contact-email')?.value.trim();
    const message = form.querySelector('#contact-message')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please complete your message before sending.', 'error');
      return;
    }

    showToast('Message sent successfully. Our team will reply soon.', 'success');
    form.reset();
  });
};

const handlePlannerForm = (form) => {
  const routePreview = document.querySelector('#planner-preview');
  const stayPreview = document.querySelector('#planner-stay');
  const admitCardButton = document.querySelector('.planner-side-card .button');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const origin = form.querySelector('#from-city')?.value.trim();
    const destination = form.querySelector('#to-city')?.value.trim();
    const examDate = form.querySelector('#exam-date')?.value;
    const budget = form.querySelector('#budget-plan')?.value.trim();
    const travelType = form.querySelector('#travel-type')?.value;
    const stayType = form.querySelector('#stay-type')?.value;

    if (!origin || !destination || !budget) {
      showToast('Please enter your origin, destination, and budget.', 'error');
      return;
    }

    const formattedDate = examDate
      ? new Date(examDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'your exam date';

    showToast('Trip plan generated! See the updated preview below.', 'success');
    if (routePreview) {
      routePreview.textContent = `Your ${travelType.toLowerCase()} route from ${origin} to ${destination} on ${formattedDate} is ready.`;
    }
    if (stayPreview) {
      stayPreview.textContent = `Recommended stay: ${stayType} near the exam center for comfort, safety and quick transit.`;
    }

    const routeDetailMode = document.querySelector('.route-details div:nth-child(1) strong');
    const routeDetailCost = document.querySelector('.route-details div:nth-child(2) strong');
    if (routeDetailMode) {
      routeDetailMode.textContent = `${travelType}`;
    }
    if (routeDetailCost) {
      routeDetailCost.textContent = `~${budget}`;
    }
    setTimeout(() => {
      routePreview?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  });

  if (admitCardButton) {
    admitCardButton.addEventListener('click', () => {
      showToast('Admit card upload preview is enabled for the demo experience.', 'info');
    });
  }
};

const handleInteractiveLinks = () => {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('a[href="#"]');
    if (!target) return;
    event.preventDefault();
    const label = target.textContent.trim();
    showToast(`${label} opened in the demo.`, 'success');
  });
};

const handleAssistant = () => {
  const chatWindow = document.querySelector('.chat-window');
  const promptButtons = document.querySelectorAll('.assistant-side-card button');
  const assistantInput = document.querySelector('#assistant-prompt');
  const assistantSend = document.querySelector('#assistant-send');

  const addMessage = (speaker, text, role) => {
    if (!chatWindow) return;
    const message = document.createElement('div');
    message.className = `chat-message ${role}`;
    const content = document.createElement('span');
    content.textContent = text;
    message.appendChild(content);
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  const respond = (question) => {
    const answer = question.includes('budget')
      ? 'I suggest keeping your stay cost low, eating local meals, and using shared transport to stay under budget.'
      : question.includes('safety')
      ? 'Choose well-lit routes, stay near the exam center, and avoid late-night transfers.'
      : question.includes('hotel')
      ? 'The best student-friendly option is a budget guesthouse with breakfast and shuttle access.'
      : 'I recommend a safe, low-cost option with good transit connections for your exam journey.';

    setTimeout(() => {
      addMessage('PathPilot', answer, 'bot-message');
    }, 600);
  };

  if (promptButtons.length > 0) {
    promptButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const text = button.textContent.trim();
        addMessage('You', text, 'user-message');
        respond(text.toLowerCase());
      });
    });
  }

  if (assistantSend && assistantInput) {
    assistantSend.addEventListener('click', () => {
      const text = assistantInput.value.trim();
      if (!text) {
        showToast('Type a question to ask PathPilot.', 'error');
        return;
      }
      addMessage('You', text, 'user-message');
      assistantInput.value = '';
      respond(text.toLowerCase());
    });

    assistantInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        assistantSend.click();
      }
    });
  }
};

const authForm = document.querySelector('.auth-form');
if (authForm) {
  handleAuthForm(authForm, 'dashboard.html');
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  handleContactForm(contactForm);
}

const plannerForm = document.querySelector('.planner-form') || document.querySelector('.planner-form-card form');
if (plannerForm) {
  handlePlannerForm(plannerForm);
}

if (document.querySelector('.assistant-grid')) {
  handleAssistant();
}

handleInteractiveLinks();

window.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 24;
  const y = (event.clientY / window.innerHeight - 0.5) * 24;

  heroCards.forEach((card, index) => {
    const intensity = index === 0 ? 1 : 0.5;
    card.style.transform = `translate3d(${x * intensity}px, ${y * intensity}px, 0)`;
  });
});
