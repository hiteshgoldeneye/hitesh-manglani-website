const blogPosts = [
  {
    slug: "powershell-jit-tier2-redirect",
    title: "Powershell scripts to simplify JIT access – redirecting Dev to Tier2 environment",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "26 July 2026",
    excerpt:
      "A practical PowerShell approach to simplifying LCS-based JIT access and redirecting a D365 FinOps Dev environment to Tier 2.",
    content: [
      { type: "p", text: "When debugging an issue in an LCS-provisioned Dynamics 365 Finance and Operations development environment, it is often necessary to redirect the development environment to Tier 2." },
      { type: "p", text: "The standard redirect steps are useful, but completing them repeatedly can take time. I created a set of PowerShell scripts to make the process faster." },
      { type: "p", text: "I have tested these scripts and used them multiple times. Refer to the project README for setup instructions before running them." },
      { type: "p", text: "The original post includes links to the redirect instructions, scripts, and their setup README." },
      { type: "p", text: "Hope this helps.\n\n-Hitesh Manglani" },
    ],
  },
  {
    slug: "store-commerce-customer-deposit-error",
    title: "Resolving ‘Operation Can’t Be Performed’ Error in Store Commerce",
    category: "operations",
    tag: "Operations",
    date: "02 July 2025",
    excerpt:
      "A deep-dive into a Store Commerce issue caused by the RetailFunctionalityProfile setting MANUALCHARGECALCULATION.",
    content: [
      { type: "p", text: "Store Commerce version 9.53.25122.3: while attempting a customer deposit transaction, we received this error even though the same transaction had worked in the environment a few days earlier:" },
      { type: "quote", text: "The operation can’t be performed on a customer account deposit." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2025/07/image-4.png?resize=676%2C174&ssl=1", alt: "Store Commerce customer account deposit error" },
      { type: "p", text: "We knew it had to be a configuration issue, but needed to find which setting was responsible. Tracing the Store Commerce front-end code, with support from the Microsoft FastTrack team, led us to the MANUALCHARGECALCULATION field." },
      { type: "p", text: "I traced this field in the CRT code to the RetailFunctionalityProfile. The flag was enabled and causing the error, but it was hidden on the Functionality Profile form, which made it difficult to find." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2025/07/image-scaled.png?resize=676%2C385&ssl=1", alt: "Retail Functionality Profile configuration" },
      { type: "p", text: "Turning off MANUALCHARGECALCULATION resolved the issue.\n\nHope this helps.\n\n-Hitesh Manglani" },
    ],
  },
  {
    slug: "commerce-extensions-techtalks",
    title: "Commerce Extensions Techtalks",
    category: "strategy",
    tag: "Strategy",
    date: "09 January 2022",
    excerpt:
      "A summary of the Dynamics Commerce Extensions TechTalk series and what it means for future retail customization approaches.",
    content: [
      { type: "p", text: "Hi everyone,\n\nWishing you a Happy New Year 2022." },
      { type: "p", text: "It has been a while since I posted, but I hope to keep some momentum going forward." },
      { type: "p", text: "The Microsoft Dynamics team has been making significant changes to how we build customizations for Retail, based on feedback from customers and partners. You can catch up on these changes through the Commerce Extensions TechTalk series." },
      { type: "reference", label: "TechTalk Series: Commerce Extensions", href: "https://community.dynamics.com/blogs/post/?postid=a7ae4e0b-3af0-48a0-8943-9ee9d0f941c6" },
      { type: "p", text: "Hope this helps.\n\n-Hitesh Manglani" },
    ],
  },
  {
    slug: "upselling-info-codes-configuration",
    title: "Upselling – Info codes configuration recap",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "19 October 2020",
    excerpt:
      "A configuration-based recap of using Retail Info Codes to create upsell prompts without custom code.",
    content: [
      { type: "p", text: "Upselling is a common requirement in Retail POS. This post recaps how to achieve it through configuration, without code, using Info Codes in Dynamics 365 for Operations." },
      { type: "p", text: "For example, a cashier selling a camera could be prompted to ask whether the customer would also like batteries." },
      { type: "heading", text: "Create the Info Code" },
      { type: "p", text: "Create an Info Code that displays a prompt to the cashier in Retail POS. In Dynamics 365, go to Retail and Commerce → Channel setup → Info codes. Set the input type to subcode buttons." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2020/10/info-code-setup.png", alt: "Info Code setup" },
      { type: "p", text: "Set up the subcodes and note the Trigger function and Trigger code. With this setup, selecting Yes means the customer agrees to buy the item being offered, and the product is added to the transaction." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2020/10/subcode-setup.png", alt: "Info Code subcode setup" },
      { type: "heading", text: "Link the code to the product" },
      { type: "p", text: "Link the Info Code to the product the cashier sells first, in this example the camera. This is configured on the released product under Commerce → Set up → Info codes." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2020/10/released-product-setup-infocode.png", alt: "Released product Info Code setup" },
      { type: "p", text: "Push the setup to POS by running jobs 1030 and 1040. The cashier will then see the prompt; selecting Yes adds the batteries to the transaction." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2020/10/infocode-pos-prompt.png", alt: "Info Code prompt in POS" },
      { type: "p", text: "Regards,\n\nHitesh Manglani" },
    ],
  },
  {
    slug: "purchase-order-status-changing",
    title: "Purchase Order status changing automatically",
    category: "operations",
    tag: "Operations",
    date: "21 February 2020",
    excerpt:
      "An investigation into a purchase order status regression where confirmed orders unexpectedly changed to approved.",
    content: [
      { type: "p", text: "End users in Operations and Purchasing reported that purchase order statuses were changing without anyone updating them. The issue was observed on Platform Update 32, version 10.0.08." },
      { type: "p", text: "Orders changed from Confirmed to Approved. When Operations tried to receive the order, posting failed with this message:" },
      { type: "quote", text: "Purchase order is no longer confirmed. Posting of the order has been cancelled." },
      { type: "p", text: "I first checked whether recent deployed packages could have caused the change, but found no code that explained it. I then suspected a standard product issue and found a related issue in Lifecycle Services." },
      { type: "p", text: "If you are experiencing the same issue, review the linked LCS issue and subscribe there for notifications about the fix." },
      { type: "reference", label: "LCS issue 412804", href: "https://fix.lcs.dynamics.com/Issue/Details?bugId=412804&dbType=3&qc=42d3ca380a11a4462acb824e890db0689172d2f8766d8724f3cc6f5231393a29" },
      { type: "p", text: "Hope this helps.\n\n-Hitesh Manglani" },
    ],
  },
  {
    slug: "dyn365fo-excel-add-in-troubleshooting",
    title: "Dyn365FO Excel Add-In Issues Troubleshooting",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "25 October 2019",
    excerpt:
      "A practical troubleshooting guide for resolving common issues with the Dynamics 365 Finance and Operations Excel Add-In.",
    content: [
      { type: "p", text: "If you are having issues with the Dynamics 365 Finance and Operations Excel Add-In, first follow Microsoft’s troubleshooting steps." },
      { type: "reference", label: "Office integration troubleshooting", href: "https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/office-integration/office-integration-troubleshooting" },
      { type: "p", text: "If the issue persists after completing those steps, try the following:" },
      { type: "list", items: [
        "Open the Office add-ins installation page.",
        "Choose Open in Excel.",
        "Choose Open in Excel 2016 when prompted.",
        "Confirm the prompt. The add-in should open in Excel’s right-hand pane. Select Add server information.",
        "Enter the URL for your Dynamics 365 Finance and Operations environment and select OK.",
      ] },
      { type: "reference", label: "Open the Office add-ins installation page", href: "https://store.office.com/addinsinstallpage.aspx?rs=en-001&assetid=WA104379629" },
      { type: "p", text: "You may need to sign in if Excel prompts you after selecting Open. Otherwise, the add-in should be ready to use.\n\nHope this helps.\n\n-Hitesh Manglani" },
    ],
  },
  {
    slug: "general-ledger-accounting-rules",
    title: "General ledger parameters -> Ledger Accounting rules",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "16 July 2019",
    excerpt:
      "A concise explainer on how the summary account behavior in General Ledger parameters affects accounting outcomes.",
    content: [
      { type: "p", text: "Hi all,\n\nI was learning some of the nuances of General Ledger parameters in Dynamics 365 for Operations using the Microsoft Partner course material." },
      { type: "p", text: "I found it difficult to understand the effect of the accounting rules option at General parameters → Ledger Accounting rules → Financial Dimensions → Values used for summary account." },
      { type: "p", text: "A post by Ludwig Reinhard helped explain how this setting affects postings to the liability summary account." },
      { type: "reference", label: "General ledger parameter: values used for summary account", href: "https://dynamicsuser.net/ax/f/developers/55997/general-ledger-parameter-------values-used-for-summary-account-ax-2012" },
      { type: "p", text: "I also found Ludwig Reinhard’s Dynamics AX Finance blog useful." },
      { type: "reference", label: "Dynamics AX Finance blog", href: "https://dynamicsax-fico.com/author/ludwigreinhard/" },
      { type: "p", text: "Hope this helps.\n\n-Hitesh Manglani" },
    ],
  },
  {
    slug: "dynamics-365-retail-upgrade-backward-compatibility",
    title: "Dynamics 365 for Retail Upgrade – Backward compatibility",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "05 May 2019",
    excerpt:
      "A real-world retail upgrade issue where MPOS compatibility broke between v7.1 and v10, and how it was resolved.",
    content: [
      { type: "p", text: "During an upgrade from Dynamics 365 for Retail v7.1 to v10.0, one issue we encountered involved backward compatibility. Running v7.1 MPOS with v10.0 Retail Server caused the Declare Start Amount feature to fail." },
      { type: "p", text: "The cashier could enter a starting amount, but the value appeared as NaN. Retrying the operation repeated the prompt, and the issue prevented the shift from being closed." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2019/05/img_3420.jpg?resize=676%2C507", alt: "MPOS starting amount prompt" },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2019/05/img_3421-e1559095656626.jpg?resize=676%2C507", alt: "Starting amount displayed as NaN" },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2019/05/img_3422-e1559095756989.jpg?resize=676%2C711", alt: "Shift cannot be closed after the error" },
      { type: "p", text: "I debugged the MPOS and CRT code and found that the StartingAmount field had been removed from crt.ShiftsView, leaving its value undefined." },
      { type: "p", text: "The issue was reported to Microsoft. At the time of writing, a fix was expected in version 10.0.4.\n\n-Hitesh Manglani" },
    ],
  },
  {
    slug: "mpos-app-manifest-validation-error",
    title: "MPOS Build Error – App manifest validation error: The app manifest must be valid as per schema",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "01 February 2019",
    excerpt:
      "A Visual Studio and SDK troubleshooting post for MPOS build errors caused by missing deployment prerequisites.",
    content: [
      { type: "p", text: "When building the MPOS solution on my laptop, I received an APPX0501 validation error. The message said the app manifest did not match the schema and that the Publisher attribute could not be parsed." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2019/02/getimage-1.png?resize=768%2C68&ssl=1", alt: "MPOS app manifest validation error" },
      { type: "p", text: "It took a while to find the cause. Some required Visual Studio features were not installed. The Retail SDK Handbook helped identify the missing prerequisites." },
      { type: "image", src: "https://i0.wp.com/hiteshgoldeneye.com/wp-content/uploads/2019/02/visualstudiofeatures.jpg?w=342&ssl=1", alt: "Required Visual Studio features" },
      { type: "p", text: "After installing the required features and restarting the machine, the solution built successfully.\n\nHope this helps if you encounter the same error.\n\n-Hitesh Manglani" },
    ],
  },
  {
    slug: "mpos-target-platform-version-error",
    title: "MPOS Build Error: “10.0.10xxx.0” is not a supported value for TargetPlatformVersion…",
    category: "d365-commerce",
    tag: "D365-Commerce",
    date: "21 December 2018",
    excerpt:
      "A quick fix for a Windows SDK version mismatch that prevented the MPOS solution from compiling.",
    content: [
      { type: "p", text: "One error I encountered while building the MPOS solution was:" },
      { type: "quote", text: "10.0.10xxx.0 is not a supported value for TargetPlatformVersion. Please change it on the Project Property page." },
      { type: "p", text: "With help from a colleague who had seen the same issue, I found that the required version of the Windows SDK was not installed on my machine." },
      { type: "p", text: "Install the Windows SDK version indicated by the error message. For example, the required version may be 10.0.10586.0." },
      { type: "reference", label: "Windows SDK download", href: "https://go.microsoft.com/fwlink/?LinkID=798187" },
      { type: "p", text: "Hope this helps.\n\n-Hitesh Manglani" },
    ],
  },
];

const blogGrid = document.getElementById("blog-grid");
const blogReader = document.getElementById("blog-reader");
const blogSection = document.getElementById("blog");
const filterButtons = document.querySelectorAll(".filter-button");
const year = document.getElementById("year");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function renderContentBlock(block) {
  if (block.type === "p") {
    return `<p>${escapeHtml(block.text).replace(/\n/g, "<br>")}</p>`;
  }

  if (block.type === "heading") {
    return `<h3>${escapeHtml(block.text)}</h3>`;
  }

  if (block.type === "quote") {
    return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
  }

  if (block.type === "list") {
    return `<ol>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
  }

  if (block.type === "image") {
    return `<figure><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" loading="lazy"></figure>`;
  }

  if (block.type === "reference") {
    return `<p class="article-reference"><a href="${escapeHtml(block.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(block.label)} ↗</a></p>`;
  }

  return "";
}

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
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.excerpt)}</p>
          </div>
          <button class="article-link" type="button" data-post-slug="${escapeHtml(post.slug)}">Read article →</button>
        </article>
      `
    )
    .join("");
}

function showPost(post, updateUrl = true) {
  blogGrid.classList.add("hidden");
  blogReader.classList.remove("hidden");
  blogSection.classList.add("reading-post");
  document.getElementById("reader-date").textContent = post.date;
  document.getElementById("reader-tag").textContent = post.tag;
  document.getElementById("reader-title").textContent = post.title;
  document.getElementById("reader-body").innerHTML = post.content.map(renderContentBlock).join("");

  if (updateUrl) {
    history.pushState(null, "", `#post/${post.slug}`);
  }

  blogReader.focus({ preventScroll: true });
  blogReader.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showPostList() {
  blogReader.classList.add("hidden");
  blogGrid.classList.remove("hidden");
  blogSection.classList.remove("reading-post");
}

function syncPostFromUrl() {
  const match = location.hash.match(/^#post\/(.+)$/);
  const post = match && blogPosts.find((entry) => entry.slug === decodeURIComponent(match[1]));

  if (post) {
    showPost(post, false);
  } else {
    showPostList();
  }
}

blogGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-post-slug]");
  const post = button && blogPosts.find((entry) => entry.slug === button.dataset.postSlug);

  if (post) {
    showPost(post);
  }
});

blogReader.querySelector("[data-blog-back]").addEventListener("click", () => {
  history.pushState(null, "", "#blog");
  showPostList();
  blogSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

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
window.addEventListener("popstate", syncPostFromUrl);
window.addEventListener("hashchange", syncPostFromUrl);
syncPostFromUrl();
