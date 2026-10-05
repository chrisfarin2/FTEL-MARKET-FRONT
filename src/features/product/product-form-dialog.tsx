import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { isApiError } from '@/lib/api/errors';
import { applyServerFieldErrors } from '@/lib/api/form';

import { Form } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useCreateProduct, useUpdateProduct } from './api';
import { FormProduct } from './form-product';
import { type Product, type ProductPayload, zProductPayload } from './schemas';

type ProductFormDialogProps = {
  /** Produit a modifier, ou `null` pour une creation. */
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const emptyValues: ProductPayload = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: 0,
};

export const ProductFormDialog = ({
  product,
  isOpen,
  onOpenChange,
}: ProductFormDialogProps) => {
  const { t } = useTranslation(['product', 'common']);
  const isUpdate = product !== null;

  const form = useForm<ProductPayload>({
    resolver: zodResolver(zProductPayload()),
    values: product
      ? {
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
        }
      : emptyValues,
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isPending = createProduct.isPending || updateProduct.isPending;

  const handleError = (error: unknown) => {
    const fallback = isUpdate
      ? t('product:update.error')
      : t('product:create.error');

    if (!isApiError(error)) {
      toast.error(fallback);
      return;
    }

    // Erreurs de validation par champ (ProblemDetails) : elles se placent sur
    // les champs concernes. Erreur metier (`{ message }`) : un toast suffit.
    if (!applyServerFieldErrors(form, error)) {
      toast.error(error.message);
    }
  };

  const handleSubmit = (values: ProductPayload) => {
    const payload = {
      ...values,
      description: values.description?.trim() ? values.description : null,
    };

    if (isUpdate) {
      updateProduct.mutate(
        { ...payload, id: product.id },
        {
          onSuccess: () => {
            toast.success(t('product:update.success'));
            onOpenChange(false);
          },
          onError: handleError,
        }
      );
      return;
    }

    createProduct.mutate(payload, {
      onSuccess: () => {
        toast.success(t('product:create.success'));
        onOpenChange(false);
      },
      onError: handleError,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form} onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isUpdate ? t('product:update.title') : t('product:create.title')}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <FormProduct />
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              {t('product:actions.cancel')}
            </Button>
            <Button type="submit" loading={isPending}>
              {isUpdate
                ? t('product:update.submit')
                : t('product:create.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
