# PawsHome — Pet Adoption Frontend

The React frontend client for the PawsHome Pet Adoption platform.

## 🛠️ Features Implemented

- **Navbar & Navigation:** Public and Private route checks, responsive mobile drawer menu, and user session profile dropdown.
- **Dynamic Styling & Theming:** Custom dark/light mode toggle with theme state persistent across reloads.
- **Search, Filter & Sort:**
  - Real-time search query on pet name and breed.
  - Multi-species filtering chips.
  - Custom sort dropdown (Fee: Low-High, Fee: High-Low, Alphabetical Name).
- **Adoption Request Form:** Interactive modal validating pickup dates and attaching personalized messages.
- **User Dashboard:** Comprehensive control panel for listings, request status, listing edits, and quick creation form.

---

## ⚡ Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup environment variables (`.env`):
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Run the development build:
   ```bash
   npm run dev
   ```
