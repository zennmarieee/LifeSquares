# LifeSquares

LifeSquares is a web-based life visualization and reflection app that represents your entire lifespan as a grid of weekly squares. Each square equals one week — turning abstract time into something you can see, feel, and write about.

---

## Features

### 🟦 Interactive Life Grid
Visualize every week of your life as a square. Hover for tooltips, navigate with your keyboard, and see your past and future at a glance.

### 📅 Birthdate Input & Validation
Enter your birthdate via a date picker or typed input. LifeSquares computes your weeks lived and weeks remaining automatically.

### ⏳ Lifespan Selector
Adjust your assumed lifespan (default: 4,000 weeks / ~76.9 years) to explore different projections and see how the numbers shift.

### 🎨 Life Phase Color Coding
Toggle a suggested life phase model that colors the grid by heuristic age ranges:

| Phase | Age Range |
|---|---|
| Childhood | 0–12 |
| Teen & Early Adult | 13–24 |
| Working Years | 25–64 |
| Retirement & Later Life | 65+ |

Future weeks are shown as faded in this mode.

### 📓 Week Journal
Click any week square to open a journal panel and add a short note or reflection for that specific week. Your entries are saved locally in the browser.

### 📊 Life Summary & Stats
At-a-glance metrics: weeks lived, weeks remaining, and percentage of life elapsed — grounding the visual in real numbers.

### 🗺️ Grid Legend
A clear legend explains what each color and state means, with onboarding copy to orient new visitors.


### 🌗 Light / Dark Theme
Full light and dark mode support with preference persistence across sessions.

### 💾 Local Persistence
Your birthdate, lifespan setting, journal entries, and theme preference are all saved in-browser — no account required.

### ♿ Responsive & Accessible UI
Tailwind-based responsive layout with keyboard-navigable grid cells and ARIA attributes throughout.

---

## Tech Stack

- **React** — component-based UI
- **Vite** — fast dev and build tooling
- **Tailwind CSS** — utility-first styling via `@tailwindcss/vite`

---

## Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```text
src/
  components/
    AppHeader.jsx
    BirthdateForm.jsx
    GridLegend.jsx
    LifeGrid.jsx
    LifeSummary.jsx
    LifespanSelector.jsx
    WeekJournalPanel.jsx
  pages/
    LifeSquaresPage.jsx
    BlogPage.jsx
  utils/
    lifeMath.js
    storage.js
  App.jsx
  index.css
  main.jsx
```

---

## Notes

- Default lifespan model: `TOTAL_WEEKS = 4000` (~76.9 years)
- Fonts: **Playfair Display** (logo), **Quicksand** (body)
- All data is stored client-side — no backend, no accounts

---

## Live Demo

🔗 [lifesquares.vercel.app](https://lifesquares.vercel.app)