import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The theme defines `--text-display-*`, `--text-heading-*`, `--text-body-*`,
 * `--text-pixel-*` font sizes. Without this config tailwind-merge classifies
 * `text-display-xl` as a text *color* and drops it when `text-ink` follows.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-2xl', 'display-xl', 'display-lg', 'display-md',
            'heading-lg', 'heading-md', 'heading-sm',
            'body-lg', 'body-md', 'body-sm',
            'pixel-xs', 'pixel-sm', 'pixel-md', 'pixel-lg', 'pixel-xl', 'pixel-2xl',
            'caption',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
