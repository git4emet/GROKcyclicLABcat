import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  INTENT_GRID,
  PASTE_NAMES,
  PHONETIC_NOTES,
  PLATFORMS,
  PUBLIC_STEPS,
  mirrorMarkdown,
  type HeardPair,
} from "@/lib/oral/phonetic-mirror";

const KEY = "phonetic-mirror-v1";

function loadPairs(): HeardPair[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.meant === "string" &&
        typeof item.heard === "string" &&
        typeof item.platform === "string",
    );
  } catch {
    return [];
  }
}

export function PhoneticMirror() {
  const [pairs, setPairs] = useState<HeardPair[]>([]);
  const [meant, setMeant] = useState("み く い");
  const [heard, setHeard] = useState("");
  const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPairs(loadPairs());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(pairs));
  }, [pairs, ready]);

  function addPair() {
    const nextHeard = heard.trim();
    const nextMeant = meant.trim();
    if (!nextHeard || !nextMeant) return;
    setPairs((prev) => [
      { id: crypto.randomUUID(), meant: nextMeant, heard: nextHeard, platform },
      ...prev,
    ]);
    setHeard("");
  }

  function downloadPack() {
    const blob = new Blob([mirrorMarkdown(pairs)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "phonetic-mirror.md";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-xl text-sm leading-relaxed text-muted">
        A mirror of a site comes from what a platform wrote down, not from calling the fourth name an inverse of
        the third. The inspection stays open.
      </p>

      <section className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
        <h2 className="text-base font-medium text-fg">How the public brings a mirror up</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-fg">
          {PUBLIC_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
        <h2 className="text-base font-medium text-fg">Japanese intent</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The name in the paste is three beats: み く い. The grid below is the kana those beats sit in. It is not
          a measured tone.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {INTENT_GRID.map((row) => (
            <li key={row.row} className="text-sm text-fg">
              <span className="text-muted">{row.row}. </span>
              {row.mora}
              <span className="mt-0.5 block text-muted">{row.latin}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-3 flex flex-col gap-2">
          {PHONETIC_NOTES.map((line) => (
            <li key={line} className="text-sm leading-relaxed text-muted">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
        <h2 className="text-base font-medium text-fg">Names in the paste</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {PASTE_NAMES.map((item) => (
            <li key={item.name} className="text-sm text-fg">
              {item.name}
              <span className="mt-0.5 block text-muted">{item.note} Not health-receipted.</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
        <h2 className="text-base font-medium text-fg">What a platform heard</h2>
        <label className="mt-3 block text-xs text-subtle">
          Intended mora or words
          <input
            className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg"
            value={meant}
            onChange={(event) => setMeant(event.target.value)}
          />
        </label>
        <label className="mt-3 block text-xs text-subtle">
          Letters the platform wrote
          <input
            className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg"
            value={heard}
            placeholder="exact spelling"
            onChange={(event) => setHeard(event.target.value)}
          />
        </label>
        <label className="mt-3 block text-xs text-subtle">
          Platform
          <select
            className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            {PLATFORMS.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" onClick={addPair} disabled={!heard.trim() || !meant.trim()}>
            Keep this alias open
          </Button>
          <Button type="button" variant="outline" onClick={downloadPack}>
            <Download className="size-4" aria-hidden />
            Download the package
          </Button>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {pairs.length === 0 ? (
            <li className="text-sm text-muted">No hearing written on this phone yet.</li>
          ) : (
            pairs.map((pair) => (
              <li key={pair.id} className="rounded-[var(--radius-sm)] border border-border px-3 py-2 text-sm text-fg">
                {pair.meant} → {pair.heard}
                <span className="mt-0.5 block text-muted">{pair.platform}. Open alias. Not a registration.</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
