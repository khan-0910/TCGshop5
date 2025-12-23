# Complete GitHub Setup & Update Guide

## ✅ Git Repository Initialized!

Your `pokemon-cards-store` folder is now a Git repository.

---

## 🚀 Step-by-Step: Push to GitHub

### Step 1: Add Your GitHub Repository

First, you need to connect your local folder to your GitHub repository.

**Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub details:**

```powershell
cd C:\Users\khana\Desktop\pokemon-cards-store
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

**Example:**
```powershell
git remote add origin https://github.com/khan-0910/pokemon-cards-store.git
```

---

### Step 2: Add All Files

```powershell
cd C:\Users\khana\Desktop\pokemon-cards-store
git add .
```

This adds ALL files in your project.

---

### Step 3: Commit Your Changes

```powershell
git commit -m "Fix: Complete cart, checkout, and order management system"
```

---

### Step 4: Set Main Branch

```powershell
git branch -M main
```

---

### Step 5: Push to GitHub

```powershell
git push -u origin main
```

**Note:** You may be asked to login to GitHub. Use your GitHub username and password (or personal access token).

---

## 📋 Complete Command Sequence (Copy & Paste)

**Open PowerShell or Command Prompt and paste these ONE AT A TIME:**

```powershell
# Navigate to project
cd C:\Users\khana\Desktop\pokemon-cards-store

# Add GitHub repository (REPLACE WITH YOUR REPO URL!)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Add all files
git add .

# Commit changes
git commit -m "Fix: Complete cart, checkout, and order management system"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🔑 If You Need to Login

### Option 1: Personal Access Token (Recommended)

1. Go to GitHub.com
2. Click your profile → Settings
3. Developer settings → Personal access tokens → Tokens (classic)
4. Generate new token
5. Select scopes: `repo` (full control)
6. Copy the token
7. Use token as password when pushing

### Option 2: GitHub CLI

```powershell
# Install GitHub CLI
winget install --id GitHub.cli

# Login
gh auth login

# Then push
git push -u origin main
```

---

## 🔄 Future Updates (After Initial Setup)

Once you've done the initial setup, for future updates just use:

```powershell
cd C:\Users\khana\Desktop\pokemon-cards-store
git add .
git commit -m "Your update message"
git push
```

---

## ✅ Verify Upload

After pushing, check your GitHub repository:
1. Go to https://github.com/YOUR-USERNAME/YOUR-REPO-NAME
2. Refresh the page
3. You should see all your files!

---

## 🆘 Troubleshooting

### Error: "remote origin already exists"

```powershell
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

### Error: "failed to push"

```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: "authentication failed"

You need a Personal Access Token (see above).

---

## 📱 Alternative: Use GitHub Desktop

If command line is confusing:

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and login
3. Click "Add" → "Add Existing Repository"
4. Browse to `C:\Users\khana\Desktop\pokemon-cards-store`
5. Click "Publish repository"
6. Done!

---

## 🎉 Success Checklist

- [ ] Git repository initialized ✅ (Already done!)
- [ ] GitHub remote added
- [ ] Files committed
- [ ] Pushed to GitHub
- [ ] Verified on GitHub.com

---

## 📝 Quick Reference

```powershell
# Check status
git status

# Add files
git add .

# Commit
git commit -m "message"

# Push
git push

# Pull latest
git pull

# View remotes
git remote -v
```

---

## 🔗 Your Repository URL

Find your repository URL on GitHub:
1. Go to your repository
2. Click green "Code" button
3. Copy the HTTPS URL
4. Use that in the `git remote add origin` command

Example format:
```
https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
