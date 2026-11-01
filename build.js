// Pre-renders every blog post to blog/<slug>/index.html, plus blog/index.html,
// sitemap.xml and robots.txt. Run with: npm run build
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { JSDOM } = require("jsdom");

const SITE = "https://hiteshmanglani.com";
const root = __dirname;
const cssVersion = require("crypto")
  .createHash("md5")
  .update(fs.readFileSync(path.join(root, "styles.css")))
  .digest("hex")
  .slice(0, 8);

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const toIsoDate = (text) => {
  const time = Date.parse(`${text} UTC`);
  return Number.isNaN(time) ? null : new Date(time).toISOString().slice(0, 10);
};

async function loadPosts() {
  const dom = new JSDOM(fs.readFileSync(path.join(root, "index.html"), "utf8"), {
    url: `${SITE}/`,
    runScripts: "outside-only",
  });
  const archive = fs.readFileSync(path.join(root, "assets/blog/archive.json"), "utf8");
  dom.window.fetch = async () => ({ ok: true, json: async () => JSON.parse(archive) });
  dom.window.console.error = console.error;

  const context = dom.getInternalVMContext();
  new vm.Script(fs.readFileSync(path.join(root, "script.js"), "utf8")).runInContext(context);
  await new Promise((resolve) => setTimeout(resolve, 100));

  const legacyRoutes = vm.runInContext("Array.from(legacyPostRoutes)", context);
  const posts = vm.runInContext(
    `blogPosts.map((post) => ({
      slug: post.slug, title: post.title, tag: post.tag, date: post.date, excerpt: post.excerpt,
      bodyHtml: post.content.map((block) => renderContentBlock(block, post)).join(""),
    }))`,
    context
  );
  return { posts, legacyRoutes };
}

// Make the SPA's hash links and relative asset paths work from any URL depth.
const toStaticLinks = (html) =>
  html
    .replace(/href="#post\/([^"]+)"/g, 'href="/blog/$1/"')
    .replace(/(src|href)="assets\//g, '$1="/assets/');

const header = `<header class="site-header">
      <div class="container nav-wrap">
        <a href="/" class="brand" aria-label="Hitesh Manglani home">
          <span class="brand-mark">HM</span>
          <span>Hitesh Manglani</span>
        </a>
        <nav class="main-nav" aria-label="Main navigation">
          <a href="/#about">About</a>
          <a href="/#expertise">Expertise</a>
          <a href="/blog/">Blog</a>
          <a href="/#contact">Contact</a>
        </nav>
        <a class="button button-small" href="/#contact">Request Resume</a>
      </div>
    </header>`;

const footer = `<footer class="site-footer">
      <div class="container footer-wrap">
        <p>© ${new Date().getFullYear()} Hitesh Manglani. All rights reserved.</p>
        <a href="/">Home</a>
      </div>
    </footer>`;

function page({ title, description, canonicalPath, type, body, extraHead = "" }) {
  const url = `${SITE}${canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:site_name" content="Hitesh Manglani" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/assets/blog/header.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />${extraHead}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/styles.css?v=${cssVersion}" />
  </head>
  <body>
    ${header}
    <main>
${body}
    </main>
    ${footer}
  </body>
</html>
`;
}

const truncate = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`);

function renderPost(post) {
  const description = truncate(post.excerpt.replace(/\s+/g, " ").trim(), 160);
  const iso = toIsoDate(post.date);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    author: { "@type": "Person", name: "Hitesh Manglani" },
    mainEntityOfPage: `${SITE}/blog/${post.slug}/`,
    ...(iso && { datePublished: iso }),
  };
  const body = `      <header class="article-hero">
        <div class="article-hero-inner">
          <a class="article-back" href="/blog/">← All articles</a>
          <div class="reader-meta">
            <span class="tag">${escapeHtml(post.tag)}</span>
            <time${iso ? ` datetime="${iso}"` : ""}>${escapeHtml(post.date)}</time>
          </div>
          <h1>${escapeHtml(post.title)}</h1>
        </div>
      </header>
      <section class="journal-section static-page-bottom">
        <article class="article-page">
          <div class="reader-body">${toStaticLinks(post.bodyHtml)}</div>
        </article>
      </section>`;

  return page({
    title: `${post.title} | Hitesh Manglani`,
    description,
    canonicalPath: `/blog/${post.slug}/`,
    type: "article",
    body,
    extraHead: `\n    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  });
}

function renderIndex(posts) {
  const items = posts
    .map(
      (post) => `            <article class="article-card">
              <div class="article-meta"><span>${escapeHtml(post.date)}</span><span class="tag">${escapeHtml(post.tag)}</span></div>
              <div>
                <h3><a href="/blog/${escapeHtml(post.slug)}/">${escapeHtml(post.title)}</a></h3>
                <p>${escapeHtml(truncate(post.excerpt.replace(/\s+/g, " ").trim(), 220))}</p>
              </div>
              <a class="article-link" href="/blog/${escapeHtml(post.slug)}/">Read article →</a>
            </article>`
    )
    .join("\n");

  return page({
    title: "Dynamics Journal | Hitesh Manglani",
    description: "A blog on Dynamics 365 FinOps Commerce and associated tech, by Hitesh Manglani.",
    canonicalPath: "/blog/",
    type: "website",
    body: `      <div class="journal-masthead">
        <div class="journal-masthead-panel">
          <h2>DYNAMICS JOURNAL</h2>
          <p>A blog on Dynamics 365 FinOps Commerce and associated tech</p>
        </div>
      </div>
      <section class="journal-section static-page-bottom">
        <div class="journal-content">
          <div class="card-grid blog-grid">
${items}
          </div>
        </div>
      </section>`,
  });
}

function renderSitemap(posts) {
  const urls = [
    { loc: `${SITE}/` },
    { loc: `${SITE}/blog/` },
    ...posts.map((post) => ({ loc: `${SITE}/blog/${post.slug}/`, lastmod: toIsoDate(post.date) })),
  ];
  const entries = urls
    .map((u) => `  <url><loc>${escapeHtml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

const REDIRECT_MARKER = "<!-- generated-redirect -->";

// Old WordPress URLs (/<legacy-slug>/) forward to the new article pages.
function writeLegacyRedirects(posts, legacyRoutes) {
  const reserved = new Set(["assets", "blog", "node_modules", ".git"]);
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name, "index.html");
    if (entry.isDirectory() && fs.existsSync(file) && fs.readFileSync(file, "utf8").includes(REDIRECT_MARKER)) {
      fs.rmSync(path.join(root, entry.name), { recursive: true, force: true });
    }
  }

  const known = new Set(posts.map((post) => post.slug));
  let count = 0;
  for (const [legacySlug, slug] of legacyRoutes) {
    if (!known.has(slug) || reserved.has(legacySlug) || !/^[a-z0-9-]+$/.test(legacySlug)) continue;
    const target = `${SITE}/blog/${slug}/`;
    const dir = path.join(root, legacySlug);
    if (fs.existsSync(dir)) continue;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "index.html"),
      `<!DOCTYPE html>
${REDIRECT_MARKER}
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting…</title>
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=/blog/${slug}/" />
    <meta name="robots" content="noindex" />
    <script>location.replace("/blog/${slug}/");</script>
  </head>
  <body><p>This article has moved to <a href="/blog/${slug}/">${target}</a>.</p></body>
</html>
`
    );
    count += 1;
  }
  return count;
}

async function main() {
  const { posts, legacyRoutes } = await loadPosts();
  fs.rmSync(path.join(root, "blog"), { recursive: true, force: true });

  for (const post of posts) {
    const dir = path.join(root, "blog", post.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), renderPost(post));
  }
  fs.writeFileSync(path.join(root, "blog", "index.html"), renderIndex(posts));
  fs.writeFileSync(path.join(root, "sitemap.xml"), renderSitemap(posts));
  fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  const redirects = writeLegacyRedirects(posts, legacyRoutes);
  console.log(`Generated ${posts.length} posts, ${redirects} legacy redirects, blog index, sitemap.xml and robots.txt`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
