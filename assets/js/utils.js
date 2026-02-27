/**
 * utils.js — RecipeHub Shared Utility Functions
 * ================================================
 * A collection of pure helper functions used across
 * multiple pages. No side effects or DOM dependencies.
 * Import this BEFORE any page-specific scripts.
 *
 * Contents:
 *  - String helpers       (truncate, slugify, capitalize)
 *  - Validation helpers   (isValidEmail, isValidUrl, isEmpty)
 *  - Date/time helpers    (formatDate, timeAgo, formatTime)
 *  - Number helpers       (formatNumber, clamp, randomBetween)
 *  - DOM helpers          (debounce, throttle, getParam)
 *  - Storage helpers      (safeGet, safeSet, safeRemove)
 */

/* ─────────────────────────────────────────────────────────────
   STRING HELPERS
   ───────────────────────────────────────────────────────────── */

/**
 * Truncates a string to a max length and appends ellipsis.
 * @param {string} str    - Input string
 * @param {number} maxLen - Maximum character length (default: 100)
 * @returns {string}
 *
 * @example
 * truncate("A very long recipe description...", 30)
 * // → "A very long recipe descriptio..."
 */
function truncate(str, maxLen = 100) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

/**
 * Converts a string into a URL-friendly slug.
 * @param {string} str
 * @returns {string}
 *
 * @example
 * slugify("Dal Bhat Tarkari!") // → "dal-bhat-tarkari"
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalizes the first letter of each word.
 * @param {string} str
 * @returns {string}
 *
 * @example
 * titleCase("dal bhat") // → "Dal Bhat"
 */
function titleCase(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Escapes HTML special characters to prevent XSS.
 * Use when inserting user-generated content into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/* ─────────────────────────────────────────────────────────────
   VALIDATION HELPERS
   ───────────────────────────────────────────────────────────── */

/**
 * Validates an email address format using RFC 5322-ish regex.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());
}

/**
 * Validates a URL format (http or https).
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Checks whether a value is empty (null, undefined, empty string,
 * empty array, or whitespace-only string).
 * @param {*} value
 * @returns {boolean}
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Validates password strength.
 * Rules: min 8 chars, one uppercase, one number.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  return { valid: true, message: '' };
}

/* ─────────────────────────────────────────────────────────────
   DATE & TIME HELPERS
   ───────────────────────────────────────────────────────────── */

/**
 * Formats a Date object or date string into a readable format.
 * @param {Date|string} date
 * @param {string} [locale] - BCP 47 locale tag (default: 'en-US')
 * @returns {string} e.g. "January 15, 2025"
 */
function formatDate(date, locale = 'en-US') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/**
 * Returns a relative time string (e.g. "3 days ago").
 * @param {Date|string|number} date
 * @returns {string}
 *
 * @example
 * timeAgo(new Date(Date.now() - 3 * 86400000)) // → "3 days ago"
 */
function timeAgo(date) {
  const now    = Date.now();
  const then   = new Date(date).getTime();
  const diff   = Math.floor((now - then) / 1000); // seconds

  if (diff < 60)           return 'just now';
  if (diff < 3600)         return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`;
  if (diff < 86400)        return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? 's' : ''} ago`;
  if (diff < 604800)       return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? 's' : ''} ago`;
  if (diff < 2592000)      return `${Math.floor(diff / 604800)} week${Math.floor(diff / 604800) !== 1 ? 's' : ''} ago`;
  if (diff < 31536000)     return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) !== 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) !== 1 ? 's' : ''} ago`;
}

/**
 * Converts minutes into a human-readable time string.
 * @param {number} minutes
 * @returns {string}
 *
 * @example
 * formatTime(90)  // → "1h 30m"
 * formatTime(45)  // → "45m"
 * formatTime(120) // → "2h"
 */
function formatTime(minutes) {
  if (!minutes || minutes <= 0) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ─────────────────────────────────────────────────────────────
   NUMBER HELPERS
   ───────────────────────────────────────────────────────────── */

/**
 * Formats a number with locale-aware separators.
 * @param {number} num
 * @returns {string} e.g. 1200 → "1,200"
 */
function formatNumber(num) {
  return Number(num).toLocaleString('en-US');
}

/**
 * Clamps a number between min and max values.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Rounds a number to a given number of decimal places.
 * @param {number} num
 * @param {number} [decimals=1]
 * @returns {number}
 */
function roundTo(num, decimals = 1) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/* ─────────────────────────────────────────────────────────────
   DOM / EVENT HELPERS
   ───────────────────────────────────────────────────────────── */

/**
 * Debounce — delays a function call until after the user stops
 * triggering events (e.g. live search input).
 * @param {Function} fn      - Function to debounce
 * @param {number}   delay   - Delay in milliseconds (default: 300)
 * @returns {Function}
 *
 * @example
 * $('#search').on('input', debounce(doSearch, 400));
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle — limits how often a function can fire
 * (e.g. scroll or resize handlers).
 * @param {Function} fn       - Function to throttle
 * @param {number}   interval - Minimum ms between calls (default: 200)
 * @returns {Function}
 */
function throttle(fn, interval = 200) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Reads a URL query parameter by name.
 * @param {string} name - Parameter key
 * @param {string} [url] - URL to parse (defaults to window.location.href)
 * @returns {string|null}
 *
 * @example
 * // URL: recipes.html?q=pasta&category=Dinner
 * getParam('q')        // → "pasta"
 * getParam('category') // → "Dinner"
 * getParam('missing')  // → null
 */
function getParam(name, url = window.location.href) {
  const urlObj = new URL(url, window.location.origin);
  return urlObj.searchParams.get(name);
}

/**
 * Sets or updates a URL query parameter without reloading the page.
 * @param {string} key   - Parameter key
 * @param {string} value - Parameter value
 */
function setParam(key, value) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.replaceState({}, '', url.toString());
}

/**
 * Smooth scrolls to a target element with an offset for the navbar.
 * @param {string|HTMLElement} target  - CSS selector or DOM element
 * @param {number} [offset]            - Pixel offset from top (default: navbar height)
 */
function scrollTo(target, offset) {
  const navbarHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
  ) || 72;

  const $el = typeof target === 'string' ? $(target) : $(target);
  if (!$el.length) return;

  const top = $el.offset().top - (offset !== undefined ? offset : navbarHeight + 16);
  $('html, body').animate({ scrollTop: top }, 500, 'swing');
}

/* ─────────────────────────────────────────────────────────────
   LOCALSTORAGE HELPERS
   ───────────────────────────────────────────────────────────── */

/**
 * Safely retrieves a JSON-parsed value from localStorage.
 * Returns null if key doesn't exist or JSON is invalid.
 * @param {string} key
 * @returns {*|null}
 */
function safeGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn(`[RecipeHub] safeGet failed for key "${key}":`, e);
    return null;
  }
}

/**
 * Safely JSON-stringifies and stores a value in localStorage.
 * Returns true on success, false on failure (e.g. storage full).
 * @param {string} key
 * @param {*}      value
 * @returns {boolean}
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[RecipeHub] safeSet failed for key "${key}":`, e);
    return false;
  }
}

/**
 * Safely removes a key from localStorage.
 * @param {string} key
 */
function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`[RecipeHub] safeRemove failed for key "${key}":`, e);
  }
}

/* ─────────────────────────────────────────────────────────────
   STAR RATING RENDERER
   ───────────────────────────────────────────────────────────── */

/**
 * Generates the HTML string for a star rating display.
 * Supports full stars, half stars, and empty stars.
 * @param {number}  rating      - Rating value (0–5, supports decimals)
 * @param {boolean} interactive - If true, adds cursor pointer class
 * @returns {string} HTML string
 *
 * @example
 * renderStars(4.5)          // Returns 4 full + 1 half + 0 empty stars
 * renderStars(3, true)      // Returns interactive stars for rating input
 */
function renderStars(rating, interactive = false) {
  const cls = interactive ? 'stars stars-interactive' : 'stars';
  let html  = `<div class="${cls}" aria-label="Rating: ${rating} out of 5">`;

  for (let i = 1; i <= 5; i++) {
    let starClass = '';
    if (i <= Math.floor(rating)) {
      starClass = 'filled';
    } else if (i - 0.5 <= rating) {
      starClass = 'half';
    }

    const iconClass = starClass ? 'fas' : 'far'; // solid vs outline
    html += `<i class="${iconClass} fa-star star ${starClass}"
               data-value="${i}"
               aria-hidden="true"></i>`;
  }

  html += `</div>`;
  return html;
}
