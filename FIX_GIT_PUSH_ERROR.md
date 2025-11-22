# Fix Git Push Error

## Problem
```
! [rejected]        main -> main (fetch first)
error: failed to push some refs
```

**Cause:** The remote repository (GitHub) has commits that you don't have locally.

---

## ✅ Solution Options

### Option 1: Pull and Merge (Recommended - Preserves All Changes)

This will combine your local changes with remote changes:

```powershell
cd D:\CodeCore_StockMarket\Final

# Pull remote changes and merge
git pull origin main --allow-unrelated-histories

# If there are conflicts, resolve them, then:
git add .
git commit -m "Merge remote changes"

# Push your changes
git push origin main
```

### Option 2: Pull with Rebase (Cleaner History)

This will put your commits on top of remote commits:

```powershell
cd D:\CodeCore_StockMarket\Final

# Pull with rebase
git pull origin main --rebase

# Push your changes
git push origin main
```

### Option 3: Force Push (⚠️ Use with Caution!)

**WARNING:** This will overwrite remote changes. Only use if you're sure you want to replace everything on GitHub.

```powershell
cd D:\CodeCore_StockMarket\Final

# Force push (overwrites remote)
git push origin main --force
```

**⚠️ Only use this if:**
- You're the only one working on this repo
- You don't need the remote changes
- You're okay with losing what's on GitHub

---

## Recommended: Option 1 (Pull and Merge)

This is the safest option that preserves all changes:

```powershell
cd D:\CodeCore_StockMarket\Final
git pull origin main --allow-unrelated-histories
```

If there are no conflicts, you can then push:
```powershell
git push origin main
```

If there are conflicts, Git will tell you which files need to be resolved.

---

## Quick Steps

1. **Pull remote changes:**
   ```powershell
   git pull origin main --allow-unrelated-histories
   ```

2. **If merge commit is created automatically, push:**
   ```powershell
   git push origin main
   ```

3. **If there are conflicts:**
   - Git will show you which files have conflicts
   - Open those files and resolve conflicts
   - Then: `git add .` and `git commit -m "Resolve conflicts"`
   - Then: `git push origin main`

---

## What Each Option Does

| Option | What It Does | When to Use |
|--------|-------------|-------------|
| **Pull & Merge** | Combines both histories | ✅ Recommended - safest |
| **Pull & Rebase** | Puts your commits on top | When you want linear history |
| **Force Push** | Overwrites remote | ⚠️ Only if you don't need remote changes |

---

## Need Help?

If you're not sure which option to use, **go with Option 1** - it's the safest and preserves all your work.

