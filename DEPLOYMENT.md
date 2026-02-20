# Deployment Guide

This guide covers how to deploy the frontend to Vercel and the backend to Render.

## 1. Deploy Frontend (Vercel)

1.  Push your code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com/) and sign in.
3.  Click "Add New..." -> "Project".
4.  Import your GitHub repository.
5.  Configure the build settings:
    -   **Root Directory**: Set this to `client` (important!).
    -   **Build Command**: `npm run build` (default).
    -   **Output Directory**: `dist` (default).
    -   **Install Command**: `npm install` (default).
6.  Click "Deploy".

**Configuration**:
Once deployed, you'll get a URL (e.g., `https://my-analyzer.vercel.app`).
You might need to update the API base URL in `client/src/services/api.js` to point to your deployed backend URL instead of `localhost:5000`. 
Alternatively, use environment variables:
- Add `VITE_API_URL` to Vercel Environment Variables.
- Update `client/src/services/api.js` to use `import.meta.env.VITE_API_URL`.

## 2. Deploy Backend (Render)

1.  Go to [Render](https://render.com/) and sign in.
2.  Click "New +" -> "Web Service".
3.  Connect your GitHub repository.
4.  Configure the service:
    -   **Root Directory**: Set this to `server` (important!).
    -   **Environment**: Node.
    -   **Build Command**: `npm install`.
    -   **Start Command**: `node index.js`.
5.  Add Environmental Variables:
    -   `GITHUB_TOKEN`: Your GitHub Personal Access Token (optional but recommended to avoid rate limits).
    -   `PORT`: `5000` (or leave default, Render sets PORT automatically).
6.  Click "Create Web Service".

**Note**: The free tier on Render spins down after inactivity, so the first request might be slow.

## connecting Frontend and Backend

1.  Get the URL of your deployed backend on Render (e.g., `https://my-api.onrender.com`).
2.  Update your frontend code or environment variables to point to this URL.
    -   If using environment variables, set `VITE_API_URL` in Vercel to `https://my-api.onrender.com/api/repo`.
3.  Ensure CORS is configured on the backend to allow requests from your frontend domain. Update `server/index.js`:
    ```javascript
    app.use(cors({
        origin: 'https://your-frontend-domain.vercel.app' 
    }));
    ```
