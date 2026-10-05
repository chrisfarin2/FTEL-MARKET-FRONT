import type { ReactNode } from 'react';

import { MainNavDesktop } from '@/layout/app/main-nav-desktop';
import { MainNavMobile } from '@/layout/app/main-nav-mobile';

/**
 * Cadre commun a toutes les pages : barre de navigation en haut sur grand
 * ecran, barre d'onglets en bas sur mobile.
 */
export const Layout = (props: { children?: ReactNode }) => (
  <div className="flex flex-1 flex-col" data-testid="layout-app">
    <MainNavDesktop />
    <div className="flex flex-1 flex-col">{props.children}</div>
    <MainNavMobile />
  </div>
);
