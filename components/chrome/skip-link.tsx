/** First focusable element on every page (01 §5.1): visible on focus, targets `#main`. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="label-mono fixed top-2 left-2 z-(--z-modal) inline-flex min-h-11 -translate-y-[200%] items-center rounded-sm bg-grade-amber px-4 text-bg-0 focus-visible:translate-y-0 focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
