/**
 * recipes.js — RecipeHub Recipe Listing Page Logic
 * ==================================================
 * Handles: filter sidebar, live search, sort, pagination,
 *          URL param pre-fill, mobile filter drawer, active tags.
 */

/* ─── State ─────────────────────────────────────────────────── */
var state = {
  query:      '',
  category:   '',
  cuisine:    '',
  difficulty: '',
  diet:       '',
  maxTime:    180,
  sort:       'newest',
  page:       1,
  perPage:    9,
};

$(function () {
  readUrlParams();
  renderBanner();
  bindFilterEvents();
  bindSearchEvents();
  bindSortEvents();
  bindMobileFilter();
  renderRecipes();
});

/* ─── Read URL Params ────────────────────────────────────────── */
function readUrlParams() {
  state.query    = getParam('q')          || '';
  state.category = getParam('category')   || '';
  state.cuisine  = getParam('cuisine')    || '';

  if (state.query)    $('#recipes-search-input').val(state.query);
  if (state.category) $('[data-filter="category"][value="' + state.category + '"]').prop('checked', true);
  if (state.cuisine)  $('[data-filter="cuisine"][value="'  + state.cuisine  + '"]').prop('checked', true);
}

/* ─── Banner ─────────────────────────────────────────────────── */
function renderBanner() {
  if (!state.category) return;
  var cat = CATEGORIES.find(function(c){ return c.name === state.category; });
  if (!cat) return;
  $('#banner-active-cat').html(
    '<span>' + escapeHtml(cat.icon) + ' ' + escapeHtml(cat.name) + '</span>' +
    '<button id="clear-cat-btn" aria-label="Clear category filter"><i class="fas fa-times"></i></button>'
  ).show();
  $(document).on('click', '#clear-cat-btn', function(){
    state.category = '';
    state.page = 1;
    $('[data-filter="category"]').prop('checked', false);
    $('#banner-active-cat').hide();
    renderRecipes();
  });
}

/* ─── Filter Events ──────────────────────────────────────────── */
function bindFilterEvents() {
  $(document).on('change', '[data-filter]', function(){
    var key = $(this).data('filter');
    var val = $(this).val();
    if ($(this).is(':radio') || $(this).is(':checkbox')) {
      state[key] = $(this).is(':checked') ? val : '';
    }
    state.page = 1;
    renderRecipes();
    updateActiveFilterTags();
  });

  $(document).on('input', '#time-slider', function(){
    state.maxTime = Number($(this).val());
    $('#time-slider-value').text(state.maxTime >= 180 ? 'Any' : state.maxTime + ' min');
    state.page = 1;
    renderRecipes();
  });

  $(document).on('click', '#clear-all-filters', function(){
    state.query = state.category = state.cuisine = state.difficulty = state.diet = '';
    state.maxTime = 180;
    state.page = 1;
    $('[data-filter]').prop('checked', false);
    $('#recipes-search-input').val('');
    $('#time-slider').val(180);
    $('#time-slider-value').text('Any');
    updateActiveFilterTags();
    renderRecipes();
  });

  $(document).on('click', '.active-filter-tag', function(){
    var key = $(this).data('key');
    state[key] = '';
    $('[data-filter="' + key + '"]').prop('checked', false);
    state.page = 1;
    renderRecipes();
    updateActiveFilterTags();
  });

  $(document).on('click', '.filter-group__title', function(){
    $(this).toggleClass('collapsed');
    $(this).siblings('.filter-group__options').toggleClass('hidden');
  });
}

/* ─── Search Events ──────────────────────────────────────────── */
function bindSearchEvents() {
  var doSearch = debounce(function(){
    state.query = $('#recipes-search-input').val().trim();
    state.page  = 1;
    $('#search-clear-btn').toggleClass('visible', state.query.length > 0);
    renderRecipes();
  }, 350);

  $(document).on('input', '#recipes-search-input', doSearch);

  $(document).on('click', '#search-clear-btn', function(){
    $('#recipes-search-input').val('');
    state.query = '';
    state.page  = 1;
    $(this).removeClass('visible');
    renderRecipes();
  });
}

/* ─── Sort Events ────────────────────────────────────────────── */
function bindSortEvents() {
  $(document).on('change', '#sort-select', function(){
    state.sort = $(this).val();
    state.page = 1;
    renderRecipes();
  });
}

/* ─── Mobile Filter Drawer ───────────────────────────────────── */
function bindMobileFilter() {
  $(document).on('click', '#filter-mobile-btn', function(){
    $('#filter-sidebar').addClass('mobile-open open');
    $('#filter-overlay').addClass('active');
    $('body').css('overflow', 'hidden');
  });
  $(document).on('click', '#filter-overlay, #filter-close-btn', function(){
    $('#filter-sidebar').removeClass('open');
    $('#filter-overlay').removeClass('active');
    $('body').css('overflow', '');
    setTimeout(function(){ $('#filter-sidebar').removeClass('mobile-open'); }, 300);
  });
}

/* ─── Filter & Sort Logic ────────────────────────────────────── */
function getFilteredRecipes() {
  var q = state.query.toLowerCase();
  return RECIPES.filter(function(r){
    if (q && !(r.title.toLowerCase().includes(q) ||
               r.description.toLowerCase().includes(q) ||
               r.cuisine.toLowerCase().includes(q))) return false;
    if (state.category   && r.category   !== state.category)   return false;
    if (state.cuisine    && r.cuisine    !== state.cuisine)     return false;
    if (state.difficulty && r.difficulty !== state.difficulty)  return false;
    if (state.diet       && !r.dietaryTags.includes(state.diet)) return false;
    if ((r.prepTime + r.cookTime) > state.maxTime) return false;
    return true;
  });
}

function sortRecipes(list) {
  var sorted = list.slice();
  var sortFns = {
    newest:   function(a,b){ return b.id - a.id; },
    oldest:   function(a,b){ return a.id - b.id; },
    rating:   function(a,b){ return b.rating - a.rating; },
    quickest: function(a,b){ return (a.prepTime+a.cookTime) - (b.prepTime+b.cookTime); },
    popular:  function(a,b){ return b.reviewCount - a.reviewCount; },
  };
  return sorted.sort(sortFns[state.sort] || sortFns.newest);
}

/* ─── Render ─────────────────────────────────────────────────── */
function renderRecipes() {
  var filtered = sortRecipes(getFilteredRecipes());
  var total    = filtered.length;
  var start    = (state.page - 1) * state.perPage;
  var paged    = filtered.slice(start, start + state.perPage);
  var $grid    = $('#recipes-grid');

  // Results count
  $('#results-count').html('Showing <strong>' + paged.length + '</strong> of <strong>' + total + '</strong> recipes');

  // Cards
  if (paged.length === 0) {
    $grid.html(
      '<div class="no-results">' +
        '<i class="fas fa-search"></i>' +
        '<h3>No recipes found</h3>' +
        '<p>Try adjusting your filters or search term.</p>' +
        '<button class="btn btn-primary" id="clear-all-filters">Clear All Filters</button>' +
      '</div>'
    );
  } else {
    var html = '';
    paged.forEach(function(r){ html += renderRecipeCard(r); });
    $grid.html(html);
  }

  renderPagination(total);
}

/* ─── Pagination ─────────────────────────────────────────────── */
function renderPagination(total) {
  var pages = Math.ceil(total / state.perPage);
  var $p    = $('#pagination');
  if (pages <= 1) { $p.html(''); return; }

  var html = '';
  html += '<button class="pagination__btn" id="pg-prev" ' + (state.page === 1 ? 'disabled' : '') + '>' +
          '<i class="fas fa-chevron-left"></i></button>';

  for (var i = 1; i <= pages; i++) {
    if (pages > 7 && i > 2 && i < pages - 1 && Math.abs(i - state.page) > 1) {
      if (i === 3 || i === pages - 2) html += '<span class="pagination__dots">…</span>';
      continue;
    }
    html += '<button class="pagination__btn' + (i === state.page ? ' active' : '') +
            '" data-page="' + i + '">' + i + '</button>';
  }

  html += '<button class="pagination__btn" id="pg-next" ' + (state.page === pages ? 'disabled' : '') + '>' +
          '<i class="fas fa-chevron-right"></i></button>';
  $p.html(html);

  $p.off('click').on('click', '[data-page]', function(){
    state.page = Number($(this).data('page'));
    renderRecipes();
    scrollTo('#recipes-grid', 100);
  });
  $p.on('click', '#pg-prev', function(){ if (state.page > 1)    { state.page--; renderRecipes(); scrollTo('#recipes-grid', 100); } });
  $p.on('click', '#pg-next', function(){ if (state.page < pages) { state.page++; renderRecipes(); scrollTo('#recipes-grid', 100); } });
}

/* ─── Active Filter Tags ─────────────────────────────────────── */
function updateActiveFilterTags() {
  var $wrap = $('#active-filter-tags');
  var tags  = [];
  var labels = { category: 'Category', cuisine: 'Cuisine', difficulty: 'Difficulty', diet: 'Diet' };
  Object.keys(labels).forEach(function(key){
    if (state[key]) {
      tags.push('<button class="active-filter-tag" data-key="' + key + '">' +
                escapeHtml(state[key]) + ' <i class="fas fa-times"></i></button>');
    }
  });
  if (state.maxTime < 180) {
    tags.push('<button class="active-filter-tag" data-key="maxTime">Under ' + state.maxTime + 'min <i class="fas fa-times"></i></button>');
  }
  $wrap.html(tags.length ? '<span class="active-filters__label">Active:</span>' + tags.join('') : '');
}
