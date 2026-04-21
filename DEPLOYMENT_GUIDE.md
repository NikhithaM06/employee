# 🚀 Deployment Guide: EMS Application

Follow these steps to deploy your application so everyone can see the same output using a public link.

---

## 🏗️ Phase 1: Push Code to GitHub

If you haven't already pushed your code to GitHub, follow these commands in your root folder:

```powershell
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## 🔙 Phase 2: Deploy Backend (Render)

1.  **Go to [Render.com](https://render.com)** and create an account.
2.  Click **"New +"** and select **"Web Service"**.
3.  Connect your GitHub repository.
4.  **Configure the Service**:
    - **Name**: `ems-backend`
    - **Root Directory**: `ems-backend`
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
5.  **Environment Variables** (Click "Advanced"):
    - `MONGO_URI`: `mongodb://n97116378_db_user:VKvqKIbiCcygg8UC@ac-mmnxaa2-shard-00-00.zsjakvr.mongodb.net:27017,ac-mmnxaa2-shard-00-01.zsjakvr.mongodb.net:27017,ac-mmnxaa2-shard-00-02.zsjakvr.mongodb.net:27017/ems?ssl=true&replicaSet=atlas-r87dbk-shard-0&authSource=admin`
    - `PORT`: `10000`
6.  Click **"Create Web Service"**.
7.  **Wait for deployment** to finish. Once done, copy the URL (e.g., `https://ems-backend.onrender.com`).

---

## 🎨 Phase 3: Deploy Frontend (Vercel)

1.  **Go to [Vercel.com](https://vercel.com)** and create an account using GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Configure the Project**:
    - **Root Directory**: Leave it as the root (`.`) or set to `ems-frontend` if you import it specifically. 
    - **Framework Preset**: `Create React App`
5.  **Environment Variables**:
    - `REACT_APP_API_URL`: Your Render URL (e.g., `https://ems-backend-5r5w.onrender.com`)
    - `CI`: `false`
6.  **Rewrite Fallback**: I have configured a `vercel.json` at the root that automatically handles the `/api` routing. This means you don't need to change any URLs in your code!
7.  Click **"Deploy"**.
7.  Once finished, you will get a public link (e.g., `https://ems-frontend.vercel.app`).

---

## ✅ Final Verification

Once both are deployed:
1.  Open your Vercel URL.
2.  Try logging in or adding an employee.
3.  **Everyone with the link** will now see the same data because they are all connecting to the same MongoDB Atlas database!

> [!TIP]
> If you see a "Mixed Content" error, ensure your `REACT_APP_API_URL` starts with `https://`.
