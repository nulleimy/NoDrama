import { qualityGate } from "../lib/qa/qualityGate.js";

const test = await qualityGate("Nestíhám.", { language: "cs", category: "work" });

if (!test.final) {
  console.error("QA failed");
  process.exit(1);
}

console.log("QA engine working");
