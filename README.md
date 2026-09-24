# SHHH Dont tell the teachers 🤫

Unblocked Minecraft web hub with custom iframe player, stealth tab cloaking, and panic switch.

## 🚀 How to Host on GitHub Pages (Fixes 404 / blank screen)

Vite is a modern frontend framework that compiles JSX and Tailwind before serving. When putting this repository on GitHub, use **GitHub Actions** so GitHub automatically compiles the site into the `dist/` folder and serves it:

### Method 1: Automatic GitHub Actions (Recommended - 1 minute)
1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, switch from *"Deploy from a branch"* to **GitHub Actions**.
4. That's it! GitHub will automatically trigger the included workflow (`.github/workflows/deploy.yml`) and give you your live URL (e.g. `https://<your-username>.github.io/<repo-name>/`).

### Method 2: Manual Build & Push
If you prefer deploying from a branch:
```bash
npm install
npm run build
```
Then deploy the contents of the `dist/` folder to your `gh-pages` branch.
