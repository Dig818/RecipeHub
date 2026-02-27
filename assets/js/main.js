/**
 * main.js — RecipeHub Global Initialisation
 * ============================================
 * Entry point for all shared, page-agnostic functionality.
 * Auth logic has been extracted to auth.js.
 *
 * Responsibilities:
 *  - Page loader dismiss
 *  - Navbar scroll state & mobile hamburger
 *  - Active nav link highlighting
 *  - Dark mode toggle (via CSS variables)
 *  - Scroll-to-top button
 *  - Toast notification system
 *  - Global bookmark button handler
 *
 * Load order in HTML (MUST be respected):
 *   1. utils.js      — pure helpers, no DOM
 *   2. data.js       — data store & auth state
 *   3. auth.js       — modal & auth UI
 *   4. main.js       — this file (global init)
 *   5. [page].js     — page-specific logic
 */

$(function () {
  dismissPageLoader();
  initTheme();
  initNavbar();
  setActiveNavLink();
  initScrollToTop();
  initAuth();
  initGlobalBookmarks();
});

function dismissPageLoader() {
  setTimeout(function () { $('#page-loader').addClass('hidden'); }, 400);
}

function initTheme() {
  const saved = safeGet('rh_theme') || 'light';
  applyTheme(saved);
}

function applyTheme(theme) {
  $('html').attr('data-theme', theme);
  $('.dark-toggle i').attr('class', theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon');
  safeSet('rh_theme', theme);
}

$(document).on('click', '.dark-toggle', function () {
  const current = $('html').attr('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

function initNavbar() {
  const $navbar = $('.navbar');
  const $burger = $('.navbar__hamburger');
  const $menu   = $('.navbar__mobile-menu');

  const handleScroll = throttle(function () {
    $navbar.toggleClass('scrolled', window.scrollY > 10);
  }, 100);
  $(window).on('scroll.navbar', handleScroll);
  handleScroll();

  $burger.on('click', function (e) {
    e.stopPropagation();
    const isOpen = $burger.hasClass('open');
    $burger.toggleClass('open', !isOpen).attr('aria-expanded', String(!isOpen));
    $menu.toggleClass('open', !isOpen);
  });

  $(document).on('click.menu', function (e) {
    if ($menu.hasClass('open') &&
        !$(e.target).closest('.navbar__mobile-menu, .navbar__hamburger').length) {
      $burger.removeClass('open').attr('aria-expanded', 'false');
      $menu.removeClass('open');
    }
  });

  $menu.on('click', '.navbar__mobile-link', function () {
    $burger.removeClass('open').attr('aria-expanded', 'false');
    $menu.removeClass('open');
  });
}

function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $('.navbar__link, .navbar__mobile-link').each(function () {
    const href = $(this).attr('href') || '';
    const hrefPage = href.split('/').pop().split('?')[0];
    const isActive = hrefPage === path || (path === '' && hrefPage === 'index.html');
    $(this).toggleClass('active', isActive);
    if (isActive) $(this).attr('aria-current', 'page');
  });
}

function initScrollToTop() {
  const $btn = $('.scroll-to-top');
  $(window).on('scroll.stt', throttle(function () {
    $btn.toggleClass('visible', window.scrollY > 400);
  }, 150));
  $btn.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
  });
}

function showToast(message, type, duration) {
  type     = type     || 'info';
  duration = duration || 3500;
  var iconMap = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  var icon = iconMap[type] || iconMap.info;

  var $container = $('.toast-container');
  if (!$container.length) {
    $container = $('<div class="toast-container" aria-live="polite"></div>').appendTo('body');
  }

  var $toast = $(
    '<div class="toast toast-' + type + '" role="status">' +
    '<i class="fas ' + icon + '" aria-hidden="true"></i>' +
    '<span>' + escapeHtml(message) + '</span>' +
    '</div>'
  );

  $container.append($toast);
  requestAnimationFrame(function () { $toast.addClass('show'); });

  var timer = setTimeout(dismiss, duration);
  $toast.on('click', function () { clearTimeout(timer); dismiss(); });

  function dismiss() {
    $toast.removeClass('show');
    setTimeout(function () { $toast.remove(); }, 400);
  }
}

function initGlobalBookmarks() {
  $(document).on('click', '.recipe-card__bookmark', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!CURRENT_USER) {
      showToast('Please log in to save recipes.', 'info');
      openAuthModal('login');
      return;
    }

    var $btn      = $(this);
    var recipeId  = Number($btn.data('recipe-id'));
    var isNowSaved = toggleBookmark(recipeId);

    $btn.toggleClass('active', isNowSaved);
    $btn.find('i').attr('class', isNowSaved ? 'fas fa-bookmark' : 'far fa-bookmark');
    $btn.attr({
      'aria-label': isNowSaved ? 'Remove bookmark' : 'Bookmark recipe',
      'title':      isNowSaved ? 'Saved — click to remove' : 'Save recipe'
    });

    $btn.addClass('animate-scaleIn');
    setTimeout(function () { $btn.removeClass('animate-scaleIn'); }, 400);

    showToast(
      isNowSaved ? 'Recipe saved to your bookmarks! 🔖' : 'Recipe removed from bookmarks.',
      isNowSaved ? 'success' : 'info'
    );
  });
}
