# How to Update GitHub - Step by Step Guide

## 🎯 Where to Paste the Commands

You need to paste the Git commands in a **Terminal/Command Prompt** window. Here are 3 ways to do it:

---

## Method 1: Using VSCode Terminal (EASIEST)

### Step 1: Open VSCode Terminal
1. Open VSCode
2. Click on **Terminal** in the top menu
3. Click **New Terminal** (or press `` Ctrl + ` ``)
4. A terminal window will open at the bottom of VSCode

### Step 2: Navigate to Your Project
```bash
cd C:\Users\khana\Desktop\pokemon-cards-store
```

### Step 3: Paste and Run Commands
Copy and paste these commands one by one:

```bash
# Check current status
git status

# Add modified files
git add js/store.js js/data.js js/cart.js js/checkout.js

# Add documentation files
git add CART_FIX_SUMMARY.md TESTING_GUIDE.md GITHUB_UPDATE_INSTRUCTIONS.md ORDER_MANAGEMENT_GUIDE.md

# Commit changes
git commit -m "Fix: Complete cart, checkout, and order management system"

# Push to GitHub
git push origin main
```

---

## Method 2: Using Windows Command Prompt

### Step 1: Open Command Prompt
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Command Prompt window opens

### Step 2: Navigate to Your Project
```bash
cd C:\Users\khana\Desktop\pokemon-cards-store
```

### Step 3: Paste Commands
Right-click in the Command Prompt window to paste, then press Enter.

```bash
git status
git add js/store.js js/data.js js/cart.js js/checkout.js
git add CART_FIX_SUMMARY.md TESTING_GUIDE.md GITHUB_UPDATE_INSTRUCTIONS.md ORDER_MANAGEMENT_GUIDE.md
git commit -m "Fix: Complete cart, checkout, and order management system"
git push origin main
```

---

## Method 3: Using Windows PowerShell

### Step 1: Open PowerShell
1. Press `Windows Key + X`
2. Click **Windows PowerShell** or **Terminal**

### Step 2: Navigate to Your Project
```powershell
cd C:\Users\khana\Desktop\pokemon-cards-store
```

### Step 3: Paste Commands
Right-click to paste, then press Enter.

```powershell
git status
git add js/store.js js/data.js js/cart.js js/checkout.js
git add CART_FIX_SUMMARY.md TESTING_GUIDE.md GITHUB_UPDATE_INSTRUCTIONS.md ORDER_MANAGEMENT_GUIDE.md
git commit -m "Fix: Complete cart, checkout, and order management system"
git push origin main
```

---

## 📋 Complete Command Sequence

### Copy and paste these commands ONE AT A TIME:

```bash
# 1. Navigate to your project folder
cd C:\Users\khana\Desktop\pokemon-cards-store

# 2. Check what files have changed
git status

# 3. Add the JavaScript files
git add js/store.js js/data.js js/cart.js js/checkout.js

# 4. Add the documentation files
git add CART_FIX_SUMMARY.md TESTING_GUIDE.md GITHUB_UPDATE_INSTRUCTIONS.md ORDER_MANAGEMENT_GUIDE.md

# 5. Commit with a message
git commit -m "Fix: Complete cart, checkout, and order management system"

# 6. Push to GitHub
git push origin main
```

---

## 🎬 Visual Guide

### What You'll See:

**After `git status`:**
```
On branch main
Changes not staged for commit:
  modified:   js/cart.js
  modified:   js/checkout.js
  modified:   js/data.js
  modified:   js/store.js
Untracked files:
  CART_FIX_SUMMARY.md
  ORDER_MANAGEMENT_GUIDE.md
  ...
```

**After `git add`:**
```
(Files are staged for commit)
```

**After `git commit`:**
```
[main abc1234] Fix: Complete cart, checkout, and order management system
 8 files changed, 500 insertions(+), 100 deletions(-)
```

**After `git push`:**
```
Counting objects: 10, done.
Writing objects: 100% (10/10), 1.5 KiB | 0 bytes/s, done.
To https://github.com/yourusername/your-repo.git
   abc1234..def5678  main -> main
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "git is not recognized"
**Problem:** Git is not installed or not in PATH

**Solution:**
1. Download Git from: https://git-scm.com/download/win
2. Install Git
3. Restart your terminal
4. Try again

---

### Issue 2: "Permission denied"
**Problem:** Not authenticated with GitHub

**Solution:**
```bash
# Configure Git with your details
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Try pushing again
git push origin main
```

If still fails, you may need to set up SSH keys or use a personal access token.

---

### Issue 3: "fatal: not a git repository"
**Problem:** You're not in the right folder

**Solution:**
```bash
# Make sure you're in the correct directory
cd C:\Users\khana\Desktop\pokemon-cards-store

# Check if .git folder exists
dir .git

# If not, initialize git
git init
git remote add origin https://github.com/yourusername/your-repo.git
```

---

### Issue 4: "Updates were rejected"
**Problem:** Remote has changes you don't have locally

**Solution:**
```bash
# Pull latest changes first
git pull origin main

# Then push your changes
git push origin main
```

---

## 🔄 Alternative: Using GitHub Desktop (GUI Method)

If you prefer a visual interface:

### Step 1: Install GitHub Desktop
1. Download from: https://desktop.github.com/
2. Install and sign in with your GitHub account

### Step 2: Open Your Repository
1. Click **File** → **Add Local Repository**
2. Browse to `C:\Users\khana\Desktop\pokemon-cards-store`
3. Click **Add Repository**

### Step 3: Commit Changes
1. You'll see all changed files listed
2. Check the boxes next to files you want to commit
3. Write commit message: "Fix: Complete cart, checkout, and order management system"
4. Click **Commit to main**

### Step 4: Push to GitHub
1. Click **Push origin** button at the top
2. Wait for upload to complete
3. Done!

---

## ✅ Verification

After pushing, verify your changes:

1. Go to your GitHub repository in a web browser
2. Check if the files are updated
3. Look for your commit message
4. Verify the timestamp is recent

---

## 📝 Quick Reference Card

```bash
# Essential Git Commands

cd C:\Users\khana\Desktop\pokemon-cards-store  # Navigate to project
git status                                      # Check status
git add <filename>                              # Stage file
git add .                                       # Stage all files
git commit -m "message"                         # Commit changes
git push origin main                            # Push to GitHub
git pull origin main                            # Pull from GitHub
```

---

## 🆘 Need Help?

If you're stuck:
1. Take a screenshot of the error
2. Check the error message carefully
3. Google the exact error message
4. Or use GitHub Desktop (GUI) instead

---

## 🎉 Success!

Once you see "Everything up-to-date" or successful push message, your changes are live on GitHub!

Your website will automatically update if you have GitHub Pages enabled.
