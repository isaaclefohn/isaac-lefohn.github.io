# 🚀 Website Deployment Guide for Isaac Lefohn

## Files Included
Your website consists of these files:
- `index.html` - Home page
- `resume.html` - Resume page
- `experience.html` - Experience page
- `skills.html` - Skills page  
- `contact.html` - Contact page
- `styles.css` - All styling
- `script.js` - Interactive features
- `Isaac_Lefohn_Resume.pdf` - Downloadable PDF resume

## Option 1: GitHub Pages (RECOMMENDED - FREE & EASY)

### Step 1: Create a GitHub Account
1. Go to https://github.com
2. Click "Sign up"
3. Create your account

### Step 2: Create a New Repository
1. Click the "+" icon in the top right
2. Select "New repository"
3. Name it: `yourname.github.io` (example: `isaac-lefohn.github.io`)
4. Make it **Public**
5. Click "Create repository"

### Step 3: Upload Your Files
1. Click "uploading an existing file"
2. Drag and drop ALL 8 files into the upload area
3. Add commit message: "Initial website upload"
4. Click "Commit changes"

### Step 4: Enable GitHub Pages
1. Go to repository Settings
2. Click "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Click "Save"

### Step 5: Access Your Website
- Your site will be live at: `https://yourname.github.io`
- Wait 2-5 minutes for deployment
- Visit the URL to see your live website!

### To Update Your Website Later:
1. Go to your repository
2. Click on the file you want to update
3. Click the pencil icon to edit
4. Make changes and commit

---

## Option 2: Netlify (FREE, DRAG & DROP)

### Step 1: Go to Netlify
1. Visit https://www.netlify.com
2. Click "Sign up" (can use GitHub account)

### Step 2: Deploy
1. After logging in, click "Add new site"
2. Select "Deploy manually"
3. Drag ALL 8 files into the drop zone
4. Wait 30 seconds for deployment

### Step 3: Customize Domain (Optional)
1. Click "Domain settings"
2. Click "Options" → "Edit site name"
3. Choose: `isaac-lefohn.netlify.app`

### Your Site is Live!
- Access at: `https://your-site-name.netlify.app`

---

## Option 3: Vercel (FREE, PROFESSIONAL)

### Step 1: Sign Up
1. Go to https://vercel.com
2. Click "Sign Up" (use GitHub recommended)

### Step 2: Deploy
1. Click "Add New" → "Project"
2. Click "Continue with GitHub"  
3. Create new repository with your files
4. Click "Deploy"

### Your Site is Live!
- Access at your Vercel URL

---

## 📱 Making Your Website Searchable on Google

### Step 1: Google Search Console
1. Go to https://search.google.com/search-console
2. Sign in with Google account
3. Click "Add Property"
4. Enter your website URL
5. Follow verification steps

### Step 2: Submit Your Sitemap
Create a file called `sitemap.xml` with this content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site-url.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-site-url.com/resume.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-site-url.com/experience.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-site-url.com/skills.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-site-url.com/contact.html</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

Upload this file to your website root directory.

### Step 3: Wait for Indexing
- Google typically indexes new sites within 1-2 weeks
- Check indexing status in Google Search Console

---

## 🎯 Custom Domain (Optional)

### If You Want Your Own Domain (like isaacdefohn.com):

1. **Buy a domain**:
   - Namecheap.com ($10-15/year)
   - GoDaddy.com
   - Google Domains

2. **Connect to GitHub Pages**:
   - In repository settings → Pages
   - Add custom domain
   - Update DNS records at your domain registrar

3. **Connect to Netlify/Vercel**:
   - Go to domain settings
   - Click "Add custom domain"
   - Follow DNS configuration steps

---

## ✅ Post-Deployment Checklist

After deploying, verify:
- [ ] All pages load correctly
- [ ] Navigation works between pages
- [ ] Contact links (phone, email, LinkedIn) work
- [ ] PDF download works
- [ ] Mobile responsive design works
- [ ] All images/icons display correctly

---

## 📊 Tracking Visitors (Optional)

### Add Google Analytics:
1. Go to https://analytics.google.com
2. Create account and property
3. Get tracking code
4. Add to `<head>` section of all HTML files

---

## 🔧 Troubleshooting

**Site not loading?**
- Wait 5-10 minutes after deployment
- Clear browser cache
- Check if files uploaded correctly

**Links not working?**
- Ensure file names match exactly (case-sensitive)
- Check all files are in the same directory

**PDF not downloading?**
- Confirm `Isaac_Lefohn_Resume.pdf` is uploaded
- Check file name matches in contact.html

---

## 💡 Pro Tips

1. **Share your website**:
   - Add URL to LinkedIn profile
   - Include in email signature  
   - Put on business cards
   - Add to your PDF resume

2. **Update regularly**:
   - Add new experiences
   - Update coursework as you complete classes
   - Keep contact information current

3. **Monitor performance**:
   - Use Google Search Console
   - Check for broken links monthly
   - Update content quarterly

---

## 🎉 You're All Set!

Your professional website is now live and searchable! Employers can find you online and see your professional brand.

**Next Steps**:
1. Deploy using one of the options above
2. Test all functionality
3. Add website URL to your LinkedIn
4. Share with your network

Good luck with your job search! 🚀
