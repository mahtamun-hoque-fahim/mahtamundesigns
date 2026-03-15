#!/bin/bash
# ============================================================
# Run this script to push all fixes to GitHub
# You need a GitHub Personal Access Token (PAT)
#
# Get one here: https://github.com/settings/tokens/new
#   - Give it repo scope
#   - Copy the token
# ============================================================

echo "Enter your GitHub Personal Access Token:"
read -s GITHUB_TOKEN

git remote set-url origin "https://mahtamun-hoque-fahim:${GITHUB_TOKEN}@github.com/mahtamun-hoque-fahim/mahtamundesigns.git"
git push origin main

echo "✅ Done! All fixes pushed to GitHub."
echo "Now go set up Vercel (see README for instructions)."
