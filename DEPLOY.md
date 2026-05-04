# SHiFT with Purpose — Website Deployment Guide

## Files in this folder

```
shiftwithpurpose-website/
├── index.html          ← Home page
├── about.html          ← About Cata page
├── services.html       ← Services and offers
├── blog.html           ← Insights / blog hub
├── contact.html        ← Free SHiFT Call booking (Moxie embed)
├── quiz.html           ← EAI Quiz (Typeform embed)
├── styles.css          ← Shared stylesheet (all pages)
└── images/
    ├── logo-light.png  ← Logo for light backgrounds (nav)
    └── logo-dark.png   ← Logo for dark backgrounds (footer, navy sections)
```

---

## Before publishing — your checklist

- [ ] **Replace all photo placeholders** — search the HTML files for `[ Photo of Cata` and swap in real images
- [ ] **Add your ABN** — search for `[ADD ABN]` in index.html footer
- [ ] **Add your email address** — currently set to hello@shiftwithpurpose.com.au, confirm this is correct
- [ ] **Review all copy** — read each page and mark anything you want to adjust
- [ ] **Add testimonials** — the home page has one placeholder testimonial ready to go
- [ ] **Logo** — the logo files from your ZIP are included; confirm they display correctly
- [ ] **Add blog articles** — the blog page shows placeholder cards; swap in real articles when published

---

## Deploying to Netlify (free hosting)

Netlify will host this site for free and connect to your custom domain (www.shiftwithpurpose.com.au).

### Option A: Drag and drop (easiest)

1. Go to https://netlify.com and create a free account (if you don't have one)
2. Log in and click **"Add new site"** → **"Deploy manually"**
3. Drag the entire `shiftwithpurpose-website` folder onto the upload area
4. Netlify will give you a temporary URL (e.g., `jolly-cato-123.netlify.app`) — check the site looks right
5. Go to **Site settings → Domain management → Add custom domain**
6. Enter `shiftwithpurpose.com.au` and follow Netlify's DNS instructions

### Option B: Connect to GitHub (better for ongoing updates)

1. Upload the folder to a GitHub repository
2. In Netlify, connect the GitHub repo
3. Every time files are pushed to GitHub, the site updates automatically

---

## Connecting your domain

Your current domain is registered and pointing to Wix. To move it to Netlify:

1. Log in to your domain registrar (whoever manages shiftwithpurpose.com.au)
2. Update the nameservers or DNS records to point to Netlify
3. Netlify will handle the SSL certificate (HTTPS) automatically

**Important:** Do this only after you're happy with the new site. Keep the Wix version live until you're ready to switch.

---

## Making updates

For any future changes to content, copy, colours, or structure — come back to Claude Cowork and describe what you need. The files can be edited and re-uploaded to Netlify in minutes.

---

## What's live in this version

| Feature | Status |
|---------|--------|
| Booking calendar (Moxie) | Live on contact.html |
| EAI Quiz (Typeform) | Live on quiz.html |
| Logo (both versions) | Included in images/ |
| New brand colour (#765c8a) | Applied throughout |
| New tagline hierarchy | Applied to all pages |
| AI positioning | Prominent on all pages |
| Sector-specific SEO | Applied to all meta tags |
| Schema markup | On home page |
| Mobile responsive | Yes — all pages |

