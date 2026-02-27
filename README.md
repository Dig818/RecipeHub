# 🍳 RecipeHub — Recipe Sharing Website

> A responsive, frontend-only recipe sharing platform built with **HTML5**, **CSS3**, **JavaScript**, and **jQuery**.  
> Developed for the BIT Web Technology assignment at **Texas College of Management & IT, Kathmandu**.

---

## 🌐 Live Demo

🔗 **[View Live Site](https://yourusername.github.io/recipehub)**  
*(Replace with your actual GitHub Pages URL after deployment)*

---

## 📸 Screenshots

| Home Page | Recipes Page | Recipe Detail |
|-----------|-------------|---------------|
| ![Home](docs/screenshots/01-home-desktop.png) | ![Recipes](docs/screenshots/03-recipes-desktop.png) | ![Detail](docs/screenshots/05-recipe-detail-top.png) |

| Submit Recipe | User Profile | Dark Mode |
|---|---|---|
| ![Submit](docs/screenshots/07-submit-step1.png) | ![Profile](docs/screenshots/10-profile-desktop.png) | ![Dark](docs/screenshots/13-dark-mode.png) |

---

## ✨ Features

- ✅ **5 fully interconnected pages** — Home, Recipes, Recipe Detail, Submit, Profile
- ✅ **Responsive design** — Mobile (320px), Tablet (768px), Desktop (1280px+)
- ✅ **Real-time search** with live filtering on the recipes page
- ✅ **Multi-filter system** — category, cuisine, diet, difficulty, cook time
- ✅ **Multi-step recipe submission form** with client-side validation
- ✅ **Interactive star rating** system on recipe detail page
- ✅ **Bookmark / save recipes** (persisted via localStorage)
- ✅ **Dark mode toggle** (preference saved in localStorage)
- ✅ **Login / Register modal** with full form validation
- ✅ **Animated stats counter** on homepage
- ✅ **Custom 404 page**
- ✅ **ARIA accessibility** labels and keyboard navigation

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| HTML5 | Living Standard | Semantic page structure |
| CSS3 | With Custom Properties | Styling, Flexbox, Grid, animations |
| JavaScript | ES6+ | DOM manipulation, validation, state |
| jQuery | 3.7.1 | DOM helpers, event delegation |
| Font Awesome | 6.4.0 | Icon system |
| Google Fonts | — | Playfair Display + DM Sans |

**No frameworks. No Bootstrap. No backend.**

---

## 📁 Project Structure

```
recipehub/
├── index.html                 ← Home Page
├── recipes.html               ← Recipe Listing
├── recipe.html                ← Recipe Detail
├── submit.html                ← Submit Recipe
├── profile.html               ← User Profile
├── 404.html                   ← Error Page
│
├── assets/
│   ├── css/
│   │   ├── style.css          ← Global variables, reset, utilities
│   │   ├── dark-mode.css      ← Dark theme overrides
│   │   ├── cards.css          ← Recipe card component
│   │   ├── filter.css         ← Filter panel & search bar
│   │   ├── form.css           ← Form inputs & validation styles
│   │   ├── navbar.css         ← Navigation bar
│   │   ├── footer.css         ← Footer
│   │   ├── home.css           ← Home page
│   │   ├── recipes.css        ← Recipes listing page
│   │   ├── recipe-detail.css  ← Recipe detail page
│   │   ├── submit.css         ← Submit form page
│   │   └── profile.css        ← Profile page
│   │
│   ├── js/
│   │   ├── utils.js           ← Shared utility functions
│   │   ├── data.js            ← Mock recipe data store
│   │   ├── auth.js            ← Authentication module
│   │   ├── main.js            ← Global initialisation
│   │   ├── home.js            ← Home page logic
│   │   ├── recipes.js         ← Filter, search, pagination
│   │   ├── recipe-detail.js   ← Rating, bookmark, reviews
│   │   ├── submit.js          ← Multi-step form logic
│   │   └── profile.js         ← Profile tabs & bookmarks
│   │
│   └── images/
│       └── placeholder.jpg
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Option 1 — Open directly in browser
```bash
# Clone the repository
git clone https://github.com/yourusername/recipehub.git

# Open in VS Code
code recipehub

# Right-click index.html → "Open with Live Server"
```

### Option 2 — Direct file open
Simply open `index.html` in any modern browser. No build step or server required.

> **Note:** For the best experience use VS Code with the Live Server extension to avoid MIME-type issues with local file paths.

---

## 📋 JavaScript Load Order

Every HTML page must load scripts in this exact order:
```html
<script src="assets/js/utils.js"></script>   <!-- 1. Utilities -->
<script src="assets/js/data.js"></script>    <!-- 2. Data store -->
<script src="assets/js/auth.js"></script>    <!-- 3. Auth module -->
<script src="assets/js/main.js"></script>    <!-- 4. Global init -->
<script src="assets/js/[page].js"></script>  <!-- 5. Page-specific -->
```

---

## 🧪 Browser Compatibility

| Browser | Version | Status |
|---|---|---|
| Google Chrome | 90+ | ✅ Fully tested |
| Mozilla Firefox | 88+ | ✅ Fully tested |
| Microsoft Edge | 90+ | ✅ Fully tested |
| Safari | 14+ | ✅ Tested |

---

## 📄 Assignment Details

- **Course:** Web Technology (BIT)
- **Institution:** Texas College of Management & IT, Kathmandu
- **Project Theme:** Recipe Sharing Website (#12)
- **Student:** ________________________
- **LCID:** ________________________

---

## 📝 License

This project is created for academic purposes only.  
© 2025 RecipeHub — Texas College of Management & IT
