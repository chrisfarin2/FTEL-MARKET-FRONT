import { linkOptions } from '@tanstack/react-router';
import { Gamepad2, House, type LucideIcon } from 'lucide-react';

/**
 * Menu principal. Il s'etoffera au fil des TD : ajouter une entree ici suffit,
 * les barres de navigation desktop et mobile s'alimentent toutes deux de cette
 * liste.
 */
export const MAIN_NAV_LINKS = linkOptions([
  {
    labelTranslationKey: 'layout:nav.home',
    icon: House,
    to: '/',
    activeOptions: { exact: true },
  },
  {
    labelTranslationKey: 'layout:nav.catalog',
    icon: Gamepad2,
    to: '/produits',
  },
]);

export type NavLinkItem = Omit<
  (typeof MAIN_NAV_LINKS)[number],
  'labelTranslationKey' | 'icon'
> & {
  icon: LucideIcon;
  children?: React.ReactNode;
};
