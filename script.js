const blogPosts = [
  {
    title: "Powershell scripts to simplify JIT access – redirecting Dev to Tier2 environment",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "26 July 2026",
    excerpt:
      "A practical PowerShell approach to simplifying LCS-based JIT access and redirecting a D365 FinOps Dev environment to Tier 2.",
    url: "https://hiteshgoldeneye.com/powershell-scripts-to-simplify-ji-access-redirecting-dev-to-tier2-environment/",
  },
  {
    title: "Resolving ‘Operation Can’t Be Performed’ Error in Store Commerce",
    category: "operations",
    tag: "Operations",
    date: "02 July 2025",
    excerpt:
      "A deep-dive into a Store Commerce issue caused by the RetailFunctionalityProfile setting MANUALCHARGECALCULATION.",
    url: "https://hiteshgoldeneye.com/resolving-operation-cant-be-performed-error-in-store-commerce/",
  },
  {
    title: "Commerce Extensions Techtalks",
    category: "strategy",
    tag: "Strategy",
    date: "09 January 2022",
    excerpt:
      "A summary of the Dynamics Commerce Extensions TechTalk series and what it means for future retail customization approaches.",
    url: "https://hiteshgoldeneye.com/commerce-extensions-techtalks/",
  },
  {
    title: "Upselling – Info codes configuration recap",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "19 October 2020",
    excerpt:
      "A configuration-based recap of using Retail Info Codes to create upsell prompts without custom code.",
    url: "https://hiteshgoldeneye.com/upselling-info-codes-configuration-recap/",
  },
  {
    title: "Purchase Order status changing automatically",
    category: "operations",
    tag: "Operations",
    date: "21 February 2020",
    excerpt:
      "An investigation into a purchase order status regression where confirmed orders unexpectedly changed to approved.",
    url: "https://hiteshgoldeneye.com/purchase-order-status-changing-automatically/",
  },
  {
    title: "Dyn365FO Excel Add-In Issues Troubleshooting",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "25 October 2019",
    excerpt:
      "A practical troubleshooting guide for resolving common issues with the Dynamics 365 Finance and Operations Excel Add-In.",
    url: "https://hiteshgoldeneye.com/dyn365fo-excel-add-in-issues-troubleshooting/",
  },
  {
    title: "General ledger parameters -> Ledger Accounting rules",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "16 July 2019",
    excerpt:
      "A concise explainer on how the summary account behavior in General Ledger parameters affects accounting outcomes.",
    url: "https://hiteshgoldeneye.com/general-ledger-parameters-ledger-accounting-rules/",
  },
  {
    title: "Dynamics 365 for Retail Upgrade – Backward compatibility",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "05 May 2019",
    excerpt:
      "A real-world retail upgrade issue where MPOS compatibility broke between v7.1 and v10, and how it was resolved.",
    url: "https://hiteshgoldeneye.com/dynamics-365-for-retail-upgrade-backward-compatibility/",
  },
  {
    title: "MPOS Build Error – App manifest validation error: The app manifest must be valid as per schema",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "01 February 2019",
    excerpt:
      "A Visual Studio and SDK troubleshooting post for MPOS build errors caused by missing deployment prerequisites.",
    url: "https://hiteshgoldeneye.com/mpos-solution-build-error-app-manifest-validation-error-the-app-manifest-must-be-valid-as-per-schema/",
  },
  {
    title: "MPOS Build Error: “10.0.10xxx.0” is not a supported value for TargetPlatformVersion…",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "21 December 2018",
    excerpt:
      "A quick fix for a Windows SDK version mismatch that prevented the MPOS solution from compiling.",
    url: "https://hiteshgoldeneye.com/mpos-build-error-10-0-10xxx-0-is-not-a-supported-value-for-targetplatformversion/",
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
          <a class="article-link" href="${post.url}" target="_blank" rel="noreferrer">Read more →</a>
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
