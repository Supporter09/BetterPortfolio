/**
 * Page-wide film grain (01 §2.6): fixed, z-70, pointer-events none, opacity var(--grain-opacity)
 * (0.06; 0.10 under html[data-active-scene=field-notes]). Steps at ~10fps in Tier A only.
 */
export function Grain() {
  return <div className="grain tier-a:animate-grain" aria-hidden="true" />;
}
