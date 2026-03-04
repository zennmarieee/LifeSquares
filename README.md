# LifeSquares

LifeSquares is a web-based life visualization app that represents a lifespan as a grid of weekly squares.
Each square equals one week, turning time into something tangible and reflective.

## What it does

- Accepts a birthdate (date picker + typed input support)
- Calculates weeks lived and weeks remaining from a 4,000-week model
- Displays a life grid with per-row labels:
	- Left: Age (starts at 0)
	- Right: Calendar year (based on selected birth year)
- Supports two grid modes:
	- Standard mode: lived vs remaining
	- Typical average life phases mode: color-coded phase ranges

## Typical phase color coding

When enabled, the grid can display a suggested phase model:

- Childhood (0–12)
- Teen & Early Adult (13–24)
- Working Years (25–64)
- Retirement & Later Life (65+)

Future weeks are shown as faded in this mode.

## Tech stack

- React
- Vite
- Tailwind CSS (via `@tailwindcss/vite`)

## Run locally

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build

```bash
npm run preview
```

## Project structure

```text
src/
	components/
		AppHeader.jsx
		BirthdateForm.jsx
		GridLegend.jsx
		LifeGrid.jsx
		LifeSummary.jsx
	pages/
		LifeSquaresPage.jsx
	utils/
		lifeMath.js
	App.jsx
	index.css
	main.jsx
```

## Notes

- Primary lifespan model uses `TOTAL_WEEKS = 4000`.
- Fonts used in UI:
	- Playfair Display (logo)
	- Quicksand (body text)
