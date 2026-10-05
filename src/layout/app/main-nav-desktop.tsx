import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/components/brand/logo';

import { MAIN_NAV_LINKS, type NavLinkItem } from '@/layout/app/main-nav-config';

const HEIGHT = 'calc(56px + env(safe-area-inset-top))';

export const MainNavDesktop = () => {
  const { t } = useTranslation(['layout']);

  return (
    <div className="hidden md:flex">
      <div style={{ height: HEIGHT }} />
      <header
        className="fixed top-0 right-0 left-0 z-20 flex items-center border-b border-b-neutral-200 bg-white pt-safe-top dark:border-b-neutral-800 dark:bg-neutral-900"
        style={{ height: HEIGHT }}
      >
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="flex gap-0.5">
            {MAIN_NAV_LINKS.map(({ labelTranslationKey, ...item }) => (
              <Item key={item.to} {...item}>
                {t(labelTranslationKey)}
              </Item>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
};

const Item = ({ icon: Icon, children, ...linkProps }: NavLinkItem) => (
  <Link
    {...linkProps}
    className="flex items-center justify-center gap-2 rounded-md px-2.5 py-2 text-neutral-500 transition hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/5 [&.active]:font-semibold [&.active]:text-primary"
  >
    <Icon className="size-4 opacity-60 in-[.active]:opacity-100" />
    <span className="text-sm font-medium">{children}</span>
  </Link>
);
