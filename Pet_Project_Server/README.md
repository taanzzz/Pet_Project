# PawsHome — Pet Adoption Backend

The Express REST API server for the PawsHome Pet Adoption platform.

## 🛠️ Features Implemented

- **Database Schemas:** Optimized MongoDB models for `User`, `Pet`, and `AdoptionRequest` with automated indexes and timestamps.
- **RESTful Endpoints:**
  - `/api/pets`: Handles creation, deletion, details, updates, and filtered lookups utilizing `$regex` search queries and `$in` species matching.
  - `/api/requests`: Handles adoption applications, status updates (Approve/Reject), and request cancellation.
- **Secure Middleware:** Session verification handler (`verifySession`) checking cookies via Better-Auth and restricting resource updates to listing owners only.
- **Adoption Automation:** Approving a request updates the pet status to `adopted` and automatically marks all other overlapping pending requests as `rejected` to prevent double adoptions.

---

## ⚡ Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup environment variables (`.env`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   BETTER_AUTH_SECRET=your_better_auth_secret_key
   BETTER_AUTH_URL=http://localhost:5000
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```
