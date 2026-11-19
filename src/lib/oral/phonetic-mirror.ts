/** Public phonetic-mirror kit. Aliases stay open. Nothing here is a registration or a color. */

export type HeardPair = {
  id: string;
  meant: string;
  heard: string;
  platform: string;
};

export const PLATFORMS = [
  "Phone dictation",
  "Google speech",
  "Apple speech",
  "Whisper-class",
  "Meeting captions",
  "Other platform already on the planet",
] as const;

/** Ordinary kana the speech was aiming at. A grid, not a measured tone. */
export const INTENT_GRID = [
  { row: "ま行", mora: "ま み む め も", latin: "ma mi mu me mo" },
  { row: "か行", mora: "か き く け こ", latin: "ka ki ku ke ko" },
  { row: "さ行", mora: "さ し す せ そ", latin: "sa shi su se so" },
  { row: "た行", mora: "た ち つ て と", latin: "ta chi tsu te to" },
] as const;

export const PHONETIC_NOTES = [
  "し is one mora. Latin speech tools write it shi, si, she, or see.",
  "サイト is the usual Japanese spelling of the English word site. Heard back, it often returns as saito or sight.",
  "A long vowel or a small っ is one beat. Latin tools often drop that beat, so the written name is shorter than the intent.",
  "L and R are not separate in this grid. A platform that has both will still guess.",
  ".cyou is its own registry ending. It is not proof that someone heard きょう or show.",
] as const;

/** Names from the paste. Not probed. Not in the eight-host ring. */
export const PASTE_NAMES = [
  { name: "mikui.cyou", note: "Named in the paste only." },
  { name: "mikui.shop", note: "Named in the paste only." },
  { name: "mikui.site", note: "Named in the paste only. Not established as the primary." },
  { name: "mikui.xyz", note: "Named in the paste only. Not an inverse of mikui.site." },
] as const;

export const PUBLIC_STEPS = [
  "Say the site name once, into a platform that already exists.",
  "Write the Japanese intent as mora, and write the letters that platform actually returned.",
  "That pair is an open alias. The inspection stays open. No color is assigned.",
  "A mirror goes up only on a name you control. Serve the same pages, and say that some people arrived by a mishearing.",
  "The original site stays primary. A matching sound does not clear a risk and does not register the mirror.",
] as const;

export function mirrorMarkdown(pairs: HeardPair[]): string {
  const heard =
    pairs.length === 0
      ? "_No platform hearing has been written on this phone yet._"
      : pairs
          .map(
            (p) =>
              `- Meant \`${p.meant}\` · platform wrote \`${p.heard}\` · ${p.platform}. Standing: open alias. Not a registration.`,
          )
          .join("\n");
  return `# Phonetic mirror

How to bring a mirror of a site up from what the platforms heard.

This is not a registration. The inspection queue stays open. Nothing in this package is marked clear.

## Do this

${PUBLIC_STEPS.map((step, i) => `${i + 1}. ${step}`).join("\n")}

## Japanese intent grid

The speech was aiming at these mora. They are the ordinary kana table, not a measured harmonic.

${INTENT_GRID.map((row) => `- ${row.row}: ${row.mora} (${row.latin})`).join("\n")}

Three beats for the name in the paste: み く い (mi ku i).

## What Latin tools often do

${PHONETIC_NOTES.map((line) => `- ${line}`).join("\n")}

## Names in the paste

${PASTE_NAMES.map((item) => `- ${item.name} — ${item.note}`).join("\n")}

## Hearings written here

${heard}

## Standing

Tread stays 2, then 1, then 3. It did not gain a fourth step. A weakness with no covering check still waits.
`;
}
