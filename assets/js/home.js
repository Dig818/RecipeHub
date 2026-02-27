/**
 * home.js — RecipeHub Home Page Logic
 * ======================================
 * Handles all interactions specific to index.html:
 *  - Renders category cards dynamically
 *  - Renders featured recipe cards
 *  - Animated stats counter (1,200+ Recipes etc.)
 *  - Hero search → redirects to recipes.html with query
 *  - Hero quick-tag click navigation
 *  - Newsletter form submission with validation
 *  - Scroll-triggered reveal animations (IntersectionObserver)
 */

$(function () {
  renderCategories();
  renderFeaturedRecipes();
  initStatsCounter();
  initHeroSearch();
  initNewsletterForm();
  initScrollReveal();
});

/* ─────────────────────────────────────────────────────────────
   CATEGORIES RENDER
   ───────────────────────────────────────────────────────────── */
/**
 * Dynamically builds the "Browse by Category" grid from the
 * CATEGORIES data array and injects it into #categories-grid.
 */
function renderCategories() {
  const $grid = $('#categories-grid');
  if (!$grid.length) return;

  const catClass = {
    "Breakfast": "cat-breakfast",
    "Lunch":     "cat-lunch",
    "Dinner":    "cat-dinner",
    "Dessert":   "cat-dessert",
    "Vegan":     "cat-vegan",
    "Drinks":    "cat-drinks",
  };

  let html = '';
  CATEGORIES.forEach(function (cat) {
    const cls = catClass[cat.name] || '';
    html += `
      <a href="recipes.html?category=${encodeURIComponent(cat.name)}"
         class="category-card ${cls} animate-fadeInUp"
         aria-label="Browse ${cat.name} recipes">
        <div class="category-card__icon">${cat.icon}</div>
        <span class="category-card__name">${cat.name}</span>
        <span class="category-card__count">${cat.count} recipes</span>
      </a>`;
  });

  $grid.html(html);
}

/* ─────────────────────────────────────────────────────────────
   FEATURED RECIPES RENDER
   ───────────────────────────────────────────────────────────── */
/**
 * Renders the 4 featured recipe cards using the shared
 * renderRecipeCard() helper from data.js.
 */
function renderFeaturedRecipes() {
  const $grid = $('#featured-grid');
  if (!$grid.length) return;

  const featured = getFeaturedRecipes();
  let html = '';

  featured.forEach(function (recipe) {
    html += renderRecipeCard(recipe);
  });

  $grid.html(html);
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED STATS COUNTER
   ───────────────────────────────────────────────────────────── */
/**
 * Animates the statistics numbers from 0 up to their target value
 * when the stats section scrolls into view.
 * Uses IntersectionObserver for efficient scroll detection.
 */
function initStatsCounter() {
  const $stats = $('#hero-stats');
  if (!$stats.length) return;

  const targets = {
    '#stat-recipes': 1200,
    '#stat-members': 850,
    '#stat-reviews': 4800,
    '#stat-cuisines': 25,
  };

  let animated = false;

  /**
   * Counts a single element from 0 to target.
   * @param {string} selector - Element ID selector
   * @param {number} target   - Final number to reach
   * @param {number} duration - Animation duration in ms
   */
  function countUp(selector, target, duration) {
    const $el    = $(selector);
    const start  = 0;
    const step   = target / (duration / 16); // ~60fps
    let current  = start;

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      $el.text(Math.floor(current).toLocaleString());
    }, 16);
  }

  function startAllCounters() {
    if (animated) return;
    animated = true;
    Object.entries(targets).forEach(function ([sel, val]) {
      countUp(sel, val, 1800);
    });
  }

  // Use IntersectionObserver if available, otherwise trigger immediately
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startAllCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe($stats[0]);
  } else {
    startAllCounters();
  }
}

/* ─────────────────────────────────────────────────────────────
   HERO SEARCH
   ───────────────────────────────────────────────────────────── */
/**
 * Handles the hero search bar:
 *  - On form submit or button click → redirects to recipes.html?q=...
 *  - Quick-tag clicks pre-fill the search and redirect
 */
function initHeroSearch() {
  // Form submit (Enter key or button click)
  $('#hero-search-form').on('submit', function (e) {
    e.preventDefault();
    redirectSearch();
  });

  $('#hero-search-btn').on('click', function () {
    redirectSearch();
  });

  // Quick tags
  $(document).on('click', '.hero__tag', function (e) {
    e.preventDefault();
    const query = $(this).data('query') || $(this).text().trim();
    $('#hero-search-input').val(query);
    redirectSearch();
  });
}

/**
 * Reads the hero search input and navigates to the recipes
 * listing page with the query as a URL parameter.
 */
function redirectSearch() {
  const query = $('#hero-search-input').val().trim();
  if (query) {
    window.location.href = 'recipes.html?q=' + encodeURIComponent(query);
  } else {
    window.location.href = 'recipes.html';
  }
}

/* ─────────────────────────────────────────────────────────────
   NEWSLETTER FORM
   ───────────────────────────────────────────────────────────── */
/**
 * Validates and handles the newsletter signup form.
 * Shows success/error feedback via toast notifications.
 */
function initNewsletterForm() {
  // Footer newsletter form
  $(document).on('submit', '.footer__newsletter-form', function (e) {
    e.preventDefault();
    const email = $(this).find('.footer__newsletter-input').val().trim();
    handleNewsletterSubmit(email, $(this));
  });

  // Strip newsletter form (mid-page CTA)
  $(document).on('submit', '#newsletter-strip-form', function (e) {
    e.preventDefault();
    const email = $('#newsletter-strip-email').val().trim();
    handleNewsletterSubmit(email, $(this));
  });

  // Subscribe button clicks
  $(document).on('click', '.footer__newsletter-btn, #newsletter-strip-btn', function () {
    $(this).closest('form').trigger('submit');
  });
}

/**
 * Handles a newsletter subscription request.
 * @param {string} email   - Email entered by user
 * @param {jQuery} $form   - The form element for reset
 */
function handleNewsletterSubmit(email, $form) {
  if (!email) {
    showToast('Please enter your email address.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  // Simulated async submit
  $form.find('button[type="submit"], .footer__newsletter-btn, #newsletter-strip-btn')
    .prop('disabled', true).text('Subscribing...');

  setTimeout(function () {
    showToast('🎉 You\'re subscribed! Welcome to RecipeHub.', 'success', 4000);
    $form[0].reset();
    $form.find('button').prop('disabled', false);

    // Restore button text
    $form.find('.footer__newsletter-btn').text('Subscribe');
    $form.find('#newsletter-strip-btn').text('Subscribe →');
  }, 1000);
}

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL ANIMATIONS
   ───────────────────────────────────────────────────────────── */
/**
 * Uses IntersectionObserver to add the 'animate-fadeInUp' class
 * to elements with the [data-reveal] attribute when they enter
 * the viewport. Provides staggered entrance for grid items.
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        $(entry.target).addClass('animate-fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe elements marked for reveal
  $('[data-reveal]').each(function () {
    // Remove animation class so it triggers fresh on scroll
    $(this).removeClass('animate-fadeInUp');
    observer.observe(this);
  });
}
