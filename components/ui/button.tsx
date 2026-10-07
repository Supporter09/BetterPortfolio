import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { PixelIcon } from '@/components/ui/pixel-icon';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-grade-amber text-bg-0 hover-fine:bg-(--amber-hover) active:bg-(--amber-active) active:translate-y-px aria-disabled:bg-line-strong aria-disabled:text-ink-3 disabled:bg-line-strong disabled:text-ink-3',
  ghost:
    'border border-line-strong text-ink hover-fine:border-ink-3 hover-fine:bg-bg-1 active:bg-bg-2 aria-disabled:border-line aria-disabled:text-ink-3 disabled:border-line disabled:text-ink-3',
  link: 'text-grade-teal underline decoration-1 underline-offset-[0.2em] hover-fine:text-(--teal-hover) hover-fine:decoration-2 active:text-ink',
};

const SIZE: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-4',
  md: 'min-h-12 px-5',
  lg: 'min-h-14 px-6',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Trailing icon. Default: ArrowUpRight for external links, ArrowRight for other links, none for buttons. */
  icon?: 'auto' | 'none';
}

interface LinkButtonProps extends CommonProps {
  href: string;
  external?: boolean;
  /** Renders a visibly disabled, non-navigating element (e.g. placeholder links). */
  disabled?: boolean;
  'aria-label'?: string;
}

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { href?: undefined };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

/**
 * Button (01 §5.5). `<a>` when `href` is given (navigation), `<button>` otherwise (actions).
 * Never < 44px tall; focus ring comes from base `:focus-visible`. One primary per screen.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children, icon = 'auto' } = props;
  const classes = cn(
    'group/button inline-flex items-center justify-center gap-2 rounded-sm font-sans text-body font-medium transition-[color,background-color,border-color,transform] duration-(--dur-fast) ease-standard select-none',
    variant === 'link' ? 'min-h-11 px-0.5' : SIZE[size],
    VARIANT[variant],
    'aria-disabled:cursor-not-allowed disabled:cursor-not-allowed',
    className,
  );

  if (props.href !== undefined) {
    const { href, external = false, disabled = false } = props;
    const trailing =
      icon === 'auto' ? (
        <PixelIcon
          name={external ? 'arrow-up-right' : 'arrow-right'}
          size={16}
          className="transition-transform duration-(--dur-fast) ease-standard group-hover/button:translate-x-0.5"
        />
      ) : null;

    if (disabled) {
      return (
        <a role="link" aria-disabled="true" className={classes} aria-label={props['aria-label']}>
          {children}
        </a>
      );
    }

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={props['aria-label']}>
          {children}
          {trailing}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      );
    }

    if (href.startsWith('/')) {
      return (
        <Link href={href} className={classes} aria-label={props['aria-label']}>
          {children}
          {trailing}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} aria-label={props['aria-label']}>
        {children}
        {trailing}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, icon: _i, href: _h, type = 'button', ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
