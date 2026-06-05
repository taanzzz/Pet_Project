# PawsHome — Full-Stack Pet Adoption Platform

PawsHome is a modern, responsive full-stack Pet Adoption Platform built using the **MERN Stack** (MongoDB, Express, React, Node.js) paired with **Better-Auth** for secure session management and authentication.

This platform allows users to explore adoptable pets, submit adoption requests with custom messages, and manage their applications. Listing owners can add, edit, and delete their pet profiles, as well as manage incoming requests with real-time approval or rejection mechanics.

---

## 📂 Project Structure

The project is split into two primary components:

*   **`Pet_Project_Client`**: The frontend React application built with Vite and Tailwind CSS.
*   **`Pet_Project_Server`**: The backend Express REST API built with Mongoose and Node.js.

---

## 🛠️ Tech Stack & Key Libraries

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS & Custom CSS (Dynamic Dark Mode supported)
- **State & Routing:** React Router DOM v6, Context API
- **Auth Client:** Better-Auth React Client (`better-auth/react`)
- **Requests & Feedback:** Axios (HTTP client), React Hot Toast (Notifications)
- **Icons:** React Icons

### Backend
- **Framework:** Node.js & Express 5 (wildcard routing compatible)
- **Database:** MongoDB Atlas (via Mongoose ODM)
- **Auth Engine:** Better-Auth Server with MongoDB Adapter (`better-auth/db`)
- **Security & Headers:** CORS, Cookie Parser, Dotenv

---

## 🚀 Setup & Installation Instructions

### 1. Prerequisite Settings
Ensure you have Node.js and MongoDB installed locally, or have access to a MongoDB Atlas cluster URI.

### 2. Backend Configuration (`Pet_Project_Server`)
1. Navigate to the server folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the server directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   BETTER_AUTH_SECRET=any_long_random_string
   BETTER_AUTH_URL=http://localhost:5000 # Backend URL
   # OAuth Settings (optional, for Google Sign-In)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration (`Pet_Project_Client`)
1. Navigate to the client folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the client directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 📋 Features Overview

- **Dynamic Dark/Light Mode:** Toggle settings persist in `localStorage`.
- **Comprehensive Pet Listings:** Interactive Search, Filter (by Species), and Sorting (by Adoption Fee & Name).
- **Secure Authentication:** Email-based registration with strict password strength validation, plus Google Single Sign-On (SSO).
- **Adoption Request Lifecycle:** Live form submission, pickup validation, owner blocking logic, and automatic rejection of overlapping pending requests upon pet adoption approval.
- **Interactive Dashboard:** Complete owner workspace showing stats (Available vs. Adopted), CRUD operations, and request review modals.
