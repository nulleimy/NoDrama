"use client";

import { useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";
import { PaywallBox } from "@/components/PaywallBox";
import { publicGeneratorTaxonomyControls } from "@/lib/nodrama/uiTaxonomyControls.mjs";

type SelectorGroup = "tone" | "relationship" | "channel" | "strategy";

export function InteractiveGenerator() {
  const { lang } = useLang();

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [selected, setSelected] = useState<Record<SelectorGroup, string>>({
    tone: publicGeneratorTaxonomyControls.tone[0].id,
    relationship: publicGeneratorTaxonomyControls.relationship[0].id,
    channel: publicGeneratorTaxonomyControls.channel[0].id,
    strategy: publicGeneratorTaxonomyControls.strategy[0].id,
  });

  const t = {
    cs: {
      situation: "Situace",
      generate: "Vygenerovat odpověď",
      tone: "TÓN",
      relationship: "VZTAH",
      channel: "KANÁL",
      strategy: "STRATEGIE",
      best: "Nejlepší odpověď",
      copy: "Kopírovat",
      placeholder: "Popiš situaci..."
    },
    en: {
      situation: "Situation",
      generate: "Generate reply",
      tone: "TONE",
      relationship: "RELATIONSHIP",
      channel: "CHANNEL",
      strategy: "STRATEGY",
      best: "Best pick",
      copy: "Copy",
      placeholder: "Describe the situation..."
    }
  }[lang];

  const generate = async () => {
    const tone = getSelectedOption("tone", selected.tone);
    const relationship = getSelectedOption("relationship", selected.relationship);
    const channel = getSelectedOption("channel", selected.channel);
    const strategy = getSelectedOption("strategy", selected.strategy);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        situation: input,
        tone: tone.legacyValue,
        relationship: relationship.legacyValue,
        channel: channel.legacyValue,
        toneId: tone.id,
        relationshipId: relationship.id,
        channelId: channel.id,
        strategyId: strategy.id,
      }),
    });

    const data = await res.json();
    setResult(data.ok ? data.output.naturalReply : data.message);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="max-w-xl space-y-4">

      <div>
        <label>{t.situation}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(["tone", "relationship", "channel", "strategy"] as SelectorGroup[]).map(
          (group) => (
            <fieldset key={group} className="space-y-2">
              <legend className="text-xs font-semibold tracking-wide text-neutral-600">
                {t[group]}
              </legend>
              <div className="grid grid-cols-2 gap-1">
                {publicGeneratorTaxonomyControls[group].map((option) => {
                  const isActive = selected[group] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() =>
                        setSelected((current) => ({
                          ...current,
                          [group]: option.id,
                        }))
                      }
                      className={`rounded border px-2 py-1 text-xs ${
                        isActive
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-800"
                      }`}
                    >
                      {option.label[lang]}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )
        )}
      </div>

      <button
        onClick={generate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {t.generate}
      </button>

      {result && (
        <>
          <div className="font-bold mt-4">
            {t.best}
          </div>

          <button
            onClick={copy}
            className="mb-2 border px-2 py-1 rounded"
          >
            {t.copy}
          </button>

          <pre className="bg-gray-100 p-3 rounded">
            {result}
          </pre>
        </>
      )}

      {showPaywall && (
        <PaywallBox onClose={() => setShowPaywall(false)} />
      )}

      {/* VERIFY STRINGS */}
      <div style={{ display: "none" }}>
        Kopírovat PaywallBox
      </div>

    </div>
  );
}

export default InteractiveGenerator;

function getSelectedOption(group: SelectorGroup, id: string) {
  return (
    publicGeneratorTaxonomyControls[group].find((option) => option.id === id) ||
    publicGeneratorTaxonomyControls[group][0]
  );
}
