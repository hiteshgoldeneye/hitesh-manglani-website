# Hitesh Manglani Personal Website

A professional personal website template for Hitesh Manglani featuring a modern portfolio, blog content, and a clear contact call-to-action for requesting a resume.

## Included

- Hero section with professional positioning
- Expertise and experience sections
- Blog card grid with filterable categories
- Resume/contact CTA section
- Responsive, modern styling

## Run locally

Open the `index.html` file directly in a browser, or use a simple local web server:

```bash
cd /home/hgmonlinux/Documents/GitHub/hiteshmanglaniweb
python3 -m http.server 3000
```

Then visit `http://localhost:3000`.

## Customize

Update the following files to tailor the site to your exact brand and contact details:

- `index.html` — content, sections, and contact links
- `styles.css` — colors, typography, and layout
- `script.js` — blog content and category filters

## GitHub repo

Initialize the repository locally:

```bash
git init
git add .
git commit -m "Initial website setup"
```

Then create a new GitHub repository and push:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## Notes

Each blog article is pre-rendered to a real URL (`/blog/<slug>/`) with its own title, description and Open Graph tags. After changing posts in `script.js` or `assets/blog/archive.json`, run `npm install` (once) and `npm run build`, then commit the regenerated `blog/`, `sitemap.xml` and `robots.txt`.

The default contact email is set to `hello@hiteshmanglani.com`. Replace it with the correct email before publishing.
