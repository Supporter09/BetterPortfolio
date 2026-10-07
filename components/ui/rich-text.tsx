import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export type RichTone = 'teal' | 'amber' | 'neutral';

export type RichToken =
  | { kind: 'text'; value: string }
  | { kind: 'hl'; value: string; tone: RichTone }
  | { kind: 'em'; value: string };

/** `[[keyword]]`, `[[amber:keyword]]`, `[[neutral:keyword]]`, `*italic*`. Plain text otherwise. */
const TOKEN = /\[\[(?:(teal|amber|neutral):)?([^\]\n]+)\]\]|\*([^*\n]+)\*/g;

/** Tokenise inline markup. Pure string work → no HTML is ever interpreted; React escapes every value. */
export function parseRich(text: string): RichToken[] {
  const tokens: RichToken[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index;
    if (index > last) tokens.push({ kind: 'text', value: text.slice(last, index) });
    if (match[2] !== undefined) {
      tokens.push({ kind: 'hl', value: match[2], tone: (match[1] as RichTone | undefined) ?? 'teal' });
    } else if (match[3] !== undefined) {
      tokens.push({ kind: 'em', value: match[3] });
    }
    last = index + match[0].length;
  }
  if (last < text.length) tokens.push({ kind: 'text', value: text.slice(last) });
  return tokens;
}

/** Markup removed, words kept — for `<meta description>`, `aria-label`, `title`. */
export function stripRich(text: string): string {
  return text.replace(TOKEN, (_m, _tone: string | undefined, hl: string | undefined, em: string | undefined) => hl ?? em ?? '');
}

interface RichProps {
  text: string;
  /** Extra classes on every `.hl` mark (e.g. a pixel size override). */
  hlClassName?: string;
  /** Classes on every `<em>` (default: plain italic). */
  emClassName?: string;
}

/**
 * Rich copy: `[[keyword]]` → `<mark class="hl">` (pixel font, teal; `[[amber:…]]` / `[[neutral:…]]` retone),
 * `*phrase*` → `<em class="italic">`. Returns fragments only — drop it inside any `<p>`/`<span>`.
 */
export function Rich({ text, hlClassName, emClassName }: RichProps) {
  return (
    <>
      {parseRich(text).map((token, i) => {
        if (token.kind === 'text') return <Fragment key={i}>{token.value}</Fragment>;
        if (token.kind === 'em') {
          return (
            <em key={i} className={cn('italic', emClassName)}>
              {token.value}
            </em>
          );
        }
        return (
          <mark key={i} className={cn('hl', hlClassName)} data-tone={token.tone === 'teal' ? undefined : token.tone}>
            {token.value}
          </mark>
        );
      })}
    </>
  );
}
