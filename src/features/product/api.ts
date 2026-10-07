import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { apiFetch } from '@/lib/api/client';

import type { Product, ProductPayload } from './schemas';

export const PRODUCTS_QUERY_KEY = ['products'] as const;

export type ProductsQueryParams = {
  page: number;
  pageSize: number;
};

/**
 * L'API du TP 1 ignore volontairement `page` et `pageSize` et renvoie un
 * tableau complet. Le front les envoie tout de meme : la place est reservee
 * pour le module « Performance & donnees », ou la pagination passera cote
 * serveur. C'est le seul endroit a reprendre ce jour-la — la reponse deviendra
 * une enveloppe paginee au lieu d'un tableau nu.
 */
export const useProducts = (params: ProductsQueryParams) =>
  useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: () =>
      apiFetch<Array<Product>>('/products', {
        searchParams: { page: params.page, pageSize: params.pageSize },
      }),
  });

export const useProduct = (id: number) =>
  useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => apiFetch<Product>(`/products/${id}`),
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...PRODUCTS_QUERY_KEY, 'create'],
    gcTime: Infinity,
    mutationFn: (payload: ProductPayload) =>
      apiFetch<Product>('/products', { method: 'POST', body: payload }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...PRODUCTS_QUERY_KEY, 'update'],
    gcTime: Infinity,
    // PUT est un remplacement complet : tous les champs sont exiges.
    mutationFn: ({ id, ...payload }: ProductPayload & { id: number }) =>
      apiFetch<Product>(`/products/${id}`, { method: 'PUT', body: payload }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...PRODUCTS_QUERY_KEY, 'delete'],
    gcTime: Infinity,
    mutationFn: (id: number) =>
      apiFetch<void>(`/products/${id}`, { method: 'DELETE' }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
};

export const useLastMutation = (action: 'create' | 'update' | 'delete') =>
  useMutationState({
    filters: { mutationKey: [...PRODUCTS_QUERY_KEY, action] },
    select: (mutation) => ({
      status: mutation.state.status,
      error: mutation.state.error,
    }),
  }).at(-1);
