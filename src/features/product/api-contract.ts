import { z } from 'zod';

import {
  type Category,
  type Product,
  type ProductPayload,
  zProductPayload,
} from './schemas';

export const MOCK_CATEGORIES: Array<Category> = [
  { id: 1, name: 'PlayStation 5' },
  { id: 2, name: 'Nintendo Switch' },
  { id: 3, name: 'Xbox Series X' },
  { id: 4, name: 'PC' },
];

const categoryName = (categoryId: number) =>
  MOCK_CATEGORIES.find((category) => category.id === categoryId)?.name ?? '';

const mockProduct = (product: Omit<Product, 'categoryName'>): Product => ({
  ...product,
  categoryName: categoryName(product.categoryId),
});

export const MOCK_PRODUCTS: Array<Product> = [
  mockProduct({
    id: 1,
    name: 'The Last of Us Part II',
    description: 'Boîte et notice, disque sans rayure.',
    price: 19.9,
    stock: 3,
    categoryId: 1,
    createdAt: '2026-09-02T09:15:00Z',
  }),
  mockProduct({
    id: 2,
    name: 'Gran Turismo 7',
    description: null,
    price: 29.9,
    stock: 1,
    categoryId: 1,
    createdAt: '2026-09-05T14:30:00Z',
  }),
  mockProduct({
    id: 3,
    name: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'Cartouche seule.',
    price: 39.9,
    stock: 2,
    categoryId: 2,
    createdAt: '2026-09-08T10:00:00Z',
  }),
  mockProduct({
    id: 4,
    name: 'Mario Kart 8 Deluxe',
    description: 'Complet, très bon état.',
    price: 34.9,
    stock: 5,
    categoryId: 2,
    createdAt: '2026-09-10T16:45:00Z',
  }),
  mockProduct({
    id: 5,
    name: 'Halo Infinite',
    description: null,
    price: 14.9,
    stock: 4,
    categoryId: 3,
    createdAt: '2026-09-12T11:20:00Z',
  }),
  mockProduct({
    id: 6,
    name: 'Forza Horizon 5',
    description: 'Édition standard.',
    price: 24.9,
    stock: 0,
    categoryId: 3,
    createdAt: '2026-09-15T08:05:00Z',
  }),
  mockProduct({
    id: 7,
    name: 'Baldur’s Gate 3',
    description: 'Clé physique, coffret collector.',
    price: 44.9,
    stock: 1,
    categoryId: 4,
    createdAt: '2026-09-18T17:40:00Z',
  }),
  mockProduct({
    id: 8,
    name: 'Hades',
    description: null,
    price: 9.9,
    stock: 6,
    categoryId: 4,
    createdAt: '2026-09-21T13:10:00Z',
  }),
];

const [exampleProduct] = MOCK_PRODUCTS as [Product, ...Array<Product>];

const examplePayload: ProductPayload = {
  name: exampleProduct.name,
  description: exampleProduct.description,
  price: exampleProduct.price,
  stock: exampleProduct.stock,
  categoryId: exampleProduct.categoryId,
};

type JsonSchemaField = {
  type?: string;
  anyOf?: Array<JsonSchemaField>;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
};

export type FieldConstraint = {
  name: string;
  type: string;
  isRequired: boolean;
  isNullable: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
};

const toFieldConstraints = (schema: z.ZodType): Array<FieldConstraint> => {
  const { properties = {}, required = [] } = z.toJSONSchema(schema, {
    io: 'input',
  }) as {
    properties?: Record<string, JsonSchemaField>;
    required?: Array<string>;
  };

  return Object.entries(properties).map(([name, field]) => {
    const variants = field.anyOf ?? [field];
    const value = variants.find((variant) => variant.type !== 'null') ?? field;

    return {
      name,
      type: value.type ?? 'unknown',
      isRequired: required.includes(name),
      isNullable: variants.some((variant) => variant.type === 'null'),
      minLength: value.minLength,
      maxLength: value.maxLength,
      minimum: value.minimum,
      maximum:
        value.maximum === Number.MAX_SAFE_INTEGER ? undefined : value.maximum,
    };
  });
};

const payloadConstraints = toFieldConstraints(zProductPayload());

export type ApiRoute = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  requestBody?: unknown;
  requestConstraints?: Array<FieldConstraint>;
  response?: unknown;
};

export const API_ROUTES = {
  listProducts: { method: 'GET', path: '/products', response: MOCK_PRODUCTS },
  listCategories: {
    method: 'GET',
    path: '/categories',
    response: MOCK_CATEGORIES,
  },
  createProduct: {
    method: 'POST',
    path: '/products',
    requestBody: examplePayload,
    requestConstraints: payloadConstraints,
    response: exampleProduct,
  },
  updateProduct: {
    method: 'PUT',
    path: '/products/{id}',
    requestBody: examplePayload,
    requestConstraints: payloadConstraints,
    response: exampleProduct,
  },
  deleteProduct: { method: 'DELETE', path: '/products/{id}' },
} satisfies Record<string, ApiRoute>;
