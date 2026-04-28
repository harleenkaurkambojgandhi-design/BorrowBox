# Deployment Guide for BorrowBox

This guide explains how to deploy the BorrowBox application, which consists of a **React Frontend** and a **Node.js/Express Backend**.

We will deploy:
1.  **Backend** on **Render** (Free Web Service)
2.  **Frontend** on **Vercel** (Free Static Hosting)

---

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
2.  **Accounts**: Create free accounts on [Render.com](https://render.com) and [Vercel.com](https://vercel.com).

---

## Part 1: Deploying the Backend (Render)

1.  **Create a New Web Service**:
    *   Go to your Render Dashboard.
    *   Click **New +** and select **Web Service**.
    *   Connect your GitHub repository.

2.  **Configure the Service**:
    *   **Name**: `borrowbox-backend` (or similar)
    *   **Region**: Choose one close to you (e.g., Singapore, Frankfurt, Oregon).
    *   **Branch**: `main` (or your default branch).
    *   **Root Directory**: Leave empty (since `package.json` is in the root).
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start` (This runs `node server/index.js`)

3.  **Environment Variables**:
    *   Scroll down to the **Environment Variables** section and click **Add Environment Variable**.
    *   Add the following variables (copy values from your local `.env` file):
        *   `MONGO_URI`: Your MongoDB connection string.
        *   `JWT_SECRET`: Your secret key for JWT.
        *   `PORT`: `5000` (Render will automatically set a PORT, but good to have).

4.  **Deploy**:
    *   Click **Create Web Service**.
    *   Wait for the deployment to finish. You will see "Live" status.
    *   **Copy the Backend URL** (e.g., `https://borrowbox-backend.onrender.com`). You will need this for the frontend.

---

## Part 2: Deploying the Frontend (Vercel)

1.  **Create a New Project**:
    *   Go to your Vercel Dashboard.
    *   Click **Add New...** -> **Project**.
    *   Import your `BorrowBox` GitHub repository.

2.  **Configure the Project**:
    *   **Framework Preset**: Select **Vite** (it usually detects this automatically).
    *   **Root Directory**: `./` (Default)
    *   **Build Command**: `npm run build` (Default)
    *   **Output Directory**: `dist` (Default)

3.  **Environment Variables**:
    *   Expand the **Environment Variables** section.
    *   Add the following variables:
        *   `VITE_API_BASE_URL`: The URL of your deployed backend + `/api` (e.g., `https://borrowbox-backend.onrender.com/api`).
        *   `VITE_SOCKET_URL`: The URL of your deployed backend (e.g., `https://borrowbox-backend.onrender.com`).

4.  **Deploy**:
    *   Click **Deploy**.
    *   Wait for the build to complete. You will get a confetti screen!
    *   **Copy the Frontend URL** (e.g., `https://borrowbox.vercel.app`).

---

## Part 3: Final Configuration (CORS)

Now that you have the Frontend URL, you need to tell the Backend to allow requests from it.

1.  Go back to your **Render Dashboard**.
2.  Select your backend service.
3.  Go to **Environment Variables**.
4.  (Optional but recommended) If your code uses an environment variable for CORS origin (e.g., `CLIENT_URL`), set it now to your Vercel URL.
    *   *Note: In your current code, you have hardcoded `https://borrow-box-five.vercel.app`. If your new Vercel URL is different, you MUST update `server/index.js` or add an environment variable for it.*

**Update `server/index.js` (Recommended for flexibility):**

Verify your `server/index.js` allows the new Vercel domain.

```javascript
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            process.env.CLIENT_URL, // Add this env var in Render
            'https://your-new-vercel-app.vercel.app' // Or hardcode the new one
        ],
        credentials: true,
    })
);
```

If you modify the code, push the changes to GitHub. Render will automatically redeploy.

---

## Summary

1.  **Backend (Render)** is providing the API and Database connection.
2.  **Frontend (Vercel)** is serving the UI and talking to the Backend.
3.  They are connected via **Environment Variables** (`VITE_API_BASE_URL`).

**Troubleshooting:**
*   If API calls fail, check the **Network Tab** in Chrome DevTools to see if the URL is correct.
*   Check **CORS errors** in the console. If you see them, update the allowed origins in `server/index.js`.
