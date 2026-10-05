import { envClient } from '@/env/client';

import { networkError, parseApiError } from './errors';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  searchParams?: Record<string, string | number | undefined>;
};

const buildUrl = (
  path: string,
  searchParams: RequestOptions['searchParams']
) => {
  const url = new URL(
    `${envClient.VITE_API_BASE_URL.replace(/\/$/, '')}${path}`
  );

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

/**
 * Appelle l'API FTELMarket et rejette une `ApiError` en cas d'echec.
 *
 * Aucun mock, aucune donnee de repli : tant que l'API n'est pas demarree, les
 * ecrans affichent une erreur explicite. C'est voulu — ce front est le cahier
 * des charges executable de l'API a ecrire.
 */
export const apiFetch = async <TResponse>(
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> => {
  const { method = 'GET', body, searchParams } = options;

  let response: Response;

  try {
    response = await fetch(buildUrl(path, searchParams), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw networkError();
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  // 204 No Content : la suppression ne renvoie pas de corps.
  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
};
