const blogPosts = [
  {
    slug: "understanding-three-tier-architecture",
    title: "Understanding 3-Tier Architecture: What Actually Happens Behind the Scenes?",
    category: "strategy",
    tag: "Strategy",
    date: "25 October 2026",
    excerpt:
      "Follow one order from a button click to a database row and back, and see where validation, security, transactions and retries belong, with a Dynamics 365 Commerce mapping.",
    content: [
      {"type": "html", "html": "<p>Three-tier architecture is usually explained as UI → business logic → database. That summary is correct, but it hides almost everything that goes wrong in real systems. Bugs rarely live inside a tier. They live at the boundaries between tiers, where data is serialized, validated, authorized, retried and committed.</p><p>This article follows one order request from a button click to a database row and back, and points out where each concern belongs and what fails if you put it in the wrong place. Near the end, I map the same flow onto Dynamics 365 Commerce, where the tiers are easy to see once you know where to look.</p><h3>Layers and tiers are not the same thing</h3><p>The two words get used interchangeably, and that causes real confusion, so let's fix the vocabulary first.</p><ul><li>A <strong>layer</strong> is a logical separation of responsibility inside your code: presentation, business logic and data access.</li><li>A <strong>tier</strong> is a separately deployed part of the system: a browser or device, an application server, a database server.</li></ul><p>Three layers do not require three servers. A small application can run its UI, API and business code in one deployable while the database lives on its own server. The logical boundaries still matter, because they are what let you test, change and eventually split the system without a rewrite.</p>"},
      {"type": "image", "src": "assets/blog/posts/2026-10-three-tier-layers-vs-tiers.png", "alt": "Diagram: three layers (presentation, business, data) shown deployed as two parts or three, with cross-cutting concerns across all."},
      {"type": "html", "html": "<p>The layers stay the same whether they are deployed as two parts or three. Security, validation, error handling, logging and the other cross-cutting concerns apply to all of them.</p><p>From here on, I use \"layer\" for the logical split and \"tier\" when I mean deployment.</p><h3>The three layers</h3><ul><li><strong>Presentation layer.</strong> Web, mobile, desktop or POS interfaces. It collects input, manages presentation state and shows results. It expresses intent (\"place this order\") and does not make business decisions.</li><li><strong>Business layer.</strong> Application services that apply the rules: order validation, pricing, discounts, tax, inventory checks and orchestration of multi-step processes.</li><li><strong>Data layer.</strong> Repositories or data-access components, and the database behind them. It persists and retrieves customers, products, inventory and orders.</li></ul><p>A common point of confusion is where the API or controller sits. In a server-rendered MVC application, the controller is part of the presentation layer. In a single-page or mobile app, the UI runs on the client and the API belongs to the application tier. Decide which model you are in before you decide where validation and mapping live.</p><h3>Following one request</h3><p>A customer chooses a product and a quantity, then selects <strong>Place Order</strong>. Here is what happens.</p>"},
      {"type": "image", "src": "assets/blog/posts/2026-10-three-tier-request-path.png", "alt": "Diagram: the request path from client through edge, API, business service, repository and database, with where each step can fail."},
      {"type": "html", "html": "<p>The business service (highlighted) makes the decisions. The response returns up the same path, and each boundary turns its failures into a clear status code instead of leaking internals.</p><h4>1. The client sends intent, not facts</h4><p>The client sends only what it legitimately knows:</p>"},
      {"type": "code", "text": "{\n  \"productId\": 5001,\n  \"quantity\": 2\n}"},
      {"type": "html", "html": "<p>It does not send the price, the total or the customer's identity. A client can be modified, replayed or replaced by a script, so anything it supplies is a claim, not a fact. The request also carries an idempotency key (more on that below) and an authentication token.</p><h4>2. The edge terminates TLS and routes the request</h4><p>The request travels over HTTPS to a load balancer, web application firewall or API gateway, which forwards it to one of several identical application instances. Those instances should be stateless, so any of them can serve any request. This is what lets the application tier scale horizontally. A correlation ID is generated here and attached to the request, so that every log line from every tier can be tied back to this one order.</p><h4>3. The API deserializes and validates the shape</h4><p>The API turns the JSON into a request object and checks its shape: <code>productId</code> is present, <code>quantity</code> is an integer, the payload is within size limits. Malformed input is rejected immediately with a clear error.</p><h4>4. Authentication and authorization</h4><p>Authentication establishes who is calling. The customer's identity comes from the verified token, never from the request body. Authorization then asks a narrower question: may this caller perform this action on this specific resource? Checking only that someone is logged in, and not that they own the account they are ordering for, is one of the most common API security flaws.</p><h4>5. The business layer decides</h4><p>This is where the rules run. The service checks that the customer is eligible and the product is active, reserves stock, calculates price, discounts and tax from server-side data, and creates the order. A thin controller calling a focused service keeps this readable:</p>"},
      {"type": "code", "text": "[HttpPost(\"orders\")]\npublic async Task<IActionResult> Create(\n    CreateOrderRequest req,\n    [FromHeader(Name = \"Idempotency-Key\")] string key)\n{\n    var customerId = User.GetCustomerId();  // from the token, never the body\n    var result = await _orders.PlaceAsync(customerId, req.ProductId, req.Quantity, key);\n\n    return result.IsSuccess\n        ? CreatedAtAction(nameof(Get), new { id = result.Order.Id }, result.Order)\n        : Problem(result.Error.Title, statusCode: result.Error.Status);\n}"},
      {"type": "html", "html": "<p>The controller translates between HTTP and the application. It contains no pricing or stock logic. That separation is what makes the rules testable without starting a web server.</p><p>The <code>_orders</code> service reaches the controller through <strong>dependency injection</strong>: the framework supplies it, instead of the controller constructing its own. In turn, the service depends on a repository interface rather than a concrete database class, so tests can substitute a fake. Add a repository only where it creates a useful boundary. If your framework's data-access abstraction already does that job, a generic repository on top is ceremony.</p><h4>6. The data layer persists, atomically</h4><p>The repository reads and writes the records. The step that deserves the most care is the stock reservation. A naive version reads the stock level, checks it in code, then writes the new value. Two concurrent orders can both pass the check and oversell the item, because the read and the write are separate steps. Make the check and the update a single atomic operation:</p>"},
      {"type": "code", "text": "UPDATE Inventory\nSET    Reserved = Reserved + @qty\nWHERE  ProductId = @productId\n  AND  (OnHand - Reserved) >= @qty;\n-- 0 rows affected means insufficient stock: return a conflict"},
      {"type": "html", "html": "<p>Optimistic concurrency with a row version works too. What matters is that the database, not application code, is the arbiter of the race.</p><p>The order lines should also store a <strong>snapshot</strong> of the unit price and tax computed at order time. If the catalogue changes tomorrow, yesterday's orders must not change with it.</p><h4>7. The response travels back</h4><p>On success, the server builds a response object, serializes it, and returns <code>201 Created</code>:</p>"},
      {"type": "code", "text": "{\n  \"orderId\": 12345,\n  \"status\": \"Confirmed\",\n  \"total\": { \"amount\": 1999.00, \"currency\": \"INR\" }\n}"},
      {"type": "html", "html": "<p>The UI uses this to show a confirmation. It does not need to know which repository, database or pricing component produced it. That ignorance is the whole point of the architecture.</p><h3>Contracts, DTOs and serialization</h3><p>Serialization turns an in-memory object into a representation that can cross a process or network boundary, and deserialization reverses it. A normal method call between two classes in the same process needs neither.</p>"},
      {"type": "image", "src": "assets/blog/posts/2026-10-three-tier-request-contract.png", "alt": "Diagram: client object serialized to a wire format, deserialized to a server DTO, validated and mapped to the domain model."},
      {"type": "html", "html": "<p>Only the wire format is shared. Each side owns its own objects and maps to them at the boundary, so neither depends on the other's internals.</p><p>The <strong>API contract</strong> is the agreement between client and server: field names, types, required and optional values, response shape, error format and version behavior. Two practices keep contracts healthy:</p><ul><li><strong>Use Data Transfer Objects (DTOs) at the boundary.</strong> A <code>CreateOrderRequest</code> exposes only <code>productId</code> and <code>quantity</code>. Never bind an incoming payload directly to a database entity. Entities carry internal state, persistence details and sometimes security fields (password hashes, role flags) that clients must neither see nor control. Validate the DTO, then map it to the application model.</li><li><strong>Plan for change.</strong> Adding an optional field is usually compatible. Renaming or removing one breaks older clients. Version your API or adopt an explicit compatibility policy, and keep the error format stable.</li></ul><p>The format itself is an implementation choice: JSON for most REST APIs, XML for some SOAP services, Protocol Buffers with gRPC. Pick one clients can consume reliably.</p><h3>Validation and security belong on the server</h3><p>Client-side validation improves the user experience, and nothing more. Another client can call your API directly, so the server must check everything again, in three separate steps:</p><ul><li><strong>Shape validation:</strong> the fields exist, have the right types and respect size limits.</li><li><strong>Business validation:</strong> the product is active, stock is available, the customer is eligible.</li><li><strong>Authorization:</strong> the authenticated caller may act on this specific account and resource.</li></ul><p>Keeping the three separate keeps the error responses precise: a malformed request, a business rule violation and a forbidden action are different failures and deserve different status codes.</p><h3>When things go wrong</h3><h4>Errors</h4><p>Handle each failure at the boundary that can respond safely. Return a stable error code and a clear message to the caller, and record the diagnostic detail internally. Never expose raw database exceptions, stack traces or connection strings, and never swallow an error silently. A standard format such as RFC 9457 problem details keeps clients simple:</p>"},
      {"type": "code", "text": "{\n  \"type\": \"https://example.com/problems/insufficient-stock\",\n  \"title\": \"Insufficient stock\",\n  \"status\": 409,\n  \"detail\": \"Requested quantity is not available.\",\n  \"traceId\": \"4f1c9a2e\"\n}"},
      {"type": "html", "html": "<p>The <code>traceId</code> is the correlation ID from step 2. It lets a customer or support agent quote one value and lets you find every related log entry.</p><h4>Transactions</h4><p>When the order header, order lines and stock reservation must succeed or fail together, wrap them in one database transaction. Keep that transaction short. A payment provider is outside it: never hold database locks while waiting on a network call. Record the order in a pending state, call the provider, then complete or compensate the order based on the result.</p><h4>Retries and idempotency</h4><p>Imagine the server creates the order, but the response is lost and the client times out. The client retries. Without protection, you now have two orders, or two charges.</p><p>The fix is an <strong>idempotency key</strong>: the client generates a unique value per logical operation and sends it with every attempt. The server stores the key in a column with a unique index, together with the result. A repeated request returns the stored result instead of creating a second order, and the unique index makes concurrent duplicates fail safely rather than race.</p><h4>Connections</h4><p>Open a database connection late, do the work, and release it promptly so the pool can reuse it. Pooling is efficient, but it needs sensible limits, timeouts and handling of transient failures, or one slow dependency can exhaust every connection.</p><h3>What the infrastructure adds</h3><p>So far this has been mostly about layers. The tier view adds its own benefits:</p><ul><li><strong>Scaling.</strong> Stateless application instances behind a load balancer scale out; the database usually scales up or uses replicas.</li><li><strong>Security.</strong> The database sits in a private network and accepts connections only from the application tier. Clients never reach it directly.</li><li><strong>Fault isolation.</strong> A failing web tier should not corrupt data, and a slow database should be contained by timeouts rather than freezing every request.</li></ul><p>Some concerns cut across all of it: caching, queues, logging, metrics, tracing and configuration.</p><ul><li>Caches need deliberate expiry and invalidation rules.</li><li>Queues suit long-running work and let the API return <code>202 Accepted</code>, but they introduce duplicate delivery, ordering and retry concerns, so consumers must be idempotent too.</li><li>Logs and traces must never capture secrets or sensitive customer data.</li></ul><h3>Seeing it in Dynamics 365 Commerce</h3><p>Dynamics 365 Commerce is a good real-world illustration, and the mapping is roughly this:</p><ul><li><strong>Presentation:</strong> the POS (Store Commerce or Cloud POS) and the e-commerce storefront.</li><li><strong>Application:</strong> Retail Server and the Commerce Runtime (CRT), which hold the business logic. Customizations extend it through CRT request handlers and triggers, which is exactly where pricing, discount and validation rules are meant to live, not in the POS UI.</li><li><strong>Data:</strong> the channel database, with Headquarters (Finance and Operations) as the system of record. Commerce Data Exchange (CDX) distribution jobs move data between them.</li></ul>"},
      {"type": "image", "src": "assets/blog/posts/2026-10-three-tier-d365-commerce-layers.png", "alt": "Diagram: D365 Commerce POS, Retail Server with CRT, channel database, offline database and Headquarters."},
      {"type": "html", "html": "<p>Customizations belong in the highlighted layer. The offline database and the CDX jobs are where the tier boundaries become visible in practice.</p><p>Two behaviors make the tier boundaries visible. First, the POS talks to Retail Server over the network, and when that link breaks, the POS can switch to offline mode with a local database and synchronize later. The network boundary is real, and it fails. Second, if you customize a CRT entity or trigger, you are changing the business layer, and the POS and the channel database both feel it. Knowing which layer owns a rule tells you where to put the fix.</p><h3>When should a layer become its own service?</h3><p>Start with clear module boundaries inside one deployable application. Split a layer into a separately deployed service only when there is a concrete need:</p><ul><li>independent scaling,</li><li>a distinct security boundary,</li><li>separate release ownership, or</li><li>fault isolation.</li></ul><p>Every network boundary you add brings latency, monitoring, retries, versioned contracts and new failure modes. Splitting should solve a real operational or organizational problem, not satisfy a diagram.</p><h3>Key takeaways</h3><ul><li>Layers are logical, tiers are deployment. Use each word for one thing only.</li><li>The client sends intent. The server decides prices, identity and outcomes.</li><li>Validate shape, business meaning and authorization separately, always on the server.</li><li>Make stock checks and updates atomic, and let the database settle races.</li><li>Keep transactions short, and keep external calls such as payments outside them.</li><li>Use idempotency keys so a retry never creates a duplicate.</li><li>Return stable, safe error responses with a correlation ID.</li><li>Split a layer into a service only when a concrete need justifies the cost.</li></ul><p>Three-tier architecture is not valuable because it has three boxes. It is valuable because each boundary is an explicit place to validate, authorize, limit and observe. Get those boundaries right, and each part of the system can change without dragging the others along.</p><p><em>Working on a D365 Commerce implementation, upgrade or integration? Get in touch via the contact section of this site.</em></p>"},
    ],
  },
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
  return localSlug ? `/blog/${localSlug}/` : null;
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

  if (block.type === "diagram") {
    return renderArchitectureDiagram(block.name);
  }

  if (block.type === "code") {
    return `<pre class="reader-code"><code>${escapeHtml(block.text)}</code></pre>`;
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

function renderArchitectureDiagram(name) {
  const diagrams = {
    tiers: {
      title: "The three logical tiers",
      caption: "Each tier has a distinct responsibility; deployment can still use fewer or more physical machines.",
      orientation: "horizontal",
      nodes: [
        { eyebrow: "Tier 1", title: "Presentation", detail: "Web · Mobile · Desktop · POS", tone: "blue" },
        { eyebrow: "Tier 2", title: "Business logic", detail: "Rules · Services · Orchestration", tone: "green" },
        { eyebrow: "Tier 3", title: "Data", detail: "Repositories · Databases", tone: "gold" },
      ],
    },
    serialization: {
      title: "Serialization across an API boundary",
      caption: "The client and server share a contract, not an in-memory object; the response is serialized back in the opposite direction.",
      orientation: "horizontal",
      banner: "Example contract: productId (integer) · quantity (positive integer) · versioned API",
      nodes: [
        { eyebrow: "Client object", title: "OrderRequest", detail: "productId: 5001 · quantity: 2", tone: "blue" },
        { eyebrow: "Wire format", title: "JSON over HTTPS", detail: "Serialize for transport", tone: "gold" },
        { eyebrow: "Server DTO", title: "CreateOrderRequest", detail: "Deserialize · validate · map to application model", tone: "green" },
      ],
    },
    request: {
      title: "Order request and response path",
      caption: "The response travels back up the same application boundaries after the order is processed.",
      orientation: "vertical",
      nodes: [
        { eyebrow: "Intent", title: "User", detail: "Chooses product and quantity", tone: "blue" },
        { eyebrow: "Tier 1", title: "UI", detail: "Collects input and presents results", tone: "blue" },
        { eyebrow: "Boundary", title: "API / Controller", detail: "HTTPS · Deserialize · Validate", tone: "gold" },
        { eyebrow: "Tier 2", title: "Business services", detail: "Authorize · Price · Check stock · Create order", tone: "green" },
        { eyebrow: "Boundary", title: "Repository / Data access", detail: "Queries and persistence", tone: "gold" },
        { eyebrow: "Tier 3", title: "Database", detail: "Orders · Products · Inventory", tone: "blue" },
      ],
    },
    "cross-cutting": {
      title: "Concerns that cross the tiers",
      caption: "Apply these deliberately across boundaries rather than treating them as the responsibility of only one tier.",
      orientation: "horizontal",
      banner: "Security · Validation · Error handling · Logging · Metrics · Tracing · Configuration",
      nodes: [
        { eyebrow: "Tier 1", title: "Presentation", detail: "User experience", tone: "blue" },
        { eyebrow: "Tier 2", title: "Business logic", detail: "Rules and workflows", tone: "green" },
        { eyebrow: "Tier 3", title: "Data", detail: "Persistence", tone: "gold" },
      ],
    },
  };
  const diagram = diagrams[name];
  if (!diagram) return "";

  const nodes = diagram.nodes.map((node, index) => {
    const separator = index === 0
      ? ""
      : `<span class="diagram-arrow" aria-hidden="true">${diagram.orientation === "vertical" ? "↓" : "→"}</span>`;
    return `${separator}<div class="diagram-node diagram-node--${node.tone}"><span>${escapeHtml(node.eyebrow)}</span><strong>${escapeHtml(node.title)}</strong><p>${escapeHtml(node.detail)}</p></div>`;
  }).join("");

  return `<figure class="architecture-diagram architecture-diagram--${diagram.orientation}${diagram.banner ? " architecture-diagram--cross-cutting" : ""}" role="group" aria-label="${escapeHtml(diagram.title)}">${diagram.banner ? `<div class="diagram-banner">${escapeHtml(diagram.banner)}</div>` : ""}<div class="diagram-flow diagram-flow--${diagram.orientation}">${nodes}</div><figcaption>${escapeHtml(diagram.caption)}</figcaption></figure>`;
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
          <a class="article-link" href="/blog/${escapeHtml(post.slug)}/">Read article →</a>
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
    // Legacy hash links now live at real, crawlable URLs.
    location.replace(`/blog/${post.slug}/`);
  } else {
    showPostList();
  }
}

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

fetch("assets/blog/archive.json?v=20261025")
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
