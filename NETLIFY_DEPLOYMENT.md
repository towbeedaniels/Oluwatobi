# Netlify Deployment Guide

This guide will help you deploy your portfolio app to Netlify and set up Netlify Forms.

## Prerequisites

1. A GitHub account (or GitLab/Bitbucket)
2. A Netlify account (free tier is fine)
3. Your portfolio app code pushed to a Git repository

## Step 1: Push Your Code to GitHub

1. If you haven't already, initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Portfolio app"
   ```

2. Create a new repository on GitHub and push your code:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Sign in to Netlify**
   - Go to [netlify.com](https://www.netlify.com)
   - Sign in with your GitHub account

2. **Import Your Site**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub)
   - Select your repository

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Click "Deploy site"

4. **Wait for Deployment**
   - Netlify will automatically install dependencies and build your site
   - Your site will be live at a random URL (e.g., `https://random-name.netlify.app`)

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

## Step 3: Configure Netlify Forms

1. **Verify Form Configuration**
   - Your form is already configured with:
     - `name="contact"` attribute
     - `data-netlify="true"` attribute
     - Hidden `form-name` field
     - Honeypot spam protection

2. **View Form Submissions**
   - Go to your Netlify site dashboard
   - Navigate to "Forms" in the left sidebar
   - You'll see submissions from your contact form
   - You can set up email notifications or webhooks here

3. **Set Up Email Notifications (Optional)**
   - Go to Forms → Settings
   - Click "Notifications & webhooks"
   - Add your email to receive notifications when someone submits the form

4. **Test Your Form**
   - Visit your deployed site
   - Fill out and submit the contact form
   - Check your Netlify dashboard to see the submission

## Step 4: Customize Your Domain (Optional)

1. **Add Custom Domain:**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain name
   - Follow the DNS configuration instructions

2. **SSL Certificate:**
   - Netlify provides free SSL certificates automatically
   - HTTPS will be enabled for your site

## Step 5: Environment Variables (If Needed)

If you need to use environment variables:

1. Go to Site settings → Environment variables
2. Add any variables your app needs
3. Redeploy for changes to take effect

## Important Files Created

- **`netlify.toml`** - Netlify configuration file
  - Build settings
  - Redirect rules for SPA routing
  - Development server settings

- **`public/_redirects`** - Fallback redirects for client-side routing
  - Ensures all routes work correctly in production

## Continuous Deployment

Once connected to Git:
- Every push to your main branch will automatically trigger a new deployment
- Netlify will build and deploy your site automatically
- You can view deployment history and logs in the Netlify dashboard

## Troubleshooting

### Form Not Working?
- Make sure the form has `data-netlify="true"` attribute
- Verify the hidden `form-name` field is present
- Check Netlify Forms are enabled in your plan (free tier includes 100 submissions/month)

### Build Fails?
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version in `netlify.toml` matches your local version

### Routes Not Working?
- Verify `_redirects` file is in the `public` folder
- Check `netlify.toml` redirect rules

## Support

- Netlify Documentation: https://docs.netlify.com/
- Netlify Forms: https://docs.netlify.com/forms/setup/
- Netlify Community: https://answers.netlify.com/

## Next Steps

1. Customize your site's name and URL
2. Set up form notifications
3. Add analytics (optional)
4. Configure custom domain
5. Set up staging environments for testing

