/**
 * recipe-detail.js — RecipeHub Single Recipe Page
 * ==================================================
 * Handles: load recipe from URL param, render all sections,
 *          ingredient checklist, servings adjuster, star rating,
 *          review submission, related recipes.
 */

var currentRecipe   = null;
var currentServings = 4;
var userRating      = 0;

$(function () {
  var id = Number(getParam('id'));
  currentRecipe = RECIPES.find(function(r){ return r.id === id; }) || RECIPES[0];
  if (!currentRecipe) { window.location.href = '404.html'; return; }

  currentServings = currentRecipe.servings || 4;
  renderHero();
  renderQuickStats();
  renderIngredients();
  renderStepsSection();
  renderNutrition();
  renderReviews();
  renderRelated();
  initServingsControl();
  initStarRating();
  initReviewForm();
  initIngredientChecklist();
  updateBookmarkBtn();
});

/* ─── Hero ─────────────────────────────────────────────────── */
function renderHero() {
  var r = currentRecipe;
  document.title = r.title + ' — RecipeHub';

  $('#hero-emoji').text(r.emoji);
  $('#hero-breadcrumb-cat').text(r.category).attr('href','recipes.html?category=' + encodeURIComponent(r.category));
  $('#hero-breadcrumb-title').text(r.title);
  $('#hero-title').text(r.title);
  $('#hero-desc').text(r.description);
  $('#hero-author-initials').text(r.author.initials);
  $('#hero-author-name').text(r.author.name);

  var diffCfg = { Beginner: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-primary' };
  var tags = '<span class="badge ' + (diffCfg[r.difficulty]||'badge-muted') + '">' + escapeHtml(r.difficulty) + '</span>';
  tags += '<span class="badge badge-muted">' + escapeHtml(r.cuisine) + '</span>';
  r.dietaryTags.forEach(function(t){ tags += '<span class="badge badge-success">' + escapeHtml(t) + '</span>'; });
  $('#hero-tags').html(tags);

  var stars = renderStars(r.rating);
  $('#hero-rating').html(stars + '<span class="rating-text">' + r.rating.toFixed(1) + ' (' + r.reviewCount + ' reviews)</span>');
}

/* ─── Quick Stats Bar ──────────────────────────────────────── */
function renderQuickStats() {
  var r = currentRecipe;
  $('#qs-prep').text(formatTime(r.prepTime));
  $('#qs-cook').text(formatTime(r.cookTime));
  $('#qs-total').text(formatTime(r.prepTime + r.cookTime));
  $('#qs-servings').text(currentServings);
  $('#qs-calories').text(r.calories);
  $('#qs-difficulty').text(r.difficulty);
}

/* ─── Ingredients ──────────────────────────────────────────── */
function renderIngredients() {
  var r = currentRecipe;
  if (!r.ingredients || !r.ingredients.length) {
    $('#ingredients-list').html('<p style="color:var(--color-muted);font-size:var(--text-sm)">No ingredients listed.</p>');
    return;
  }
  var sections = {};
  r.ingredients.forEach(function(ing){
    var sec = ing.section || 'Ingredients';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(ing);
  });
  var html = '';
  Object.keys(sections).forEach(function(sec){
    if (Object.keys(sections).length > 1) html += '<div class="ingredient-section-title">' + escapeHtml(sec) + '</div>';
    sections[sec].forEach(function(ing, idx){
      html += '<div class="ingredient-item" data-idx="' + idx + '">' +
        '<div class="ingredient-item__check"><i class="fas fa-check"></i></div>' +
        '<span class="ingredient-item__qty">' + escapeHtml(String(ing.qty)) + ' ' + escapeHtml(ing.unit||'') + '</span>' +
        '<span class="ingredient-item__name">' + escapeHtml(ing.name) + '</span>' +
        '</div>';
    });
  });
  $('#ingredients-list').html(html);
}

/* ─── Steps ────────────────────────────────────────────────── */
function renderStepsSection() {
  var r = currentRecipe;
  if (!r.steps || !r.steps.length) {
    $('#steps-list').html('<p style="color:var(--color-muted);font-size:var(--text-sm)">No steps listed yet.</p>');
    return;
  }
  var html = '';
  r.steps.forEach(function(step){
    html += '<div class="recipe-step">' +
      '<div class="recipe-step__num">' + step.num + '</div>' +
      '<div class="recipe-step__text">' + escapeHtml(step.text) +
      (step.tip ? '<div class="recipe-step__tip"><i class="fas fa-lightbulb"></i> <strong>Tip:</strong> ' + escapeHtml(step.tip) + '</div>' : '') +
      '</div></div>';
  });
  $('#steps-list').html(html);
}

/* ─── Nutrition ─────────────────────────────────────────────── */
function renderNutrition() {
  var n = currentRecipe.nutrition;
  if (!n) { $('#nutrition-panel').hide(); return; }
  var rows = [
    ['Calories',       n.calories + ' kcal'],
    ['Protein',        n.protein],
    ['Total Fat',      n.fat],
    ['Carbohydrates',  n.carbs],
    ['Fiber',          n.fiber],
  ];
  var html = '';
  rows.forEach(function(row){
    html += '<tr><td>' + row[0] + '</td><td>' + escapeHtml(String(row[1])) + '</td></tr>';
  });
  $('#nutrition-tbody').html(html);
}

/* ─── Mock Reviews ──────────────────────────────────────────── */
var MOCK_REVIEWS = [
  { name: 'Anita Gurung',    initials: 'AG', rating: 5, date: '2 days ago',   text: 'Absolutely delicious! Made this for a family dinner and everyone loved it. The spices were perfectly balanced.' },
  { name: 'Bikash Tamang',   initials: 'BT', rating: 4, date: '1 week ago',   text: 'Really good recipe. I adjusted the chili a bit for my kids but otherwise followed it exactly. Will make again!' },
  { name: 'Suman Shrestha',  initials: 'SS', rating: 5, date: '2 weeks ago',  text: 'This is now my go-to recipe. Simple ingredients, clear steps, and the result is incredible.' },
];

function renderReviews() {
  var html = '';
  MOCK_REVIEWS.forEach(function(rev){
    html += '<div class="review-card">' +
      '<div class="review-card__header">' +
        '<div class="review-card__author">' +
          '<div class="review-card__avatar">' + escapeHtml(rev.initials) + '</div>' +
          '<div><div class="review-card__name">' + escapeHtml(rev.name) + '</div>' +
          '<div class="review-card__date">' + escapeHtml(rev.date) + '</div></div>' +
        '</div>' +
        renderStars(rev.rating) +
      '</div>' +
      '<p class="review-card__text">' + escapeHtml(rev.text) + '</p>' +
    '</div>';
  });
  $('#reviews-list').html(html);
  $('#reviews-count').text(MOCK_REVIEWS.length + ' reviews');
}

/* ─── Related Recipes ───────────────────────────────────────── */
function renderRelated() {
  var related = RECIPES.filter(function(r){
    return r.id !== currentRecipe.id && r.category === currentRecipe.category;
  }).slice(0, 4);
  if (!related.length) { $('#related-section').hide(); return; }
  var html = '';
  related.forEach(function(r){ html += renderRecipeCard(r); });
  $('#related-grid').html(html);
}

/* ─── Servings Adjuster ─────────────────────────────────────── */
function initServingsControl() {
  $(document).on('click', '#servings-minus', function(){
    if (currentServings > 1) { currentServings--; updateServings(); }
  });
  $(document).on('click', '#servings-plus', function(){
    if (currentServings < 20) { currentServings++; updateServings(); }
  });
}
function updateServings() {
  $('#servings-count').text(currentServings);
  $('#qs-servings').text(currentServings);
}

/* ─── Interactive Star Rating ───────────────────────────────── */
function initStarRating() {
  $(document).on('mouseenter', '.leave-review__stars .star', function(){
    var val = Number($(this).data('value'));
    $(this).closest('.stars').find('.star').each(function(){
      $(this).toggleClass('hovered filled', Number($(this).data('value')) <= val);
      $(this).toggleClass('far', Number($(this).data('value')) > val);
      $(this).toggleClass('fas', Number($(this).data('value')) <= val);
    });
  });
  $(document).on('mouseleave', '.leave-review__stars', function(){
    $(this).find('.star').each(function(){
      var v = Number($(this).data('value'));
      $(this).removeClass('hovered');
      $(this).toggleClass('filled fas', v <= userRating);
      $(this).toggleClass('far', v > userRating);
    });
  });
  $(document).on('click', '.leave-review__stars .star', function(){
    userRating = Number($(this).data('value'));
    $(this).closest('.stars').find('.star').each(function(){
      var v = Number($(this).data('value'));
      $(this).toggleClass('filled fas', v <= userRating);
      $(this).toggleClass('far', v > userRating);
    });
    $('#rating-value').text(userRating + '/5 stars selected');
  });

  // Render interactive stars
  var html = '<div class="stars stars-interactive" aria-label="Select your rating">';
  for (var i = 1; i <= 5; i++) {
    html += '<i class="far fa-star star" data-value="' + i + '" aria-hidden="true"></i>';
  }
  html += '</div>';
  $('#review-stars-wrap').html(html);
}

/* ─── Review Form ───────────────────────────────────────────── */
function initReviewForm() {
  $(document).on('submit', '#review-form', function(e){
    e.preventDefault();
    if (!CURRENT_USER) { showToast('Please log in to leave a review.', 'info'); openAuthModal('login'); return; }
    if (!userRating)   { showToast('Please select a star rating.', 'error'); return; }
    var text = $('#review-text').val().trim();
    if (!text || text.length < 10) { showToast('Please write at least 10 characters.', 'error'); return; }

    var newReview = {
      name: CURRENT_USER.name, initials: CURRENT_USER.initials,
      rating: userRating, date: 'Just now', text: text
    };
    MOCK_REVIEWS.unshift(newReview);
    renderReviews();
    $('#review-form')[0].reset();
    userRating = 0;
    $('#review-stars-wrap .star').removeClass('filled hovered').addClass('far').removeClass('fas');
    $('#rating-value').text('');
    showToast('Review submitted! Thank you 🌟', 'success');
  });
}

/* ─── Ingredient Checklist ──────────────────────────────────── */
function initIngredientChecklist() {
  $(document).on('click', '.ingredient-item', function(){
    $(this).toggleClass('checked');
  });
}

/* ─── Bookmark Button State ─────────────────────────────────── */
function updateBookmarkBtn() {
  if (!currentRecipe) return;
  var saved = getBookmarks().has(currentRecipe.id);
  $('#detail-bookmark-btn')
    .toggleClass('active', saved)
    .find('i').attr('class', saved ? 'fas fa-bookmark' : 'far fa-bookmark');
  $('#detail-bookmark-btn').find('span').text(saved ? 'Saved' : 'Save Recipe');
}

$(document).on('click', '#detail-bookmark-btn', function(){
  if (!CURRENT_USER) { showToast('Please log in to save recipes.', 'info'); openAuthModal('login'); return; }
  if (!currentRecipe) return;
  var isNow = toggleBookmark(currentRecipe.id);
  $(this).toggleClass('active', isNow);
  $(this).find('i').attr('class', isNow ? 'fas fa-bookmark' : 'far fa-bookmark');
  $(this).find('span').text(isNow ? 'Saved' : 'Save Recipe');
  showToast(isNow ? 'Saved to bookmarks! 🔖' : 'Removed from bookmarks.', isNow ? 'success' : 'info');
});
