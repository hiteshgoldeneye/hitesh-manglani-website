const blogPosts = [
  {
    title: "Modernizing ERP Change Management Without Slowing Operations",
    category: "strategy",
    tag: "Strategy",
    date: "Jun 2026",
    excerpt:
      "A practical framework for rolling out ERP updates while preserving service continuity and stakeholder confidence.",
  },
  {
    title: "D365FO Performance Tuning: Where Teams Often Lose Time",
    category: "d365",
    tag: "D365",
    date: "May 2026",
    excerpt:
      "Common bottlenecks in financial and operations environments, and where targeted optimization creates outsized value.",
  },
  {
    title: "Why Operational Readiness Matters More Than a Perfect Go-Live Plan",
    category: "operations",
    tag: "Operations",
    date: "Apr 2026",
    excerpt:
      "A realistic look at readiness, adoption metrics, and how missing business continuity checks can derail rollout momentum.",
  },
  {
    title: "Designing Successful Commerce Integrations Around Real Business Flow",
    category: "d365",
    tag: "D365",
    date: "Mar 2026",
    excerpt:
      "How to align integrations, core processes, and user expectations so digital commerce programs are easier to support.",
  },
  {
    title: "From Requirements to Scalable Delivery: A Better ERP Execution Model",
    category: "strategy",
    tag: "Strategy",
    date: "Feb 2026",
    excerpt:
      "Creating a delivery structure that reduces rework, improves traceability, and gives business teams more confidence.",
  },
  {
    title: "Stability, Governance, and Continuous Improvement After Go-Live",
    category: "operations",
    tag: "Operations",
    date: "Jan 2026",
    excerpt:
      "Why post-implementation governance is often the difference between a stable platform and repeated operational friction.",
  },
];

const blogGrid = document.getElementById("blog-grid");
const filterButtons = document.querySelectorAll(".filter-button");
const year = document.getElementById("year");

function renderPosts(filter = "all") {
  const filteredPosts =
    filter === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === filter);

  blogGrid.innerHTML = filteredPosts
    .map(
      (post) => `
        <article class="article-card">
          <div class="article-meta">
            <span>${post.date}</span>
            <span class="tag">${post.tag}</span>
          </div>
          <div>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
          </div>
          <a class="article-link" href="#contact">Read more →</a>
        </article>
      `
    )
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderPosts(button.dataset.filter);
  });
});

if (year) {
  year.textContent = new Date().getFullYear();
}

renderPosts();
