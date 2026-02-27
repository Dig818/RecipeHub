/**
 * auth.js — RecipeHub Authentication Module
 * ============================================
 * Handles all user authentication UI and logic:
 *  - Login / Register modal open & close
 *  - Tab switching between Login and Register panels
 *  - Client-side form validation for both forms
 *  - Simulated login / registration (no real backend)
 *  - Logout functionality
 *  - Auth UI state updates (navbar, mobile menu)
 *
 * Depends on: utils.js (isValidEmail, validatePassword,
 *             safeGet, safeSet, safeRemove)
 *             data.js (CURRENT_USER, simulateLogin,
 *                      loadPersistedUser, logoutUser)
 */

/* ─────────────────────────────────────────────────────────────
   INITIALISATION
   ───────────────────────────────────────────────────────────── */

/**
 * Initialises all authentication functionality.
 * Called once on DOM ready from main.js.
 */
function initAuth() {
  loadPersistedUser();
  updateAuthUI();
  initAuthModal();
}

/* ─────────────────────────────────────────────────────────────
   MODAL MANAGEMENT
   ───────────────────────────────────────────────────────────── */

/**
 * Opens the auth modal and switches to the specified tab.
 * Traps focus within modal for accessibility.
 * @param {string} [tab='login'] - 'login' | 'register'
 */
function openAuthModal(tab) {
  const $overlay = $('#auth-modal');
  $overlay.addClass('active');
  $('body').css('overflow', 'hidden');
  switchAuthTab(tab || 'login');

  // Focus first visible input after transition
  setTimeout(function () {
    $overlay.find('input:visible').first().trigger('focus');
  }, 320);
}

/**
 * Closes the auth modal and resets all form states.
 */
function closeAuthModal() {
  const $overlay = $('#auth-modal');
  $overlay.removeClass('active');
  $('body').css('overflow', '');
  clearAuthValidation('#login-panel');
  clearAuthValidation('#register-panel');
  // Reset form fields
  $('#login-form')[0] && $('#login-form')[0].reset();
  $('#register-form')[0] && $('#register-form')[0].reset();
}

/**
 * Switches the visible tab panel inside the auth modal.
 * Updates ARIA attributes for accessibility.
 * @param {string} tab - 'login' | 'register'
 */
function switchAuthTab(tab) {
  if (tab === 'login') {
    $('#login-panel').show();
    $('#register-panel').hide();
    $('[data-tab="login"]').addClass('active').attr('aria-selected', 'true');
    $('[data-tab="register"]').removeClass('active').attr('aria-selected', 'false');
  } else {
    $('#login-panel').hide();
    $('#register-panel').show();
    $('[data-tab="login"]').removeClass('active').attr('aria-selected', 'false');
    $('[data-tab="register"]').addClass('active').attr('aria-selected', 'true');
  }
}

/**
 * Binds all auth modal event listeners.
 * Handles open triggers, close triggers, tab switching,
 * form submissions, and logout.
 */
function initAuthModal() {
  // ── Open Modal ──────────────────────────────────────────
  $(document).on('click', '#login-btn, #mobile-login-btn, [data-open-modal="login"]', function () {
    openAuthModal('login');
  });

  $(document).on('click', '#register-btn, #mobile-register-btn, [data-open-modal="register"]', function () {
    openAuthModal('register');
  });

  // ── Tab Switching ────────────────────────────────────────
  $(document).on('click', '.modal__tab', function () {
    const tab = $(this).data('tab');
    if (tab) switchAuthTab(tab);
  });

  // ── Close: Button ────────────────────────────────────────
  $(document).on('click', '#auth-modal-close', function () {
    closeAuthModal();
  });

  // ── Close: Click Outside Modal ───────────────────────────
  $(document).on('click', '#auth-modal', function (e) {
    if ($(e.target).is('#auth-modal')) {
      closeAuthModal();
    }
  });

  // ── Close: Escape Key ────────────────────────────────────
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#auth-modal').hasClass('active')) {
      closeAuthModal();
    }
  });

  // ── Login Form Submit ────────────────────────────────────
  $(document).on('submit', '#login-form', function (e) {
    e.preventDefault();
    handleLogin();
  });

  // ── Register Form Submit ─────────────────────────────────
  $(document).on('submit', '#register-form', function (e) {
    e.preventDefault();
    handleRegister();
  });

  // ── Logout ───────────────────────────────────────────────
  $(document).on('click', '#logout-btn', function () {
    handleLogout();
  });
}

/* ─────────────────────────────────────────────────────────────
   AUTHENTICATION HANDLERS
   ───────────────────────────────────────────────────────────── */

/**
 * Processes the login form submission.
 * Validates fields, simulates authentication, updates UI.
 */
function handleLogin() {
  if (!validateLoginForm()) return;

  const email = $('#login-email').val().trim();

  // Simulate a slight loading delay for realism
  const $btn = $('#login-form [type="submit"]');
  $btn.prop('disabled', true).html('<i class="fas fa-circle-notch fa-spin"></i> Signing In...');

  setTimeout(function () {
    // Simulate: extract first name from email or use generic
    const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
    const name = titleCase(namePart);

    simulateLogin(name, email);
    closeAuthModal();
    updateAuthUI();

    const firstName = name.split(' ')[0];
    showToast(`Welcome back, ${firstName}! 👋`, 'success');

    $btn.prop('disabled', false).html('<i class="fas fa-sign-in-alt"></i> Sign In');
  }, 800);
}

/**
 * Processes the registration form submission.
 * Validates fields, simulates account creation, updates UI.
 */
function handleRegister() {
  if (!validateRegisterForm()) return;

  const name  = $('#register-name').val().trim();
  const email = $('#register-email').val().trim();

  const $btn = $('#register-form [type="submit"]');
  $btn.prop('disabled', true).html('<i class="fas fa-circle-notch fa-spin"></i> Creating Account...');

  setTimeout(function () {
    simulateLogin(name, email);
    closeAuthModal();
    updateAuthUI();

    const firstName = name.split(' ')[0];
    showToast(`Account created! Welcome to RecipeHub, ${firstName}! 🍳`, 'success', 4000);

    $btn.prop('disabled', false).html('<i class="fas fa-user-plus"></i> Create Account');
  }, 1000);
}

/**
 * Processes user logout.
 * Clears session, updates UI, and redirects if on a protected page.
 */
function handleLogout() {
  logoutUser();
  updateAuthUI();
  showToast('You have been logged out. See you soon!', 'info');

  // If on profile page, redirect to home
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'profile.html') {
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1500);
  }
}

/* ─────────────────────────────────────────────────────────────
   FORM VALIDATION
   ───────────────────────────────────────────────────────────── */

/**
 * Validates the login form.
 * Checks email format and password minimum length.
 * @returns {boolean} - true if all fields are valid
 */
function validateLoginForm() {
  let valid = true;
  clearAuthValidation('#login-panel');

  const email = $('#login-email').val().trim();
  const pass  = $('#login-password').val();

  if (!email || !isValidEmail(email)) {
    setAuthError('#login-email', 'Please enter a valid email address.');
    valid = false;
  } else {
    setAuthSuccess('#login-email');
  }

  if (!pass || pass.length < 6) {
    setAuthError('#login-password', 'Password must be at least 6 characters.');
    valid = false;
  } else {
    setAuthSuccess('#login-password');
  }

  return valid;
}

/**
 * Validates the registration form.
 * Checks name, email, password strength, and password match.
 * @returns {boolean} - true if all fields are valid
 */
function validateRegisterForm() {
  let valid = true;
  clearAuthValidation('#register-panel');

  const name    = $('#register-name').val().trim();
  const email   = $('#register-email').val().trim();
  const pass    = $('#register-password').val();
  const confirm = $('#register-confirm').val();

  // Name validation
  if (isEmpty(name) || name.length < 2) {
    setAuthError('#register-name', 'Full name must be at least 2 characters.');
    valid = false;
  } else if (name.length > 60) {
    setAuthError('#register-name', 'Name must be 60 characters or fewer.');
    valid = false;
  } else {
    setAuthSuccess('#register-name');
  }

  // Email validation
  if (!email || !isValidEmail(email)) {
    setAuthError('#register-email', 'Please enter a valid email address.');
    valid = false;
  } else {
    setAuthSuccess('#register-email');
  }

  // Password strength validation
  const passResult = validatePassword(pass);
  if (!passResult.valid) {
    setAuthError('#register-password', passResult.message);
    valid = false;
  } else {
    setAuthSuccess('#register-password');
  }

  // Password confirmation
  if (isEmpty(confirm)) {
    setAuthError('#register-confirm', 'Please confirm your password.');
    valid = false;
  } else if (pass !== confirm) {
    setAuthError('#register-confirm', 'Passwords do not match.');
    valid = false;
  } else if (passResult.valid) {
    setAuthSuccess('#register-confirm');
  }

  return valid;
}

/* ─────────────────────────────────────────────────────────────
   VALIDATION UI HELPERS
   ───────────────────────────────────────────────────────────── */

/**
 * Marks an input as invalid and inserts an error message below it.
 * @param {string} selector - CSS selector for the input element
 * @param {string} message  - Error message text
 */
function setAuthError(selector, message) {
  const $field = $(selector);
  $field.addClass('is-invalid').removeClass('is-valid');
  $field.siblings('.form-error').remove();
  $field.after(
    `<div class="form-error" role="alert">
       <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
       ${escapeHtml(message)}
     </div>`
  );
}

/**
 * Marks an input as valid and removes any existing error message.
 * @param {string} selector - CSS selector for the input element
 */
function setAuthSuccess(selector) {
  const $field = $(selector);
  $field.addClass('is-valid').removeClass('is-invalid');
  $field.siblings('.form-error').remove();
}

/**
 * Clears all validation states within a container.
 * Removes is-valid, is-invalid classes and error messages.
 * @param {string} containerSelector - CSS selector for the container
 */
function clearAuthValidation(containerSelector) {
  const $container = $(containerSelector);
  $container.find('.form-control').removeClass('is-valid is-invalid');
  $container.find('.form-error').remove();
}

/* ─────────────────────────────────────────────────────────────
   AUTH UI STATE
   ───────────────────────────────────────────────────────────── */

/**
 * Updates the navbar and mobile menu to reflect the current
 * authentication state (logged in vs. logged out).
 * Called after login, logout, and on page load.
 */
function updateAuthUI() {
  if (CURRENT_USER) {
    // Desktop: hide auth buttons, show avatar
    $('.navbar__auth').hide();
    $('.navbar__user')
      .addClass('visible')
      .find('.navbar__user-avatar')
      .text(CURRENT_USER.initials)
      .attr('title', `${CURRENT_USER.name} — View Profile`);

    // Mobile: show user info + profile link + logout
    $('#mobile-auth-section').html(`
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;
                  background:var(--color-bg-section);border-radius:var(--radius-md)">
        <div class="navbar__user-avatar" style="flex-shrink:0;width:40px;height:40px;
             font-size:var(--text-sm)">${escapeHtml(CURRENT_USER.initials)}</div>
        <div>
          <div style="font-weight:600;font-size:var(--text-sm);
                      color:var(--color-dark)">${escapeHtml(CURRENT_USER.name)}</div>
          <div style="font-size:var(--text-xs);color:var(--color-muted)">
            ${escapeHtml(CURRENT_USER.email)}
          </div>
        </div>
      </div>
      <a href="profile.html" class="btn btn-outline w-100" style="justify-content:center">
        <i class="fas fa-user" aria-hidden="true"></i> My Profile
      </a>
      <button class="btn w-100" id="logout-btn"
              style="justify-content:center;color:var(--color-error);
                     background:rgba(231,76,60,0.06);border:1.5px solid rgba(231,76,60,0.2)">
        <i class="fas fa-sign-out-alt" aria-hidden="true"></i> Logout
      </button>
    `);
  } else {
    // Desktop: show auth buttons, hide avatar
    $('.navbar__auth').show();
    $('.navbar__user').removeClass('visible');

    // Mobile: show login + register buttons
    $('#mobile-auth-section').html(`
      <button class="btn btn-outline w-100" id="mobile-login-btn">
        <i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login
      </button>
      <button class="btn btn-primary w-100" id="mobile-register-btn">
        <i class="fas fa-user-plus" aria-hidden="true"></i> Create Account
      </button>
    `);
  }
}
