#!/usr/bin/env node

const BASE_URL = process.env.WAITLIST_API_BASE_URL ?? "http://localhost:3000";
const ENDPOINT = `${BASE_URL.replace(/\/$/, "")}/api/request-data`;
const MODE = process.argv[2] ?? "--all";

const validPayloadBase = {
  requestType: "access",
  name: "Test User",
  details: "I would like a copy of my data.",
  website: "",
};

function makeUniqueEmail(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

async function submitPayload(payload) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body;
  try {
    body = await response.json();
  } catch {
    body = { message: await response.text() };
  }

  return { status: response.status, headers: response.headers, body };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runBasicTest() {
  const email = makeUniqueEmail("request-basic");
  console.log(`\n[Basic] Testing successful submission with ${email}`);

  const result = await submitPayload({ ...validPayloadBase, email });
  console.log(`[Basic] Status ${result.status}, code: ${result.body?.code ?? "n/a"}`);
  assert(result.status === 200, `Expected 200, got ${result.status}.`);
  assert(result.body?.code === "submitted", `Expected code 'submitted', got '${result.body?.code}'.`);

  console.log("[Basic] PASS");
}

async function runValidationTest() {
  console.log("\n[Validation] Testing input validation");

  const badEmail = await submitPayload({ ...validPayloadBase, email: "not-an-email" });
  console.log(`[Validation] Bad email -> status ${badEmail.status}`);
  assert(badEmail.status === 400, `Expected 400 for bad email, got ${badEmail.status}.`);

  const badType = await submitPayload({
    ...validPayloadBase,
    email: makeUniqueEmail("request-badtype"),
    requestType: "invalid_type",
  });
  console.log(`[Validation] Invalid request type -> status ${badType.status}`);
  assert(badType.status === 400, `Expected 400 for invalid request type, got ${badType.status}.`);

  const longDetails = await submitPayload({
    ...validPayloadBase,
    email: makeUniqueEmail("request-longdetails"),
    details: "x".repeat(501),
  });
  console.log(`[Validation] Details too long -> status ${longDetails.status}`);
  assert(longDetails.status === 400, `Expected 400 for details > 500 chars, got ${longDetails.status}.`);

  console.log("[Validation] PASS");
}

async function runRateLimitTest() {
  const email = makeUniqueEmail("request-rate");
  console.log(`\n[RateLimit] Testing per-email limiter with ${email}`);

  let saw429 = false;
  const attempts = 5;

  for (let i = 1; i <= attempts; i += 1) {
    const result = await submitPayload({ ...validPayloadBase, email });
    const retryAfter = result.headers.get("retry-after");
    console.log(
      `[RateLimit] Attempt ${i} -> status ${result.status}, code: ${result.body?.code ?? "n/a"}, retry-after: ${retryAfter ?? "n/a"}`,
    );

    if (result.status === 429) {
      saw429 = true;
      assert(result.body?.code === "rate_limited", "Expected 429 code to be 'rate_limited'.");
      assert(Boolean(retryAfter), "Expected 429 to include Retry-After header.");
      break;
    }
  }

  assert(saw429, "Expected to hit rate limit (429), but it never occurred.");
  console.log("[RateLimit] PASS");
}

async function runHoneypotTest() {
  const email = makeUniqueEmail("request-honeypot");
  console.log(`\n[Honeypot] Testing honeypot field with ${email}`);

  const result = await submitPayload({ ...validPayloadBase, email, website: "bot" });
  console.log(`[Honeypot] Status ${result.status}`);
  assert(result.status === 200, `Expected silent 200 for honeypot, got ${result.status}.`);

  console.log("[Honeypot] PASS");
}

async function main() {
  console.log(`Running data request API checks against: ${ENDPOINT}`);
  console.log("Tip: start your app first with `npm run dev`.");

  if (MODE === "--basic") {
    await runBasicTest();
    return;
  }

  if (MODE === "--validation") {
    await runValidationTest();
    return;
  }

  if (MODE === "--rate-limit") {
    await runRateLimitTest();
    return;
  }

  if (MODE === "--honeypot") {
    await runHoneypotTest();
    return;
  }

  await runBasicTest();
  await runValidationTest();
  await runHoneypotTest();
  await runRateLimitTest();
}

main().catch((error) => {
  console.error(`\nFAIL: ${error instanceof Error ? error.message : "Unknown error"}`);
  process.exitCode = 1;
});
