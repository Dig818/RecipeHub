/**
 * profile.js — RecipeHub User Profile Page
 * ===========================================
 * Handles: auth check, render profile info, tabs,
 *          recipe grid, bookmarks, edit profile form.
 */

$(function () {
  if (!CURRENT_USER) { showLoggedOutState(); return; }
  renderProfile();
  initTabs();
  renderMyRecipes();
  renderBookmarks();
  initEditForm();
});

/* ─── Logged Out State ───────────────────────────────────────── */
function showLoggedOutState() {
  $('#profile-content').hide();
  $('#profile-logged-out').show();
}

/* ─── Render Profile Header ──────────────────────────────────── */
function renderProfile() {
  var u = CURRENT_USER;
  $('#profile-initials').text(u.initials);
  $('#profile-name').text(u.name);
  $('#profile-email').html('<i class="fas fa-envelope"></i> ' + escapeHtml(u.email));
  $('#profile-join').html('<i class="fas fa-calendar"></i> Joined ' + escapeHtml(u.joinDate || 'Recently'));
  $('#profile-stat-recipes').text(RECIPES.filter(function(r){ return r.author && r.author.name === u.name; }).length || 0);
  $('#profile-stat-bookmarks').text(getBookmarks().size);
  $('#profile-stat-reviews').text(Math.floor(Math.random() * 8));
}

/* ─── Tabs ───────────────────────────────────────────────────── */
function initTabs() {
  $(document).on('click', '.profile-tab-btn', function(){
    var tab = $(this).data('tab');
    $('.profile-tab-btn').removeClass('active');
    $(this).addClass('active');
    $('.profile-panel').removeClass('active');
    $('#panel-' + tab).addClass('active');
  });
}

/* ─── My Recipes ─────────────────────────────────────────────── */
function renderMyRecipes() {
  var myRecipes = RECIPES.filter(function(r){
    return r.author && r.author.name === CURRENT_USER.name;
  });
  var $grid = $('#my-recipes-grid');
  if (!myRecipes.length) {
    $grid.html(
      '<div style="grid-column:1/-1;text-align:center;padding:var(--space-16)">' +
      '<i class="fas fa-utensils" style="font-size:3rem;color:var(--color-border);display:block;margin-bottom:var(--space-4)"></i>' +
      '<h3 style="margin-bottom:var(--space-3)">No recipes yet</h3>' +
      '<p style="color:var(--color-mid);margin-bottom:var(--space-6)">Share your first recipe with the community!</p>' +
      '<a href="submit.html" class="btn btn-primary"><i class="fas fa-plus"></i> Add Recipe</a>' +
      '</div>'
    );
    return;
  }
  var html = '';
  myRecipes.forEach(function(r){ html += renderRecipeCard(r); });
  $grid.html(html);
  $('#tab-count-recipes').text(myRecipes.length);
}

/* ─── Bookmarks ──────────────────────────────────────────────── */
function renderBookmarks() {
  var bookmarked = getBookmarkedRecipes();
  var $grid = $('#bookmarks-grid');
  $('#tab-count-bookmarks').text(bookmarked.length);

  if (!bookmarked.length) {
    $grid.html(
      '<div style="grid-column:1/-1;text-align:center;padding:var(--space-16)">' +
      '<i class="fas fa-bookmark" style="font-size:3rem;color:var(--color-border);display:block;margin-bottom:var(--space-4)"></i>' +
      '<h3 style="margin-bottom:var(--space-3)">No saved recipes</h3>' +
      '<p style="color:var(--color-mid);margin-bottom:var(--space-6)">Browse recipes and click the bookmark icon to save them here.</p>' +
      '<a href="recipes.html" class="btn btn-primary"><i class="fas fa-search"></i> Browse Recipes</a>' +
      '</div>'
    );
    return;
  }
  var html = '';
  bookmarked.forEach(function(r){ html += renderRecipeCard(r); });
  $grid.html(html);

  // Re-render when a bookmark is toggled from within this page
  $(document).on('click', '.recipe-card__bookmark', function(){
    setTimeout(function(){
      renderBookmarks();
      $('#profile-stat-bookmarks').text(getBookmarks().size);
    }, 500);
  });
}

/* ─── Edit Profile Form ──────────────────────────────────────── */
function initEditForm() {
  $('#edit-name').val(CURRENT_USER.name);
  $('#edit-email').val(CURRENT_USER.email);

  $(document).on('submit', '#edit-profile-form', function(e){
    e.preventDefault();
    var name  = $('#edit-name').val().trim();
    var email = $('#edit-email').val().trim();

    if (!name || name.length < 2)  { showToast('Name must be at least 2 characters.', 'error'); return; }
    if (!isValidEmail(email))       { showToast('Please enter a valid email address.', 'error'); return; }

    CURRENT_USER.name    = name;
    CURRENT_USER.email   = email;
    CURRENT_USER.initials = name.split(' ').map(function(w){ return w[0]; }).join('').toUpperCase().slice(0, 2);

    safeSet('rh_user', CURRENT_USER);
    renderProfile();
    updateAuthUI();
    showToast('Profile updated successfully! ✅', 'success');
  });
}

// Second logout button (inside edit form)
$(document).on('click', '#logout-btn-2', function(){
  handleLogout();
});
