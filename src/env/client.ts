/* eslint-disable no-process-env */
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const envMetaOrProcess: Record<string, string> = import.meta.env ?? process.env;

const isDev = process.env.NODE_ENV
  ? process.env.NODE_ENV === 'development'
  : import.meta.env?.DEV;

export const envClient = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_BASE_URL: z.url(),
    /**
     * Racine de l'API FTELMarket, terminaison `/api` incluse.
     * C'est le seul point de configuration entre ce front et le back :
     * tout le reste (routes, noms de champs) suit le contrat d'API.
     */
    VITE_API_BASE_URL: z.url(),
    VITE_ENV_NAME: z
      .string()
      .optional()
      .transform((value) => value ?? (isDev ? 'LOCAL' : undefined)),
    VITE_ENV_EMOJI: z
      .emoji()
      .optional()
      .transform((value) => value ?? (isDev ? '🚧' : undefined)),
    VITE_ENV_COLOR: z
      .string()
      .optional()
      .transform((value) => value ?? (isDev ? 'gold' : 'plum')),
  },
  runtimeEnv: {
    ...envMetaOrProcess,
    VITE_BASE_URL: envMetaOrProcess.VITE_BASE_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!envMetaOrProcess.SKIP_ENV_VALIDATION,
});
