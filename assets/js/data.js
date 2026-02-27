/**
 * data.js — RecipeHub Mock Data Store
 * =====================================
 * Contains all sample recipe, category, and user data.
 * Simulates a database response for frontend rendering.
 * In a full-stack version, this data would come from a Flask API.
 */

/* ─── Categories ────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 1, name: "Breakfast", icon: "🍳", color: "#FFF3E0", count: 124 },
  { id: 2, name: "Lunch",     icon: "🥗", color: "#E8F5E9", count: 98  },
  { id: 3, name: "Dinner",    icon: "🍝", color: "#EDE7F6", count: 215 },
  { id: 4, name: "Dessert",   icon: "🧁", color: "#FCE4EC", count: 87  },
  { id: 5, name: "Vegan",     icon: "🥦", color: "#E0F2F1", count: 63  },
  { id: 6, name: "Drinks",    icon: "🍹", color: "#E3F2FD", count: 41  },
];

/* ─── Difficulty Badge Colors ───────────────────────────────── */
const DIFFICULTY_CONFIG = {
  "Beginner":     { class: "badge-success", icon: "fa-signal" },
  "Intermediate": { class: "badge-warning", icon: "fa-signal" },
  "Advanced":     { class: "badge-primary", icon: "fa-signal" },
};

/* ─── Sample Recipes ────────────────────────────────────────── */
const RECIPES = [
  {
    id: 1,
    title: "Dal Bhat Tarkari",
    slug: "dal-bhat-tarkari",
    description: "The heart of Nepali cuisine — lentil soup with steamed rice and seasonal vegetable curry. Comforting, nutritious, and deeply satisfying.",
    category: "Dinner",
    cuisine: "Nepali",
    difficulty: "Beginner",
    dietaryTags: ["Vegetarian", "Gluten-Free"],
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    calories: 380,
    rating: 4.8,
    reviewCount: 142,
    emoji: "🍛",
    author: { id: 1, name: "Ramesh Sharma",   initials: "RS" },
    featured: true,
    ingredients: [
      { section: "Dal",       name: "Red lentils",     qty: 200, unit: "g"    },
      { section: "Dal",       name: "Turmeric powder", qty: 0.5, unit: "tsp"  },
      { section: "Dal",       name: "Cumin seeds",     qty: 1,   unit: "tsp"  },
      { section: "Dal",       name: "Ghee",            qty: 2,   unit: "tbsp" },
      { section: "Tarkari",   name: "Potatoes",        qty: 2,   unit: "pcs"  },
      { section: "Tarkari",   name: "Cauliflower",     qty: 0.5, unit: "head" },
      { section: "Tarkari",   name: "Tomatoes",        qty: 2,   unit: "pcs"  },
      { section: "Tarkari",   name: "Garam masala",    qty: 1,   unit: "tsp"  },
    ],
    steps: [
      { num: 1, text: "Rinse lentils thoroughly under cold water. Soak for 15 minutes." },
      { num: 2, text: "In a pot, boil lentils with turmeric and salt until soft, about 25 minutes." },
      { num: 3, text: "Heat ghee in a pan. Add cumin seeds until they splutter, then pour over cooked dal." },
      { num: 4, text: "For tarkari, heat oil and fry onions until golden. Add spices and vegetables." },
      { num: 5, text: "Cook vegetables until tender. Serve hot with steamed basmati rice." },
    ],
    nutrition: { calories: 380, protein: "18g", fat: "8g", carbs: "62g", fiber: "12g" },
  },
  {
    id: 2,
    title: "Spaghetti Carbonara",
    slug: "spaghetti-carbonara",
    description: "A classic Roman pasta dish made with eggs, Pecorino Romano, guanciale, and black pepper. Silky, rich, and absolutely no cream involved.",
    category: "Dinner",
    cuisine: "Italian",
    difficulty: "Intermediate",
    dietaryTags: [],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    calories: 580,
    rating: 4.7,
    reviewCount: 218,
    emoji: "🍝",
    author: { id: 3, name: "Marco Rossi",     initials: "MR" },
    featured: true,
    ingredients: [
      { section: "Pasta",  name: "Spaghetti",        qty: 400, unit: "g"    },
      { section: "Pasta",  name: "Guanciale",        qty: 200, unit: "g"    },
      { section: "Sauce",  name: "Egg yolks",        qty: 4,   unit: "pcs"  },
      { section: "Sauce",  name: "Pecorino Romano",  qty: 100, unit: "g"    },
      { section: "Sauce",  name: "Black pepper",     qty: 1,   unit: "tsp"  },
      { section: "Sauce",  name: "Kosher salt",      qty: 1,   unit: "tsp"  },
    ],
    steps: [
      { num: 1, text: "Cook spaghetti in salted boiling water until al dente. Reserve 1 cup pasta water." },
      { num: 2, text: "Fry guanciale in a cold pan until crispy and fat is rendered." },
      { num: 3, text: "Whisk egg yolks with grated Pecorino Romano and cracked black pepper." },
      { num: 4, text: "Add hot pasta to the guanciale pan off the heat. Mix well." },
      { num: 5, text: "Add egg mixture and splash of pasta water. Toss vigorously to create a creamy sauce." },
    ],
    nutrition: { calories: 580, protein: "24g", fat: "22g", carbs: "68g", fiber: "3g" },
  },
  {
    id: 3,
    title: "Vegan Buddha Bowl",
    slug: "vegan-buddha-bowl",
    description: "A nourishing bowl packed with roasted sweet potato, chickpeas, quinoa, avocado, and a punchy tahini lemon dressing.",
    category: "Lunch",
    cuisine: "American",
    difficulty: "Beginner",
    dietaryTags: ["Vegan", "Gluten-Free"],
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    calories: 480,
    rating: 4.5,
    reviewCount: 97,
    emoji: "🥗",
    author: { id: 2, name: "Sita Poudel",     initials: "SP" },
    featured: true,
    ingredients: [
      { section: "Bowl",     name: "Quinoa",           qty: 180, unit: "g"    },
      { section: "Bowl",     name: "Sweet potato",     qty: 2,   unit: "pcs"  },
      { section: "Bowl",     name: "Chickpeas",        qty: 400, unit: "g"    },
      { section: "Bowl",     name: "Avocado",          qty: 1,   unit: "pcs"  },
      { section: "Bowl",     name: "Kale",             qty: 100, unit: "g"    },
      { section: "Dressing", name: "Tahini",           qty: 3,   unit: "tbsp" },
      { section: "Dressing", name: "Lemon juice",      qty: 2,   unit: "tbsp" },
      { section: "Dressing", name: "Garlic",           qty: 1,   unit: "clove"},
    ],
    steps: [
      { num: 1, text: "Preheat oven to 200°C. Cube sweet potato, toss with oil and paprika, roast 25 min." },
      { num: 2, text: "Drain and rinse chickpeas. Season and roast alongside potatoes for 20 minutes." },
      { num: 3, text: "Cook quinoa according to package instructions. Fluff with fork." },
      { num: 4, text: "Whisk tahini, lemon juice, garlic, and water into a smooth dressing." },
      { num: 5, text: "Assemble bowls: quinoa base, all toppings arranged, drizzle with dressing." },
    ],
    nutrition: { calories: 480, protein: "18g", fat: "16g", carbs: "68g", fiber: "14g" },
  },
  {
    id: 4,
    title: "Chicken Momo",
    slug: "chicken-momo",
    description: "Nepal's beloved street food — juicy steamed dumplings filled with seasoned minced chicken, served with a fiery tomato achaar.",
    category: "Dinner",
    cuisine: "Nepali",
    difficulty: "Advanced",
    dietaryTags: [],
    prepTime: 60,
    cookTime: 20,
    servings: 6,
    calories: 320,
    rating: 4.9,
    reviewCount: 304,
    emoji: "🥟",
    author: { id: 1, name: "Ramesh Sharma",   initials: "RS" },
    featured: true,
    ingredients: [
      { section: "Dough",   name: "All-purpose flour", qty: 300, unit: "g"   },
      { section: "Dough",   name: "Warm water",        qty: 150, unit: "ml"  },
      { section: "Filling", name: "Minced chicken",    qty: 500, unit: "g"   },
      { section: "Filling", name: "Cabbage",           qty: 100, unit: "g"   },
      { section: "Filling", name: "Spring onion",      qty: 4,   unit: "pcs" },
      { section: "Filling", name: "Ginger",            qty: 1,   unit: "tbsp"},
      { section: "Filling", name: "Soy sauce",         qty: 2,   unit: "tbsp"},
    ],
    steps: [
      { num: 1, text: "Mix flour with warm water and knead until smooth. Rest dough for 30 minutes." },
      { num: 2, text: "Combine chicken, cabbage, onion, ginger, soy sauce, and spices for filling." },
      { num: 3, text: "Roll dough thin and cut into circles. Place filling and pleat to seal." },
      { num: 4, text: "Steam momos in a greased steamer for 12–15 minutes until cooked through." },
      { num: 5, text: "Serve hot with tomato achaar dipping sauce." },
    ],
    nutrition: { calories: 320, protein: "22g", fat: "8g", carbs: "38g", fiber: "3g" },
  },
  {
    id: 5,
    title: "Chocolate Lava Cake",
    slug: "chocolate-lava-cake",
    description: "Decadent individual chocolate cakes with a warm, gooey molten center. Ready in under 30 minutes and guaranteed to impress.",
    category: "Dessert",
    cuisine: "French",
    difficulty: "Intermediate",
    dietaryTags: ["Vegetarian"],
    prepTime: 10,
    cookTime: 12,
    servings: 4,
    calories: 420,
    rating: 4.6,
    reviewCount: 163,
    emoji: "🍫",
    author: { id: 4, name: "Priya Thapa",     initials: "PT" },
    featured: false,
    ingredients: [
      { section: "Batter", name: "Dark chocolate (70%)", qty: 200, unit: "g"    },
      { section: "Batter", name: "Unsalted butter",      qty: 100, unit: "g"    },
      { section: "Batter", name: "Eggs",                 qty: 4,   unit: "pcs"  },
      { section: "Batter", name: "Caster sugar",         qty: 80,  unit: "g"    },
      { section: "Batter", name: "Plain flour",          qty: 40,  unit: "g"    },
      { section: "Batter", name: "Vanilla extract",      qty: 1,   unit: "tsp"  },
    ],
    steps: [],
    nutrition: { calories: 420, protein: "8g", fat: "24g", carbs: "46g", fiber: "4g" },
  },
  {
    id: 6,
    title: "Masala Chai",
    slug: "masala-chai",
    description: "Aromatic spiced milk tea with cardamom, ginger, cinnamon, and cloves. The soul of every Nepali morning.",
    category: "Drinks",
    cuisine: "Nepali",
    difficulty: "Beginner",
    dietaryTags: ["Vegetarian", "Gluten-Free"],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    calories: 120,
    rating: 4.7,
    reviewCount: 88,
    emoji: "☕",
    author: { id: 2, name: "Sita Poudel",     initials: "SP" },
    featured: false,
    ingredients: [],
    steps: [],
    nutrition: { calories: 120, protein: "4g", fat: "4g", carbs: "18g", fiber: "1g" },
  },
  {
    id: 7,
    title: "Avocado Toast",
    slug: "avocado-toast",
    description: "Creamy smashed avocado on toasted sourdough with chili flakes, lime, and a perfect runny poached egg on top.",
    category: "Breakfast",
    cuisine: "American",
    difficulty: "Beginner",
    dietaryTags: ["Vegetarian"],
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    calories: 340,
    rating: 4.3,
    reviewCount: 54,
    emoji: "🥑",
    author: { id: 3, name: "Marco Rossi",     initials: "MR" },
    featured: false,
    ingredients: [],
    steps: [],
    nutrition: { calories: 340, protein: "12g", fat: "18g", carbs: "32g", fiber: "8g" },
  },
  {
    id: 8,
    title: "Pad Thai",
    slug: "pad-thai",
    description: "Thailand's iconic stir-fried noodle dish with rice noodles, egg, tofu, bean sprouts, and a tangy tamarind sauce.",
    category: "Dinner",
    cuisine: "Thai",
    difficulty: "Intermediate",
    dietaryTags: ["Vegetarian"],
    prepTime: 20,
    cookTime: 15,
    servings: 3,
    calories: 520,
    rating: 4.5,
    reviewCount: 121,
    emoji: "🍜",
    author: { id: 4, name: "Priya Thapa",     initials: "PT" },
    featured: false,
    ingredients: [],
    steps: [],
    nutrition: { calories: 520, protein: "16g", fat: "12g", carbs: "84g", fiber: "4g" },
  },
];

/* ─── Mock Logged-in User ───────────────────────────────────── */
let CURRENT_USER = null; // null = not logged in

/**
 * Simulates logging in a user.
 * @param {string} name  - Display name
 * @param {string} email - Email address
 */
function simulateLogin(name, email) {
  CURRENT_USER = {
    id: 99,
    name,
    email,
    initials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    joinDate: "January 2025",
    recipesCount: 0,
    bookmarksCount: 0,
  };
  localStorage.setItem('rh_user', JSON.stringify(CURRENT_USER));
}

/**
 * Loads user from localStorage if previously logged in.
 */
function loadPersistedUser() {
  const stored = localStorage.getItem('rh_user');
  if (stored) {
    try { CURRENT_USER = JSON.parse(stored); } catch (e) { localStorage.removeItem('rh_user'); }
  }
}

/**
 * Logs the current user out and clears localStorage.
 */
function logoutUser() {
  CURRENT_USER = null;
  localStorage.removeItem('rh_user');
}

/* ─── Bookmarks (localStorage-backed) ──────────────────────── */

/**
 * Returns the Set of bookmarked recipe IDs for the current user.
 * @returns {Set<number>}
 */
function getBookmarks() {
  const raw = localStorage.getItem('rh_bookmarks');
  if (!raw) return new Set();
  try { return new Set(JSON.parse(raw)); } catch { return new Set(); }
}

/**
 * Toggles a recipe bookmark on/off.
 * @param {number} recipeId
 * @returns {boolean} - true if now bookmarked, false if removed
 */
function toggleBookmark(recipeId) {
  const bookmarks = getBookmarks();
  const id = Number(recipeId);
  if (bookmarks.has(id)) {
    bookmarks.delete(id);
  } else {
    bookmarks.add(id);
  }
  localStorage.setItem('rh_bookmarks', JSON.stringify([...bookmarks]));
  return bookmarks.has(id);
}

/**
 * Returns all bookmarked recipe objects.
 * @returns {Array}
 */
function getBookmarkedRecipes() {
  const ids = getBookmarks();
  return RECIPES.filter(r => ids.has(r.id));
}

/* ─── Helper: Get Recipes by Category ──────────────────────── */
function getRecipesByCategory(categoryName) {
  return RECIPES.filter(r => r.category === categoryName || r.dietaryTags.includes(categoryName));
}

/* ─── Helper: Get Featured Recipes ─────────────────────────── */
function getFeaturedRecipes() {
  return RECIPES.filter(r => r.featured);
}

/* ─── Helper: Format Time ───────────────────────────────────── */
function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ─── Helper: Render Star HTML ──────────────────────────────── */
function renderStars(rating, interactive = false) {
  const cls = interactive ? 'stars stars-interactive' : 'stars';
  let html = `<div class="${cls}" aria-label="Rating: ${rating} out of 5">`;
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rating) ? 'filled' : (i - 0.5 <= rating ? 'half' : '');
    html += `<i class="fa${filled === 'filled' ? 's' : filled === 'half' ? 's' : 'r'} fa-star star ${filled}" 
               data-value="${i}" aria-hidden="true"></i>`;
  }
  html += '</div>';
  return html;
}

/* ─── Helper: Render Recipe Card HTML ──────────────────────── */
function renderRecipeCard(recipe) {
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.has(recipe.id);
  const diffCfg = DIFFICULTY_CONFIG[recipe.difficulty] || DIFFICULTY_CONFIG["Beginner"];
  const totalTime = recipe.prepTime + recipe.cookTime;

  return `
    <article class="recipe-card animate-fadeInUp" data-id="${recipe.id}" data-category="${recipe.category}" 
             data-cuisine="${recipe.cuisine}" data-difficulty="${recipe.difficulty}" 
             data-time="${totalTime}">
      <div class="recipe-card__image">
        <div class="recipe-card__image-placeholder">
          <span style="font-size:4rem">${recipe.emoji}</span>
        </div>
        <button class="recipe-card__bookmark ${isBookmarked ? 'active' : ''}" 
                data-recipe-id="${recipe.id}" 
                aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark recipe'}"
                title="${isBookmarked ? 'Remove from saved' : 'Save recipe'}">
          <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
        </button>
        <div class="recipe-card__badge">
          <span class="badge ${diffCfg.class}">${recipe.difficulty}</span>
        </div>
      </div>
      <div class="recipe-card__body">
        <div class="recipe-card__meta">
          <span class="badge badge-muted">${recipe.cuisine}</span>
          ${recipe.dietaryTags.map(t => `<span class="badge badge-success" style="font-size:10px">${t}</span>`).join('')}
        </div>
        <h3 class="recipe-card__title">
          <a href="recipe.html?id=${recipe.id}">${recipe.title}</a>
        </h3>
        <p class="recipe-card__desc">${recipe.description}</p>
        <div class="recipe-card__footer">
          <div class="recipe-card__author">
            <div class="recipe-card__author-avatar">${recipe.author.initials}</div>
            <span>${recipe.author.name}</span>
          </div>
          <div class="recipe-card__stats">
            <span class="recipe-card__stat">
              <i class="fas fa-clock"></i> ${formatTime(totalTime)}
            </span>
            <span class="recipe-card__stat">
              <i class="fas fa-star" style="color:#F4AC30"></i> ${recipe.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </article>`;
}
