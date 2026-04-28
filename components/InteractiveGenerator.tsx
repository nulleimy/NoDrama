"use client";

import { useState } from "react";
import { useLang } from "@/components/i18n/LanguageProvider";
import { PaywallBox } from "@/components/PaywallBox";

export function InteractiveGenerator() {
  const { lang } = useLang();

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  const t = {
    cs: {
      situation: "Situace",
      generate: "Vygenerovat odpověď",
      best: "Nejlepší odpověď",
      copy: "Kopírovat",
      placeholder: "Popiš situaci...",
    },
    en: {
      situation: "Situation",
      generate: "Generate reply",
      best: "Best pick",
      copy: "Copy",
      placeholder: "Describe the situation...",
    },
  }[lang];

  const generate = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        situation: input,
        tone: "friendly",
        relationship: "friend",
        channel: "messenger_1to1",
        strategy: "soft_decline",
        language: lang,
      }),
    });

    const data = await res.json();
    setResult(data?.enterprise?.topExample ?? data?.output?.strongReply ?? data?.text ?? "");
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

      <button onClick={generate} className="bg-black text-white px-4 py-2 rounded">
        {t.generate}
      </button>

      {result && (
        <>
          <div className="font-bold mt-4">{t.best}</div>

          <button onClick={copy} className="mb-2 border px-2 py-1 rounded">
            {t.copy}
          </button>

          <pre className="bg-gray-100 p-3 rounded">{result}</pre>
        </>
      )}

      {showPaywall && <PaywallBox onClose={() => setShowPaywall(false)} />}
    </div>
  );
}

export default InteractiveGenerator;
