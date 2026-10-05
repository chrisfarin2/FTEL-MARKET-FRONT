import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import type { ApiError } from './errors';

/**
 * ASP.NET Core nomme les cles du dictionnaire `errors` d'apres les proprietes
 * C# : elles arrivent en PascalCase (`Name`, `CategoryId`), alors que les
 * champs du formulaire sont en camelCase. Constate sur la reponse reelle de
 * l'API, pas suppose.
 *
 * L'operation est sans effet sur une cle deja en camelCase : si la
 * serialisation venait a changer, ce code continuerait de fonctionner.
 */
const toFieldName = (key: string) => key.charAt(0).toLowerCase() + key.slice(1);

/**
 * Reinjecte les erreurs de validation du serveur dans le formulaire.
 *
 * Un champ peut porter plusieurs messages — le contrat exige qu'ils soient
 * tous affiches.
 *
 * Renvoie `true` si au moins une erreur a pu etre associee a un champ, ce qui
 * permet a l'appelant de n'afficher un toast generique que dans le cas
 * contraire.
 */
export const applyServerFieldErrors = <TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  error: ApiError
): boolean => {
  // Toutes les cles ne designent pas un champ du formulaire. Une erreur de
  // deserialisation JSON, par exemple, remonte sous `request` et `$.stock` :
  // les poser via setError les rendrait invisibles, et l'utilisateur n'aurait
  // aucun retour. On ne retient donc que les cles reellement connues, et
  // l'appelant affiche un toast lorsqu'aucune n'a pu etre placee.
  const knownFields = new Set(Object.keys(form.getValues()));
  let appliedCount = 0;

  Object.entries(error.fieldErrors).forEach(([key, messages]) => {
    const field = toFieldName(key);

    if (!knownFields.has(field)) return;

    form.setError(field as Path<TFieldValues>, {
      message: messages.join(' '),
    });
    appliedCount += 1;
  });

  return appliedCount > 0;
};
