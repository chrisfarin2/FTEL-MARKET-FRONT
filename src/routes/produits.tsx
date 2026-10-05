import { createFileRoute } from '@tanstack/react-router';

import { PageProducts } from '@/features/product/page-products';

export const Route = createFileRoute('/produits')({
  component: PageProducts,
});
