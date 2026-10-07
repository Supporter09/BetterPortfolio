import { GithubLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react/ssr';
import type { Icon } from '@phosphor-icons/react';
import { PixelIcon } from '@/components/ui/pixel-icon';
import type { LinkItem } from '@/content/types';
import { SITE } from '@/content/site';
import { BUILD_INFO } from '@/lib/site/build-info';
import { SceneLink } from '@/components/chrome/menu';

const ICONS: Record<string, Icon> = {
  LinkedIn: LinkedinLogoIcon,
  GitHub: GithubLogoIcon,
};

function FooterLink({ link }: { link: LinkItem }) {
  const LinkIcon = ICONS[link.label];
  const glyph = LinkIcon ? <LinkIcon size={20} aria-hidden="true" /> : <PixelIcon name="film" size={20} />;
  if (link.placeholder) {
    return (
      <span className="inline-flex min-h-11 items-center gap-2 text-body-sm text-ink-3" aria-disabled="true">
        {glyph}
        {link.label}
        <span className="label-mono">· Link coming soon</span>
      </span>
    );
  }
  return (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      className="inline-flex min-h-11 items-center gap-2 text-body-sm text-ink-2 decoration-1 underline-offset-[0.2em] transition-colors hover-fine:text-ink hover-fine:underline"
    >
      {glyph}
      {link.label}
      {link.external ? (
        <>
          <PixelIcon name="arrow-up-right" size={16} />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}

/** Footer split Engineering / Film (01 §5.14) + build info (03a §6.5) + back to top. */
export function Footer() {
  const engineering = SITE.links.filter((link) => link.kind === 'engineering');
  const film = SITE.links.filter((link) => link.kind === 'film');

  return (
    <footer className="border-t border-line bg-bg-0 pt-16 pb-[calc(var(--spacing-timecode)+3rem)]">
      <div className="frame">
        <div className="grid-frame gap-y-10">
          <nav aria-label="Engineering links" className="col-span-4 md:col-span-4 lg:col-span-5">
            <h2 className="label-mono mb-3 font-mono text-ink-3">Engineering</h2>
            <ul className="flex flex-col">
              {engineering.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Film links" className="col-span-4 md:col-span-4 lg:col-span-5 lg:col-start-7">
            <h2 className="label-mono mb-3 font-mono text-ink-3">Film</h2>
            <ul className="flex flex-col">
              {film.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="label-mono flex flex-wrap gap-x-3 gap-y-1 text-ink-3">
            <span>© 2026 {SITE.name}</span>
            {BUILD_INFO.label !== 'build' ? (
              <span>
                <span aria-hidden="true">· </span>
                {BUILD_INFO.iso ? <time dateTime={BUILD_INFO.iso}>{BUILD_INFO.label}</time> : BUILD_INFO.label}
              </span>
            ) : null}
          </p>
          <SceneLink
            scene="opening"
            className="inline-flex min-h-11 items-center gap-2 self-start text-body-sm text-ink-2 transition-colors hover-fine:text-ink md:self-auto"
          >
            <PixelIcon name="arrow-up" size={16} />
            Back to top
          </SceneLink>
        </div>
      </div>
    </footer>
  );
}
