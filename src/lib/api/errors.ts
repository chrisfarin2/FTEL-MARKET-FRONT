/**
 * L'API FTELMarket renvoie deux formats d'erreur distincts, et c'est assume :
 *
 * 1. Les erreurs de validation de forme suivent ProblemDetails (RFC 9457),
 *    produit automatiquement par `[ApiController]` cote .NET. Elles portent un
 *    dictionnaire `errors` associant un champ a une ou plusieurs erreurs.
 *
 * 2. Les erreurs metier (ressource introuvable, categorie inexistante) sont un
 *    simple objet `{ "message": "..." }`.
 *
 * `parseApiError` ramene les deux a une forme unique pour que l'interface n'ait
 * jamais a s'en preoccuper.
 */

export type ApiError = {
  /** Message affichable, toujours en francais. */
  message: string;
  /** Statut HTTP, 0 lorsque la requete n'a pas abouti du tout. */
  status: number;
  /** Erreurs par champ, telles que renvoyees par le serveur. */
  fieldErrors: Record<string, string[]>;
  /** Vrai quand l'API n'a pas repondu (arretee, injoignable, CORS). */
  isNetworkError: boolean;
};

type ProblemDetails = {
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const parseApiError = async (response: Response): Promise<ApiError> => {
  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    // Une reponse d'erreur sans corps JSON reste une erreur exploitable.
  }

  if (isRecord(body) && typeof body.message === 'string') {
    return {
      message: body.message,
      status: response.status,
      fieldErrors: {},
      isNetworkError: false,
    };
  }

  if (isRecord(body) && isRecord(body.errors)) {
    const problem = body as ProblemDetails;
    return {
      // Ce message ne sert que lorsque aucune erreur n'a pu etre rattachee a un
      // champ : il reste donc volontairement neutre, sans renvoyer l'utilisateur
      // vers des champs qui ne seraient pas signales.
      message: problem.detail ?? 'La saisie a été refusée par le serveur.',
      status: response.status,
      fieldErrors: problem.errors ?? {},
      isNetworkError: false,
    };
  }

  return {
    message: `L'API a répondu une erreur ${response.status}.`,
    status: response.status,
    fieldErrors: {},
    isNetworkError: false,
  };
};

export const networkError = (): ApiError => ({
  message:
    "L'API est injoignable. Vérifiez qu'elle est démarrée et que VITE_API_BASE_URL pointe au bon endroit.",
  status: 0,
  fieldErrors: {},
  isNetworkError: true,
});

export const isApiError = (error: unknown): error is ApiError =>
  isRecord(error) &&
  typeof error.message === 'string' &&
  typeof error.status === 'number' &&
  'fieldErrors' in error;
