# 🍕 Portland Pizza Discovery

A curated, map-based pizza discovery app for Portland, Oregon. Find the best pizzerias by style—Neapolitan, New York, Detroit, and more—with opinionated recommendations from local pizza enthusiasts.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-blue) ![Supabase](https://img.shields.io/badge/Supabase-Postgres-green)

## ✨ Features

- **Interactive Map** — Browse pizzerias on a Leaflet-powered map
- **Filter by Style** — Neapolitan, New York, Sicilian, Detroit, Portland-style
- **Detailed Cards** — Hours, phone, website, directions for each spot
- **Curator Notes** — Opinionated recommendations, not just data
- **Mobile-First** — Optimized for on-the-go pizza hunting

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **State** | Zustand |
| **Maps** | Leaflet + react-leaflet |
| **Backend** | Supabase (Postgres + PostgREST) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (use `nvm use 20` if you have nvm)
- **npm** 10+
- **Supabase account** — [supabase.com](https://supabase.com) (free tier works)

### 1. Clone & Install

```bash
cd pizza-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema (see `Database Setup` below)
3. Get your API credentials from **Settings > API**

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🗄️ Database Setup

Run these SQL commands in your Supabase SQL Editor:

### Schema

```sql
-- Cities table
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  center_lat DECIMAL(10,7) NOT NULL,
  center_lng DECIMAL(10,7) NOT NULL,
  zoom_level INTEGER DEFAULT 12
);

-- Pizza styles table
CREATE TABLE pizza_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Pizzerias table
CREATE TABLE pizzerias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  phone TEXT,
  website TEXT,
  hours JSONB,
  description TEXT,
  image_url TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for pizzeria styles
CREATE TABLE pizzeria_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pizzeria_id UUID REFERENCES pizzerias(id) ON DELETE CASCADE,
  style_id UUID REFERENCES pizza_styles(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  UNIQUE(pizzeria_id, style_id)
);

-- Row Level Security (enable public read)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizza_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizzerias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizzeria_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read" ON pizza_styles FOR SELECT USING (true);
CREATE POLICY "Public read" ON pizzerias FOR SELECT USING (true);
CREATE POLICY "Public read" ON pizzeria_styles FOR SELECT USING (true);
```

### Seed Data

```sql
-- Insert Portland
INSERT INTO cities (name, slug, center_lat, center_lng, zoom_level)
VALUES ('Portland', 'portland', 45.5152, -122.6784, 12);

-- Insert pizza styles
INSERT INTO pizza_styles (name, slug, description) VALUES
('Neapolitan', 'neapolitan', 'Thin, soft center with charred leopard spots. Eaten with fork & knife. The original Italian style from Naples.'),
('New York', 'new-york', 'Large, foldable slices with crispy-chewy crust. The iconic American slice—grab and go.'),
('Sicilian', 'sicilian', 'Thick, spongy, rectangular. Focaccia-like crust with tomato sauce on top.'),
('Deep Dish/Detroit', 'deep-dish-detroit', 'Thick crust baked in a pan. Cheese goes to the edges and caramelizes. Hearty and filling.'),
('Portland-Style', 'portland-style', 'Creative, locally-sourced toppings. Often sourdough crust. The city''s own artisan spin.');
```

## 📁 Project Structure

```
pizza-app/
├── src/
│   ├── components/
│   │   ├── Filter/        # Style filter bar
│   │   ├── Map/           # Leaflet map + markers
│   │   ├── Pizzeria/      # Detail card
│   │   └── ui/            # Reusable UI (Icons, Tooltip)
│   ├── constants/         # App constants (colors, coords)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Supabase client
│   ├── stores/            # Zustand state management
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Helper functions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment template
├── package.json
└── vite.config.ts
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Check `docs/stories/` for available user stories
2. Pick an unassigned story
3. Create a feature branch
4. Submit a PR with your changes

## 📄 License

MIT — feel free to use this for your own city's pizza guide!

---

Built with 🍕 in Portland, OR
