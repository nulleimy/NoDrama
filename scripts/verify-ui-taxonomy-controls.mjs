import { readFileSync } from "node:fs";

import {
  publicGeneratorTaxonomyControls,
  publicGeneratorTaxonomySourceIds,
} from "../lib/nodrama/uiTaxonomyControls.mjs";
import {
  lockedChannelTaxonomyV2,
  lockedRelationshipTaxonomyV2,
  lockedStrategyTaxonomyV2,
} from "../lib/nodrama/taxonomySchemaV2.mjs";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function uniqueIds(items) {
  return new Set(items.map((item) => item.id));
}

function extractLockedToneIds() {
  const source = readFileSync("lib/nodrama/tonePresets.ts", "utf8");
  return [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
}

const lockedIdsByGroup = {
  tone: new Set(extractLockedToneIds()),
  relationship: uniqueIds(lockedRelationshipTaxonomyV2),
  channel: uniqueIds(lockedChannelTaxonomyV2),
  strategy: uniqueIds(lockedStrategyTaxonomyV2),
};

const allowedLegacyValuesByGroup = {
  tone: new Set(["Milý", "Asertivní", "Formální", "Vtipný"]),
  relationship: new Set(["Kamarádi", "Práce", "Rodina", "Randění"]),
  channel: new Set(["WhatsApp", "SMS", "E-mail", "Slack"]),
  strategy: lockedIdsByGroup.strategy,
};

for (const group of ["tone", "relationship", "channel", "strategy"]) {
  const options = publicGeneratorTaxonomyControls[group];

  if (!Array.isArray(options) || options.length !== 8) {
    fail(`${group} selector must expose exactly 8 options.`);
  }

  const optionIds = uniqueIds(options);

  if (optionIds.size !== 8) {
    fail(`${group} selector contains duplicate IDs.`);
  }

  const sourceIds = new Set(publicGeneratorTaxonomySourceIds[group]);

  if (sourceIds.size !== 8) {
    fail(`${group} source taxonomy must expose exactly 8 IDs.`);
  }

  for (const option of options) {
    if (!lockedIdsByGroup[group].has(option.id)) {
      fail(`${group} option is not a locked taxonomy ID: ${option.id}`);
    }

    if (!sourceIds.has(option.id)) {
      fail(`${group} option is missing from source IDs: ${option.id}`);
    }

    if (!option.label?.cs || !option.label?.en) {
      fail(`${group} option must include CZ/EN labels: ${option.id}`);
    }

    if (!allowedLegacyValuesByGroup[group].has(option.legacyValue)) {
      fail(`${group} option has invalid legacy mapping: ${option.id}`);
    }
  }
}

console.log("OK: Public generator UI taxonomy controls verified");
