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
      { type: "pl", text: "When we need to debug an issue in a LCS provisioned D365 FinOps Dev environment, we often need to redirect the Dev environment to Tier2. The below link is really good to refer for the steps to complete the redirect. ", label: "https://lnkd.in/dhdmxnim", href: "https://lnkd.in/dhdmxnim" },
      { type: "pl", text: "I created a set of Powershell scripts to complete the steps a little more faster ", label: "https://lnkd.in/dVTK_8c3", href: "https://lnkd.in/dVTK_8c3" },
      { type: "pl", text: "While these have been created with help from Claude Code, I have tested them and used them multiple times. Do refer the Readme file for the setup. ", label: "https://lnkd.in/d_eix9VZ", href: "https://lnkd.in/d_eix9VZ" },
      { type: "p", text: "Hope this helps" },
      { type: "p", text: "-Hitesh Manglani" },
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
      { type: "p", text: "Store Commerce Version – 9.53.25122.3 – On trying a simple customer deposit transaction, was getting this error. This was working fine a few days back on same environment, so we were not sure which config change has resulted in this error “The operation can’t be performed on a customer account deposit”." },
      { type: "image", src: "assets/blog/posts/2025-07-image-4.png", alt: "Store Commerce customer account deposit error" },
      { type: "p", text: "We knew this had to be a config issue but the question was which configuration and where. So tracing from the frontend code in Store Commerce and getting some support from Microsoft FastTrack team we got to know that there is some field MANUALCHARGECALCULATION that was involved in throwing this error." },
      { type: "p", text: "I looked up the CRT code and traced this field to the RetailFunctionalityProfile." },
      { type: "p", text: "To my surprise, this field was hidden in the Functionality Profile form and thats why it took us a long time to trace it. This flag was enabled and was causing this issue. We turned it off to resolve the error." },
      { type: "image", src: "assets/blog/posts/2025-07-image-scaled.png", alt: "Retail Functionality Profile configuration" },
      { type: "p", text: "Hope this helps." },
      { type: "p", text: "-Hitesh Manglani" },
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
      { type: "p", text: "Hi Everyone," },
      { type: "p", text: "Wishing you a Happy New Year 2022." },
      { type: "p", text: "Its been a while since I have posted on my blog but I hope to keep some momentum going forward." },
      { type: "p", text: "So the team at Microsoft Dynamics have been making some significant changes to the way we build customizations for Retail based on the feedback gathered from customers / partners. You can catch up with these changes by registering for the techtalks that are lined up by using the link below." },
      { type: "reference", label: "TechTalk Series: Commerce Extensions (dynamics.com)", href: "https://community.dynamics.com/blogs/post/?postid=a7ae4e0b-3af0-48a0-8943-9ee9d0f941c6" },
      { type: "p", text: "Hope this helps" },
      { type: "p", text: "-Hitesh Manglani" },
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
      { type: "p", text: "Upselling is one of the common requirements in Retail POS. In this post I would like to recap how this can be achieved using configuration and no code in Dynamics 365 for Operations using info codes." },
      { type: "p", text: "Info codes is quite an old feature and I thought it would be good to recap how we can use it to achieve “Upselling”." },
      { type: "p", text: "Lets say we want the cashier to remember to try to upsell a product B on purchase of a certain product A (association rules)- example to prompt cashier to ask customer if he or she would like to buy batteries with purchase of camera." },
      { type: "p", text: "The first step would be to create an infocode that will show a prompt to the cashier in the Retail POS. Infocodes can be created in Dynamics 365 in the following path- Retail and Commerce-> Channel setup -> Info codes" },
      { type: "image", src: "assets/blog/posts/2020-10-info-code-setup.png", alt: "Info Code setup" },
      { type: "p", text: "The input type of the info code can be setup as subcode buttons." },
      { type: "p", text: "The subcodes need to be setup as follows. Note the use of Trigger function and Trigger code in the setup." },
      { type: "image", src: "assets/blog/posts/2020-10-subcode-setup.png", alt: "Info Code subcode setup" },
      { type: "p", text: "The above setup means that on selecting Yes, the customer agrees to buy the product we are trying to upsell (batteries) and the product will be added to the transaction." },
      { type: "p", text: "The next part of the setup involves linking this info code to the product the cashier sells in the first place to the customer (Camera). This can be done in the released products master under Commerce tab-> Set up-> Info codes." },
      { type: "image", src: "assets/blog/posts/2020-10-released-product-setup-infocode.png", alt: "Released product Info Code setup" },
      { type: "p", text: "With the above setup in backoffice and pushed to the POS (by running the 1030 job and 1040 job), the cashier will get a prompt as shown below" },
      { type: "image", src: "assets/blog/posts/2020-10-infocode-pos-prompt.png", alt: "Info Code prompt in POS" },
      { type: "p", text: "On clicking Yes, the upsell will be done by adding the Batteries product to the transaction." },
      { type: "p", text: "Regards" },
      { type: "p", text: "Hitesh Manglani" },
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
      { type: "p", text: "End users (Operations team and Purchase) started reporting that the Purchase Order status is changing automatically without them changing anything. The environment on which this issue was reported is Platform Update 32 – 10.0.08." },
      { type: "p", text: "The purchase order status was changing from Confirmed to Approved and when Operations tried to GRN the order it caused an error –" },
      { type: "p", text: "“Purchase order is no longer confirmed. Posting of the order has been cancelled”." },
      { type: "image", src: "assets/blog/posts/2020-02-bloggrnissue.png", alt: "Purchase order is no longer confirmed error" },
      { type: "p", text: "I was trying to backtrack and check what was the code deployed in the last few packages that could have caused it, but found no code that could have caused this issue." },
      { type: "p", text: "Finally I suspected that its a bug in the standard itself. I searched LCS and found the following issue-" },
      { type: "reference", label: "https://fix.lcs.dynamics.com/Issue/Details?bugId=412804", href: "https://fix.lcs.dynamics.com/Issue/Details?bugId=412804&dbType=3&qc=42d3ca380a11a4462acb824e890db0689172d2f8766d8724f3cc6f5231393a29" },
      { type: "p", text: "If you are facing the same issue, do visit the above link and subscribe to be notified for the fix" },
      { type: "p", text: "Hope this helps" },
      { type: "p", text: "-Hitesh Manglani" },
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
      { type: "p", text: "If you are facing any issues with your Dyn365FO excel add-in please go to below link and you have done the necessary troubleshooting" },
      { type: "reference", label: "https://docs.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/office-integration/office-integration-troubleshooting", href: "https://docs.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/office-integration/office-integration-troubleshooting" },
      { type: "p", text: "If you face the following error despite following the above troubleshooting steps, please follow the remaining steps in this blog post below to unblock." },
      { type: "image", src: "assets/blog/posts/2019-10-error-in-loading-addin.png", alt: "Error loading the Excel add-in" },
      { type: "list", start: 1, items: ["Go to below link"] },
      { type: "reference", label: "https://store.office.com/addinsinstallpage.aspx?rs=en-001&assetid=WA104379629", href: "https://store.office.com/addinsinstallpage.aspx?rs=en-001&assetid=WA104379629" },
      { type: "list", start: 2, items: ["Click on Open in Excel on below prompt."] },
      { type: "image", src: "assets/blog/posts/2019-10-excel-addin-pic1.jpg", alt: "Open in Excel prompt" },
      { type: "list", start: 3, items: ["Click on Open in Excel 2016 to get below prompt"] },
      { type: "image", src: "assets/blog/posts/2019-10-excel-addin-pic2.jpg", alt: "Open in Excel 2016 prompt" },
      { type: "list", start: 4, items: ["Click Yes and the add-in should open on the right window pane within excel. Click on Add server information"] },
      { type: "image", src: "assets/blog/posts/2019-10-excel-addin-pic3.jpg", alt: "Add server information" },
      { type: "list", start: 5, items: ["Enter the url to the Dyn365FO environment. Then click Ok to receive below prompt."] },
      { type: "image", src: "assets/blog/posts/2019-10-excel-addin-pic4-1.jpg", alt: "Excel add-in sign-in prompt" },
      { type: "p", text: "Note: You may need to sign in if after clicking Yes a sign in prompt appears, else you should be able to use the add-in already." },
      { type: "p", text: "Hope this helps" },
      { type: "p", text: "-Hitesh Manglani" },
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
      { type: "p", text: "Hi All," },
      { type: "pl", text: "I was trying to familiarize with some of the nuances of the General Ledger Parameters module in Dynamics 365 for Operations using ", label: "https://mbspartner.microsoft.com/D365/CourseModules/1643", href: "https://mbspartner.microsoft.com/D365/CourseModules/1643" },
      { type: "p", text: "However it was difficult to understand the effect of setting the accounting rules option in the General Parameters – Ledger Accounting rules -> Financial Dimensions -> Values used for summary account." },
      { type: "image", src: "assets/blog/posts/2019-07-image-1.png", alt: "Ledger accounting rules, values used for summary account" },
      { type: "p", text: "The below link by Ludwig Reinhard was of great help to understand how this setting affects the posting on the liability summary account." },
      { type: "reference", label: "https://dynamicsuser.net/ax/f/developers/55997/general-ledger-parameter——-values-used-for-summary-account-ax-2012", href: "https://dynamicsuser.net/ax/f/developers/55997/general-ledger-parameter-------values-used-for-summary-account-ax-2012" },
      { type: "pl", text: "I now know another blog site that I definitely need to go through ", label: "https://dynamicsax-fico.com/author/ludwigreinhard/", href: "https://dynamicsax-fico.com/author/ludwigreinhard/" },
      { type: "p", text: "Hope this helps" },
      { type: "p", text: "-Hitesh Manglani" },
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
      { type: "p", text: "Been a while since I last posted as I was busy with upgrading our implementation from v7.1 to v10. During our upgrade from Dynamics 365 for Retail v7.1 to v10.0, one of the main issue we faced is that of Backward compatibility." },
      { type: "p", text: "The issue occurs when trying to run v7.1 MPOS with v10.0 Retail Server, basically “Declare Start Amount”feature does not work." },
      { type: "p", text: "On trying to declare the start amount the cashier gets the following prompt." },
      { type: "image", src: "assets/blog/posts/2019-05-img_3420.jpg", alt: "MPOS starting amount prompt" },
      { type: "p", text: "On trying to key in any value, the start amount results as NAN." },
      { type: "image", src: "assets/blog/posts/2019-05-img_3421-e1559095656626.jpg", alt: "Starting amount displayed as NaN" },
      { type: "p", text: "Reattempting to declare the start amount simply repeats the above prompts. Now this issue is serious since it prevents the closing of shift as shown in the screenshot below." },
      { type: "image", src: "assets/blog/posts/2019-05-img_3422-e1559095756989.jpg", alt: "Shift cannot be closed after the error" },
      { type: "p", text: "My investigation started with debugging the MPOS code and eventually the CRT code, and I found that one of the fields “StartingAmount” had been removed from crt.ShiftsView. This was causing its value to stay as undefined." },
      { type: "p", text: "The good news is that issue is reported to Microsoft, and we are currently awaiting the fix (currently expected in v10.0.4)" },
      { type: "p", text: "-Hitesh Manglani" },
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
      { type: "p", text: "When trying to build the MPOS solution on my laptop, I got the below error." },
      { type: "image", src: "assets/blog/posts/2019-02-getimage-1.png", alt: "MPOS app manifest validation error" },
      { type: "p", text: "Error APPX0501 Validation error. error C00CE169: App manifest validation error: The app manifest must be valid as per schema: Line 10, Column 50, Reason: —————‘ violates pattern constraint of ‘(CN|L|O|OU|E|C|S|STREET|T|G|I|SN|DC|SERIALNUMBER|Description|PostalCode|POBox|Phone|X21Address|dnQualifier|(OID\\.(0|[1-9][0-9]*)(\\.(0|[1-9][0-9]*))+))=(([^,+=”<>#;])+|”.*”)(,((CN|L|O|OU|E|C|S|STREET|T|G|I|SN|DC|SERIALNUMBER|Description|PostalCode|POBox|Phone|X21Address|dnQualifier|(OID\\.(0|[1-9][0-9]*)(\\.(0|[1-9][0-9]*))+))=(([^,+=”<>#;])+|”.*”)))*’. The attribute ‘Publisher’ with value ————- failed to parse. Pos.App ” 1" },
      { type: "p", text: "App manifest validation error: The app manifest must be valid as per schema: Line 10, Column SO, Reason: ‘xxxx’ violates pattern constraint of ‘(CNILIOIOUIEICISISTREETITIGIIISNIDCI((CNILIOIOUIEICISISTREETITIGIIISNIDCISERIALNUM8ERIDescriptionPostalCodeP080xIPhoneIX21 . The attribute ‘Publisher’ with value ‘xxx’ failed to parse." },
      { type: "p", text: "It took me a while to figure it out but this was happening because certain features in Visual Studio were not installed, the Retail SDK Handbook helped me to confirm which features were needed to be installed. After installing the highlighted features, I restarted the machine and the solution built successfully." },
      { type: "image", src: "assets/blog/posts/2019-02-visualstudiofeatures.jpg", alt: "Required Visual Studio features" },
      { type: "p", text: "Hope this helps, if someone meets the same error." },
      { type: "p", text: "-Hitesh Manglani" },
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
      { type: "p", text: "One of the errors I encountered recently when building the MPOS solution is the below error" },
      { type: "p", text: "“10.0.10xxx.0” is not a supported value for TargetPlatformVersion. Please change it on the Project Property page." },
      { type: "p", text: "I learnt the reason for this after quite some time and with the help of a colleague who faced the same issue, was that , the needed version of Windows SDK was not installed on my machine." },
      { type: "p", text: "If you get the same error just use the below link to install the right version of the Windows SDK based on the error message." },
      { type: "reference", label: "http://go.microsoft.com/fwlink/?LinkID=798187", href: "https://go.microsoft.com/fwlink/?LinkID=798187" },
      { type: "p", text: "For instance if it could be 10.0.10586.0." },
      { type: "p", text: "Hope this helps." },
      { type: "p", text: "-Hitesh Manglani" },
    ],
  },
];

const blogGrid = document.getElementById("blog-grid");
const blogReader = document.getElementById("blog-reader");
const blogSection = document.getElementById("blog");
const filterButtons = document.querySelectorAll(".filter-button");
const year = document.getElementById("year");
let activeFilter = "all";

const legacyPostRoutes = new Map([
  ["powershell-scripts-to-simplify-ji-access-redirecting-dev-to-tier2-environment", "powershell-jit-tier2-redirect"],
  ["resolving-operation-cant-be-performed-error-in-store-commerce", "store-commerce-customer-deposit-error"],
  ["commerce-extensions-techtalks", "commerce-extensions-techtalks"],
  ["upselling-info-codes-configuration-recap", "upselling-info-codes-configuration"],
  ["purchase-order-status-changing-automatically", "purchase-order-status-changing"],
  ["dyn365fo-excel-add-in-issues-troubleshooting", "dyn365fo-excel-add-in-troubleshooting"],
  ["general-ledger-parameters-ledger-accounting-rules", "general-ledger-accounting-rules"],
  ["dynamics-365-for-retail-upgrade-backward-compatibility", "dynamics-365-retail-upgrade-backward-compatibility"],
  ["mpos-solution-build-error-app-manifest-validation-error-the-app-manifest-must-be-valid-as-per-schema", "mpos-app-manifest-validation-error"],
  ["mpos-build-error-10-0-10xxx-0-is-not-a-supported-value-for-targetplatformversion", "mpos-target-platform-version-error"],
]);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function decodeHtml(value) {
  const documentFragment = new DOMParser().parseFromString(String(value), "text/html");
  return documentFragment.body.textContent || "";
}

function mapLegacyArticleUrl(value) {
  let url;
  try {
    url = new URL(value, "https://hiteshgoldeneye.com");
  } catch {
    return null;
  }

  if (url.hostname !== "hiteshgoldeneye.com" && url.hostname !== "www.hiteshgoldeneye.com") {
    return null;
  }

  const legacySlug = decodeURIComponent(url.pathname.replace(/^\/+|\/+$/g, ""));
  const localSlug = legacyPostRoutes.get(legacySlug);
  return localSlug ? `#post/${localSlug}` : null;
}

function sanitizeLegacyHtml(html, mediaMap = {}) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const allowedTags = new Set([
    "a", "b", "blockquote", "br", "caption", "code", "div", "em", "figcaption",
    "figure", "h2", "h3", "h4", "hr", "i", "img", "li", "ol", "p", "pre",
    "span", "strong", "table", "tbody", "td", "th", "thead", "tr", "u", "ul",
  ]);
  const droppedTags = new Set(["script", "style", "iframe", "object", "embed", "form", "input", "button"]);

  function localizeMediaUrl(value) {
    let url;
    try {
      url = new URL(value, location.origin);
    } catch {
      return value;
    }

    const marker = "/wp-content/uploads/";
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex < 0) return value;

    const uploadPath = decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
    return mediaMap[uploadPath] || value;
  }

  function serialize(node) {
    if (node.nodeType === 3) return escapeHtml(node.nodeValue);
    if (node.nodeType !== 1) return "";

    const tag = node.tagName.toLowerCase();
    if (droppedTags.has(tag)) return "";

    if (tag === "img") {
      const source = localizeMediaUrl(node.getAttribute("src") || "");
      if (!/^https?:\/\//i.test(source) && !/^assets\//.test(source)) return "";
      return `<img src="${escapeHtml(source)}" alt="${escapeHtml(node.getAttribute("alt") || "")}" loading="lazy">`;
    }

    const children = Array.from(node.childNodes, serialize).join("");
    if (!allowedTags.has(tag)) return children;

    if (tag === "a") {
      const rawHref = node.getAttribute("href") || "";
      const localHref = mapLegacyArticleUrl(rawHref);
      if (localHref) return `<a href="${escapeHtml(localHref)}">${children}</a>`;

      const href = localizeMediaUrl(rawHref);
      if (!/^https?:\/\//i.test(href) && !/^assets\//.test(href) && !href.startsWith("#")) return children;
      const external = /^https?:\/\//i.test(href) && !href.startsWith(location.origin);
      return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${children}</a>`;
    }

    if (tag === "br" || tag === "hr") return `<${tag}>`;
    return `<${tag}>${children}</${tag}>`;
  }

  return Array.from(parsed.body.childNodes, serialize).join("");
}

function renderContentBlock(block, post) {
  if (block.type === "html") {
    return sanitizeLegacyHtml(block.html, post.mediaMap);
  }

  if (block.type === "p") {
    return `<p>${escapeHtml(block.text).replace(/\n/g, "<br>")}</p>`;
  }

  if (block.type === "heading") {
    return `<h3>${escapeHtml(block.text)}</h3>`;
  }

  if (block.type === "quote") {
    return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
  }

  if (block.type === "pl") {
    const link = `<a href="${escapeHtml(block.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(block.label)}</a>`;
    return `<p>${escapeHtml(block.text).replace(/\n/g, "<br>")}${link}</p>`;
  }

  if (block.type === "list") {
    return `<ol start="${Number(block.start) || 1}">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
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
  document.getElementById("reader-body").innerHTML = post.content.map((block) => renderContentBlock(block, post)).join("");

  if (updateUrl) {
    history.pushState(null, "", `#post/${post.slug}`);
  }

  blogReader.focus({ preventScroll: true });
  blogSection.scrollIntoView({ behavior: "smooth", block: "start" });
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
    activeFilter = button.dataset.filter;
    renderPosts(activeFilter);
  });
});

if (year) {
  year.textContent = new Date().getFullYear();
}

renderPosts();
window.addEventListener("popstate", syncPostFromUrl);
window.addEventListener("hashchange", syncPostFromUrl);
syncPostFromUrl();

fetch("assets/blog/archive.json?v=20261023")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load the archived articles");
    return response.json();
  })
  .then(({ posts }) => {
    const knownSlugs = new Set(blogPosts.map((post) => post.slug));

    posts.forEach((post) => {
      legacyPostRoutes.set(post.legacySlug || post.slug, post.slug);
      if (knownSlugs.has(post.slug)) return;

      const excerptText = decodeHtml(post.excerptHtml).replace(/\s+/g, " ").trim();
      const bodyText = decodeHtml(post.contentHtml).replace(/\s+/g, " ").trim();
      blogPosts.push({
        slug: post.slug,
        title: decodeHtml(post.title),
        category: post.category,
        tag: post.tag,
        date: post.date,
        excerpt: excerptText || bodyText.slice(0, 220) || "This original archive entry has no saved article body.",
        mediaMap: post.mediaMap,
        content: [{
          type: "html",
          html: post.contentHtml || "<p>The original WordPress entry has no saved body text.</p>",
        }],
      });
    });

    renderPosts(activeFilter);
    syncPostFromUrl();
  })
  .catch((error) => console.error(error));
