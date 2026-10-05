import { z } from 'zod';

/**
 * Formes de donnees du contrat d'API (TP 1 « Premier CRUD »).
 * Les noms de champs sont ceux de l'API : ne pas les renommer ici.
 */

export const zProduct = () =>
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    stock: z.number(),
    categoryId: z.number(),
    // Denormalise par l'API : la categorie s'affiche sans second appel.
    categoryName: z.string(),
    createdAt: z.iso.datetime(),
  });

export type Product = z.infer<ReturnType<typeof zProduct>>;

export const zCategory = () =>
  z.object({
    id: z.number(),
    name: z.string(),
  });

export type Category = z.infer<ReturnType<typeof zCategory>>;

/**
 * Regles de saisie du formulaire. Elles reproduisent celles du contrat pour le
 * confort de l'utilisateur, mais la validation qui fait foi reste celle du
 * serveur : ses erreurs 400 sont reinjectees dans le formulaire.
 */
export const zProductPayload = () =>
  z.object({
    name: z
      .string()
      .min(1, 'Le nom est obligatoire.')
      .max(200, 'Le nom ne peut pas dépasser 200 caractères.'),
    description: z
      .string()
      .max(1000, 'La description ne peut pas dépasser 1000 caractères.')
      .nullish(),
    price: z
      .number({ error: 'Le prix est obligatoire.' })
      .min(0.01, 'Le prix doit être supérieur à 0.')
      .max(1_000_000, 'Le prix ne peut pas dépasser 1 000 000.'),
    stock: z
      .number({ error: 'Le stock est obligatoire.' })
      .int('Le stock doit être un nombre entier.')
      .min(0, 'Le stock ne peut pas être négatif.'),
    categoryId: z
      .number({ error: 'La catégorie est obligatoire.' })
      .min(1, 'La catégorie est obligatoire.'),
  });

export type ProductPayload = z.infer<ReturnType<typeof zProductPayload>>;
