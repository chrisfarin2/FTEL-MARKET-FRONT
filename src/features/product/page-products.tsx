import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { isApiError } from '@/lib/api/errors';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmResponsiveDrawer } from '@/components/ui/confirm-responsive-drawer';
import { SearchInput } from '@/components/ui/search-input';
import { Spinner } from '@/components/ui/spinner';

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutTopBar,
  PageLayoutTopBarTitle,
} from '@/layout/app/page-layout';

import { useDeleteProduct, useProducts } from './api';
import { ProductFormDialog } from './product-form-dialog';
import type { Product } from './schemas';

const PAGE_SIZE = 10;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(
    new Date(isoDate)
  );

export const PageProducts = () => {
  const { t } = useTranslation(['product']);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const products = useProducts({ page, pageSize: PAGE_SIZE });
  const deleteProduct = useDeleteProduct();

  // L'API du TP 1 ignore `page` et `pageSize` et renvoie tout le catalogue :
  // la recherche et la pagination sont donc calculees ici, sur ce qu'elle a
  // renvoye. Le module « Performance & donnees » deplacera ce travail cote
  // serveur.
  const filtered = useMemo(() => {
    const items = products.data ?? [];
    const needle = search.trim().toLowerCase();

    if (!needle) return items;

    return items.filter(
      (product) =>
        product.name.toLowerCase().includes(needle) ||
        product.categoryName.toLowerCase().includes(needle)
    );
  }, [products.data, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openCreate = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const openUpdate = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    deleteProduct.mutate(product.id, {
      onSuccess: () => toast.success(t('product:delete.success')),
      onError: (error) =>
        toast.error(
          isApiError(error) ? error.message : t('product:delete.error')
        ),
    });
  };

  return (
    <PageLayout>
      <PageLayoutTopBar
        endActions={
          <Button size="sm" onClick={openCreate}>
            {t('product:list.createButton')}
          </Button>
        }
      >
        <PageLayoutTopBarTitle>{t('product:list.title')}</PageLayoutTopBarTitle>
      </PageLayoutTopBar>

      <PageLayoutContent>
        <div className="flex flex-col gap-4">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value ?? '');
              setPage(1);
            }}
            placeholder={t('product:list.search')}
          />

          {products.isPending && (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          )}

          {products.isError && (
            <Alert variant="destructive">
              <AlertTitle>{t('product:errors.loadTitle')}</AlertTitle>
              <AlertDescription>
                <p>
                  {isApiError(products.error)
                    ? products.error.message
                    : t('product:errors.loadTitle')}
                </p>
                <p>{t('product:errors.apiUnreachableHelp')}</p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => products.refetch()}
                >
                  {t('product:errors.retry')}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {products.isSuccess && visible.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {search ? t('product:list.emptySearch') : t('product:list.empty')}
            </p>
          )}

          {products.isSuccess && visible.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">
                        {t('product:columns.name')}
                      </th>
                      <th className="py-2 pr-4 font-medium">
                        {t('product:columns.category')}
                      </th>
                      <th className="py-2 pr-4 text-right font-medium">
                        {t('product:columns.price')}
                      </th>
                      <th className="py-2 pr-4 text-right font-medium">
                        {t('product:columns.stock')}
                      </th>
                      <th className="py-2 pr-4 font-medium">
                        {t('product:columns.createdAt')}
                      </th>
                      <th className="py-2 text-right font-medium">
                        {t('product:columns.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((product) => (
                      <tr key={product.id} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="font-medium">{product.name}</div>
                          {!!product.description && (
                            <div className="line-clamp-1 text-xs text-muted-foreground">
                              {product.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary">
                            {product.categoryName}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          {product.stock}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {formatDate(product.createdAt)}
                        </td>
                        <td className="py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => openUpdate(product)}
                            >
                              {t('product:actions.edit')}
                            </Button>
                            <ConfirmResponsiveDrawer
                              title={t('product:delete.title')}
                              description={t('product:delete.description', {
                                name: product.name,
                              })}
                              confirmText={t('product:delete.confirm')}
                              confirmVariant="destructive"
                              cancelText={t('product:actions.cancel')}
                              onConfirm={() => handleDelete(product)}
                            >
                              <Button size="sm" variant="ghost">
                                {t('product:delete.action')}
                              </Button>
                            </ConfirmResponsiveDrawer>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pageCount > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    {t('product:pagination.previous')}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {t('product:pagination.page', {
                      page: currentPage,
                      total: pageCount,
                    })}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentPage >= pageCount}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {t('product:pagination.next')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </PageLayoutContent>

      <ProductFormDialog
        product={productToEdit}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </PageLayout>
  );
};
