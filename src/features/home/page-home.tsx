import { Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonLink } from '@/components/ui/button-link';

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutTopBar,
  PageLayoutTopBarTitle,
} from '@/layout/app/page-layout';

const START_UI_URL = 'https://github.com/BearStudio/start-ui-web';

export const PageHome = () => {
  const { t } = useTranslation(['home', 'layout']);

  return (
    <PageLayout>
      {/* Le nom du produit est deja porte par le logo de la barre de
          navigation : la barre de page reprend l'intitule du menu. */}
      <PageLayoutTopBar>
        <PageLayoutTopBarTitle>{t('layout:nav.home')}</PageLayoutTopBarTitle>
      </PageLayoutTopBar>

      <PageLayoutContent className="justify-between">
        <div className="flex flex-col gap-8 py-4">
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-2xl font-semibold">{t('home:tagline')}</h2>
            <ButtonLink to="/produits">{t('home:cta')}</ButtonLink>
          </div>

          <WorkInProgress />
        </div>

        <footer className="py-4 text-center text-xs text-muted-foreground">
          {t('home:credit.text')}
          <a
            href={START_UI_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            {t('home:credit.link')}
          </a>
        </footer>
      </PageLayoutContent>
    </PageLayout>
  );
};

const WorkInProgress = () => {
  const { t } = useTranslation(['home']);

  return (
    <div className="border-amber-500/60 bg-amber-500/5 flex flex-col items-center gap-4 rounded-lg border-2 border-dashed px-6 py-10 text-center">
      {/* Bandes obliques jaune et noir d'un panneau de chantier. */}
      <div
        aria-hidden
        className="h-3 w-full max-w-xs rounded-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #f59e0b 0 10px, #1c1917 10px 20px)',
        }}
      />
      <Construction className="text-amber-500 size-10" />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold">{t('home:wip.title')}</p>
        <p className="text-sm text-muted-foreground">
          {t('home:wip.description')}
        </p>
      </div>
      <div
        aria-hidden
        className="h-3 w-full max-w-xs rounded-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #f59e0b 0 10px, #1c1917 10px 20px)',
        }}
      />
    </div>
  );
};
