import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldController,
  FormFieldHelper,
  FormFieldLabel,
} from '@/components/form';

import { useCategories } from '@/features/category/api';

import type { ProductPayload } from './schemas';

export const FormProduct = () => {
  const form = useFormContext<ProductPayload>();
  const { t } = useTranslation(['product']);
  const categories = useCategories();

  return (
    <div className="flex flex-col gap-4">
      <FormField>
        <FormFieldLabel>{t('product:fields.name')}</FormFieldLabel>
        <FormFieldController
          type="text"
          control={form.control}
          name="name"
          autoFocus
        />
      </FormField>

      <FormField>
        <FormFieldLabel>{t('product:fields.category')}</FormFieldLabel>
        <FormFieldController
          type="select"
          control={form.control}
          name="categoryId"
          placeholder={t('product:fields.categoryPlaceholder')}
          items={(categories.data ?? []).map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />
        {categories.isError && (
          <FormFieldHelper>
            {t('product:errors.categoriesLoad')}
          </FormFieldHelper>
        )}
      </FormField>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <FormField>
            <FormFieldLabel>{t('product:fields.price')}</FormFieldLabel>
            <FormFieldController
              type="number"
              control={form.control}
              name="price"
            />
          </FormField>
        </div>
        <div className="flex-1">
          <FormField>
            <FormFieldLabel>{t('product:fields.stock')}</FormFieldLabel>
            <FormFieldController
              type="number"
              control={form.control}
              name="stock"
            />
          </FormField>
        </div>
      </div>

      <FormField>
        <FormFieldLabel>{t('product:fields.description')}</FormFieldLabel>
        <FormFieldController
          type="textarea"
          control={form.control}
          name="description"
        />
      </FormField>
    </div>
  );
};
