const previewUrl = process.env.PREVIEW_URL?.replace(/\/$/, "");

function fail(message) {
  console.error("ERROR: " + message);
  process.exit(1);
}

function ok(message) {
  console.log("OK: " + message);
}

function warn(message) {
  console.warn("WARN: " + message);
}

if (!previewUrl) {
  fail("PREVIEW_URL is required. Example: PREVIEW_URL=https://your-preview.vercel.app node scripts/smoke-preview-billing.mjs");
}

if (!previewUrl.startsWith("https://")) {
  fail("PREVIEW_URL must use https.");
}

async function readJsonSafe(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text.slice(0, 300) };
  }
}

async function checkHome() {
  const response = await fetch(previewUrl, { cache: "no-store" });

  if (!response.ok) {
    fail("Preview home failed: HTTP " + response.status);
  }

  ok("Preview home responds");
}

async function checkCreditsStatus() {
  const response = await fetch(previewUrl + "/api/credits/status", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    warn("Credits status returned HTTP " + response.status + ". This may be expected if auth/session is required.");
    return;
  }

  ok("Credits status endpoint responds");
}

async function checkCheckoutCreation() {
  const response = await fetch(previewUrl + "/api/billing/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sku: "pack_sos" }),
    cache: "no-store",
  });

  const data = await readJsonSafe(response);

  if (response.status === 503 && data?.code === "stripe_checkout_disabled") {
    fail("Checkout is disabled on preview. Missing env: " + JSON.stringify(data.missing || []));
  }

  if (!response.ok) {
    fail("Checkout creation failed: HTTP " + response.status + " " + JSON.stringify(data));
  }

  if (!data?.ok || typeof data.checkoutUrl !== "string") {
    fail("Checkout response missing checkoutUrl: " + JSON.stringify(data));
  }

  if (!data.checkoutUrl.startsWith("https://checkout.stripe.com/")) {
    fail("Checkout URL does not look like Stripe Checkout: " + data.checkoutUrl);
  }

  ok("Checkout session creation responds with Stripe Checkout URL");
}

await checkHome();
await checkCreditsStatus();
await checkCheckoutCreation();

ok("Preview billing smoke passed");
