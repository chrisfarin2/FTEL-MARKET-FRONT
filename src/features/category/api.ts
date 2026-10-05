import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api/client';

import type { Category } from '@/features/product/schemas';

export const CATEGORIES_QUERY_KEY = ['categories'] as const;

/** Lecture seule dans ce TP : alimente la liste deroulante du formulaire. */
export const useCategories = () =>
  useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => apiFetch<Array<Category>>('/categories'),
  });
