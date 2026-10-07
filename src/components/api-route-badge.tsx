import { CircleCheckIcon, CircleXIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isApiError } from '@/lib/api/errors';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { envClient } from '@/env/client';
import type { ApiRoute } from '@/features/product/api-contract';

const toJson = (value: unknown) => JSON.stringify(value, null, 2);

const formatNumber = (value: number) =>
  new Intl.NumberFormat('fr-FR').format(value);

export const ApiRouteBadge = ({
  route,
  isValidated,
  error,
}: {
  route: ApiRoute;
  isValidated: boolean;
  error: unknown;
}) => {
  const { t } = useTranslation(['product']);
  const label = `${route.method} ${route.path}`;
  const url = `${envClient.VITE_API_BASE_URL.replace(/\/$/, '')}${route.path}`;
  const status = isValidated
    ? t('product:apiContract.validated')
    : t('product:apiContract.toCreate');
  const errorText = isApiError(error)
    ? `${error.status} — ${error.message}`
    : null;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Badge
            variant={isValidated ? 'positive' : 'negative'}
            className="cursor-pointer hover:opacity-80"
            render={<button type="button" />}
          />
        }
        aria-label={`${label} : ${status}`}
      >
        {isValidated ? (
          <CircleCheckIcon aria-hidden />
        ) : (
          <CircleXIcon aria-hidden />
        )}
        {label}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{status}</DialogDescription>
        </DialogHeader>
        <dl className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <dt className="font-medium">{t('product:apiContract.url')}</dt>
            <dd className="font-mono text-xs break-all">{url}</dd>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <dt className="font-medium">
              {t('product:apiContract.receivedError')}
            </dt>
            <dd
              className="truncate text-muted-foreground"
              title={errorText ?? undefined}
            >
              {errorText ?? t('product:apiContract.noError')}
            </dd>
          </div>
          {route.requestBody !== undefined && (
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="font-medium">
                {t('product:apiContract.expectedBody')}
              </dt>
              <dd>
                <pre className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs">
                  {toJson(route.requestBody)}
                </pre>
              </dd>
            </div>
          )}
          {route.requestConstraints !== undefined && (
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="font-medium">
                {t('product:apiContract.constraints')}
              </dt>
              <dd className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-1 pr-3 font-medium">
                        {t('product:apiContract.constraintField')}
                      </th>
                      <th className="py-1 pr-3 font-medium">
                        {t('product:apiContract.constraintType')}
                      </th>
                      <th className="py-1 pr-3 font-medium">
                        {t('product:apiContract.constraintRequired')}
                      </th>
                      <th className="py-1 font-medium">
                        {t('product:apiContract.constraintRules')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {route.requestConstraints.map((field) => (
                      <tr key={field.name} className="border-b last:border-0">
                        <td className="py-1 pr-3 font-mono">{field.name}</td>
                        <td className="py-1 pr-3 font-mono">
                          {field.isNullable
                            ? `${field.type} | null`
                            : field.type}
                        </td>
                        <td className="py-1 pr-3">
                          {field.isRequired
                            ? t('product:apiContract.yes')
                            : t('product:apiContract.no')}
                        </td>
                        <td className="py-1">
                          {(
                            [
                              'minLength',
                              'maxLength',
                              'minimum',
                              'maximum',
                            ] as const
                          )
                            .filter((rule) => field[rule] !== undefined)
                            .map((rule) =>
                              t(`product:apiContract.${rule}`, {
                                value: formatNumber(field[rule] ?? 0),
                              })
                            )
                            .join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </dd>
            </div>
          )}
          <div className="flex min-w-0 flex-col gap-1">
            <dt className="font-medium">
              {t('product:apiContract.expectedResponse')}
            </dt>
            <dd>
              {route.response === undefined ? (
                <span className="text-muted-foreground">
                  {t('product:apiContract.noContent')}
                </span>
              ) : (
                <pre className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs">
                  {toJson(route.response)}
                </pre>
              )}
            </dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
};
