import { QueryClient } from '@tanstack/react-query';

import { isApiError } from '@/lib/api/errors';

const networkMode = import.meta.env.DEV ? 'always' : undefined;

/**
 * Insister n'a de sens que face a une defaillance passagere du serveur.
 *
 * Si l'API est injoignable (pas encore demarree, mauvaise URL, CORS) ou si
 * elle a repondu une erreur client, reessayer ne fera qu'afficher un spinner
 * pendant plusieurs secondes avant la meme erreur. Or ce cas est justement le
 * quotidien de l'etudiant tant qu'il n'a pas ecrit son API : le message doit
 * arriver tout de suite.
 */
const retry = (failureCount: number, error: unknown) => {
  if (isApiError(error) && (error.isNetworkError || error.status < 500)) {
    return false;
  }
  return failureCount < 2;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode,
      retry,
    },
    mutations: {
      networkMode,
      retry: false,
    },
  },
});
