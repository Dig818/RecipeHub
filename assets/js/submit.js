/**
 * submit.js — RecipeHub Submit Recipe Page
 * ==========================================
 * Handles: multi-step form, ingredient/step row management,
 *          live preview, validation, form submission simulation.
 */

var submitStep    = 1;
var totalSteps    = 4;
var ingredientCount = 1;
var stepCount       = 1;

$(function () {
  if (!CURRENT_USER) { showLoginPrompt(); return; }
  initStepNav();
  initIngredientRows();
  initStepRows();
  initLivePreview();
  initImageUpload();
  initFormValidation();
});

/* ─── Auth Guard ─────────────────────────────────────────────── */
function showLoginPrompt() {
  $('#submit-form-wrap').html(
    '<div style="text-align:center;padding:var(--space-20) var(--space-8)">' +
    '<i class="fas fa-lock" style="font-size:3rem;color:var(--color-border);display:block;margin-bottom:var(--space-6)"></i>' +
    '<h2 style="margin-bottom:var(--space-3)">Login Required</h2>' +
    '<p style="color:var(--color-mid);max-width:360px;margin:0 auto var(--space-8)">You need to be logged in to share a recipe with the community.</p>' +
    '<button class="btn btn-primary btn-lg" data-open-modal="login"><i class="fas fa-sign-in-alt"></i> Login to Continue</button>' +
    '</div>'
  );
}

/* ─── Step Navigation ────────────────────────────────────────── */
function initStepNav() {
  updateStepUI();

  $(document).on('click', '.step-next-btn', function(){
    if (!validateCurrentStep()) return;
    if (submitStep < totalSteps) { submitStep++; updateStepUI(); }
  });

  $(document).on('click', '.step-prev-btn', function(){
    if (submitStep > 1) { submitStep--; updateStepUI(); }
  });

  $(document).on('click', '#submit-recipe-btn', function(){
    if (!validateCurrentStep()) return;
    submitRecipe();
  });
}

function updateStepUI() {
  // Show correct panel
  $('.submit-step-panel').removeClass('active');
  $('#step-' + submitStep).addClass('active');

  // Update progress indicator
  $('.step-progress__item').each(function(i){
    var n = i + 1;
    $(this).removeClass('active completed');
    if (n < submitStep)  $(this).addClass('completed');
    if (n === submitStep) $(this).addClass('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── Validation ─────────────────────────────────────────────── */
function validateCurrentStep() {
  var valid = true;
  if (submitStep === 1) {
    var title = $('#recipe-title').val().trim();
    var desc  = $('#recipe-desc').val().trim();
    if (!title || title.length < 3) { showToast('Please enter a recipe title (min 3 characters).', 'error'); valid = false; }
    else if (!desc || desc.length < 20) { showToast('Please write a description (min 20 characters).', 'error'); valid = false; }
  }
  if (submitStep === 2) {
    var hasIng = false;
    $('.ingredient-row .ing-name').each(function(){ if ($(this).val().trim()) hasIng = true; });
    if (!hasIng) { showToast('Please add at least one ingredient.', 'error'); valid = false; }
  }
  if (submitStep === 3) {
    var hasStep = false;
    $('.step-instruction').each(function(){ if ($(this).val().trim()) hasStep = true; });
    if (!hasStep) { showToast('Please add at least one step.', 'error'); valid = false; }
  }
  return valid;
}

/* ─── Ingredient Rows ────────────────────────────────────────── */
function initIngredientRows() {
  $(document).on('click', '#add-ingredient-btn', function(){
    ingredientCount++;
    var html = buildIngredientRow(ingredientCount);
    $('#ingredients-rows').append(html);
  });
  $(document).on('click', '.ing-remove-btn', function(){
    if ($('.ingredient-row').length > 1) $(this).closest('.ingredient-row').remove();
    else showToast('You need at least one ingredient.', 'error');
  });
}

function buildIngredientRow(n) {
  return '<div class="ingredient-row">' +
    '<div class="form-group" style="margin:0">' +
      '<input type="text" class="form-control ing-name" placeholder="Ingredient name e.g. Red lentils">' +
    '</div>' +
    '<div class="form-group" style="margin:0">' +
      '<input type="text" class="form-control ing-qty" placeholder="Qty e.g. 200">' +
    '</div>' +
    '<div class="form-group" style="margin:0">' +
      '<input type="text" class="form-control ing-unit" placeholder="Unit e.g. g">' +
    '</div>' +
    '<button type="button" class="ingredient-row__remove ing-remove-btn" aria-label="Remove ingredient">' +
      '<i class="fas fa-times"></i>' +
    '</button>' +
  '</div>';
}

/* ─── Step Rows ──────────────────────────────────────────────── */
function initStepRows() {
  $(document).on('click', '#add-step-btn', function(){
    stepCount++;
    var html = buildStepRow(stepCount);
    $('#steps-rows').append(html);
    renumberSteps();
  });
  $(document).on('click', '.step-remove-btn', function(){
    if ($('.step-row').length > 1) { $(this).closest('.step-row').remove(); renumberSteps(); }
    else showToast('You need at least one step.', 'error');
  });
}

function buildStepRow(n) {
  return '<div class="step-row">' +
    '<div class="step-row__number">' + n + '</div>' +
    '<div class="step-row__content form-group" style="margin:0">' +
      '<textarea class="form-control step-instruction" rows="2" placeholder="Describe this step in detail..."></textarea>' +
    '</div>' +
    '<button type="button" class="step-row__remove step-remove-btn" aria-label="Remove step">' +
      '<i class="fas fa-times"></i>' +
    '</button>' +
  '</div>';
}

function renumberSteps() {
  $('.step-row__number').each(function(i){ $(this).text(i + 1); });
}

/* ─── Live Preview ───────────────────────────────────────────── */
function initLivePreview() {
  $(document).on('input', '#recipe-title', function(){
    var val = $(this).val().trim();
    $('#preview-title').text(val || 'Your Recipe Title').toggleClass('placeholder', !val);
  });
  $(document).on('change', '#recipe-prep, #recipe-cook', function(){
    var prep = Number($('#recipe-prep').val()) || 0;
    var cook = Number($('#recipe-cook').val()) || 0;
    $('#preview-time').text(formatTime(prep + cook) || '—');
  });
  $(document).on('change', '#recipe-servings', function(){
    $('#preview-servings').text($(this).val() || '—');
  });
  $(document).on('change', '#recipe-calories', function(){
    $('#preview-calories').text($(this).val() || '—');
  });
}

/* ─── Image Upload ───────────────────────────────────────────── */
function initImageUpload() {
  $(document).on('click', '#image-upload-area', function(){
    $('#recipe-image-input').trigger('click');
  });
  $(document).on('change', '#recipe-image-input', function(){
    var file = this.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file.', 'error'); return; }
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#image-upload-area').hide();
      $('#preview-image-wrap').show().find('img').attr('src', e.target.result);
      $('#submit-preview-image').css({ background: 'none' }).find('span').hide();
      $('#submit-preview-image img').remove();
      $('#submit-preview-image').append('<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover">');
    };
    reader.readAsDataURL(file);
  });

  // Drag and drop
  var $area = $('#image-upload-area');
  $area.on('dragover', function(e){ e.preventDefault(); $(this).addClass('dragover'); });
  $area.on('dragleave', function(){ $(this).removeClass('dragover'); });
  $area.on('drop', function(e){
    e.preventDefault(); $(this).removeClass('dragover');
    var file = e.originalEvent.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      $('#recipe-image-input')[0].files = e.originalEvent.dataTransfer.files;
      $('#recipe-image-input').trigger('change');
    }
  });

  $(document).on('click', '.image-preview-wrap__remove', function(){
    $('#image-upload-area').show();
    $('#preview-image-wrap').hide().find('img').attr('src','');
    $('#recipe-image-input').val('');
  });
}

/* ─── Form Validation Helper ─────────────────────────────────── */
function initFormValidation() {
  $(document).on('blur', '#recipe-title', function(){
    var v = $(this).val().trim();
    if (!v || v.length < 3) { setError('#recipe-title', 'Title must be at least 3 characters.'); }
    else setSuccess('#recipe-title');
  });
  $(document).on('blur', '#recipe-desc', function(){
    var v = $(this).val().trim();
    if (!v || v.length < 20) { setError('#recipe-desc', 'Description must be at least 20 characters.'); }
    else setSuccess('#recipe-desc');
  });

  // Character counters
  $(document).on('input', '#recipe-title', function(){
    var len = $(this).val().length;
    $('#title-count').text(len + '/100').toggleClass('near-limit', len > 80).toggleClass('at-limit', len >= 100);
  });
  $(document).on('input', '#recipe-desc', function(){
    var len = $(this).val().length;
    $('#desc-count').text(len + '/500').toggleClass('near-limit', len > 400).toggleClass('at-limit', len >= 500);
  });
}

function setError(sel, msg) {
  $(sel).addClass('is-invalid').removeClass('is-valid');
  $(sel).siblings('.form-error').remove();
  $(sel).after('<div class="form-error"><i class="fas fa-exclamation-circle"></i> ' + escapeHtml(msg) + '</div>');
}
function setSuccess(sel) {
  $(sel).addClass('is-valid').removeClass('is-invalid');
  $(sel).siblings('.form-error').remove();
}

/* ─── Submit ─────────────────────────────────────────────────── */
function submitRecipe() {
  var $btn = $('#submit-recipe-btn');
  $btn.prop('disabled', true).html('<i class="fas fa-circle-notch fa-spin"></i> Publishing...');
  setTimeout(function(){
    $('#submit-form-wrap').hide();
    $('#submit-success').addClass('active');
    $btn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Publish Recipe');
    showToast('Your recipe has been published! 🎉', 'success', 5000);
  }, 1500);
}
