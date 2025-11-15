# 🚀 Deploy AI Finance Tracker to GitHub Pages

## Steps to Deploy:

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `AI-Finance_tracker`
3. Make it **Public**
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

### 2. Push Code to GitHub

Run these commands in your terminal:

```powershell
# Add your GitHub repository as remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/AI-Finance_tracker.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to GitHub Pages

Option A: **Automatic Deployment (Recommended)**
```powershell
npm run deploy
```

Option B: **Manual Deployment**
```powershell
# Build the app
ng build --configuration production --base-href /AI-Finance_tracker/

# Deploy to gh-pages branch
npx angular-cli-ghpages --dir=dist/ai-finance-tracker/browser
```

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select branch: `gh-pages`
4. Click **Save**

### 5. Access Your App

Your app will be live at:
```
https://YOUR_USERNAME.github.io/AI-Finance_tracker/
```

⏱️ It may take 2-5 minutes for the first deployment to be live.

---

## 📝 Future Updates

To update your deployed app:

```powershell
# 1. Make your changes to the code

# 2. Commit changes
git add .
git commit -m "Your update message"
git push

# 3. Deploy updated version
npm run deploy
```

---

## 🔧 Troubleshooting

### Issue: "gh-pages branch not found"
- Just run `npm run deploy` again, it will create the branch automatically

### Issue: "403 Permission denied"
- Make sure you're logged into the correct GitHub account
- Check if you have push access to the repository

### Issue: "404 Page not found"
- Wait 2-5 minutes after deployment
- Check that GitHub Pages is enabled in repository settings
- Verify the gh-pages branch exists

---

## ✨ Your App Features

✅ Budget tracking with AI insights  
✅ Expense management  
✅ AI-powered spending pattern analysis  
✅ Monthly predictions  
✅ Interactive chatbot  
✅ Futuristic UI with animations  
✅ Dark theme with holographic effects  
✅ Indian Rupee (₹) support
