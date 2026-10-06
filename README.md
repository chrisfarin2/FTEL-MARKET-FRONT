# FTELMarket — front fourni

Ce front est **fourni et déjà écrit**. Votre travail porte sur l'API : toute la logique métier — validation, règles de gestion, persistance — vit dans le back que vous développez en .NET. Le front se contente d'afficher et de collecter.

Il n'embarque ni base de données, ni authentification, ni couche serveur : il appelle votre API par HTTP, et rien d'autre. Tant que celle-ci n'est pas démarrée, les écrans affichent une erreur explicite — c'est normal, et c'est votre point de départ.

## Origine du code

- **Starter** : ce projet repose sur [Start UI \[web\]](https://github.com/BearStudio/start-ui-web), le starter open source de la 🐻 [BearStudio Team](https://www.bearstudio.fr/), allégé de sa couche serveur. Le code d'origine reste la propriété de ses auteurs et est distribué sous sa licence (voir `LICENSE`).
- **Rajouts** : tous les ajouts et modifications apportés par-dessus ce starter (écrans, features, client API, configuration spécifique à FTELMarket) ont été **générés par IA**.

## Démarrer

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

### Configuration

Créez un fichier `.env` à la racine de `Client/` :

```dotenv
# URL publique du front lui-même
VITE_BASE_URL=http://localhost:3000

# Racine de votre API, terminaison /api incluse
VITE_API_BASE_URL=http://localhost:5082/api
```

`VITE_API_BASE_URL` est **le seul point de configuration** entre ce front et votre API. Tout le reste — les routes, les noms de champs, les codes HTTP — suit le contrat d'API qui vous est communiqué.

> **Attention au port.** `dotnet run` démarre le profil `http` et n'écoute que sur `5082`. Le port HTTPS `7236` n'existe qu'avec `dotnet run --launch-profile https`, et exige en plus un certificat approuvé (`dotnet dev-certs https --trust`). Pointer le front sur un port qui n'écoute pas produit dans le navigateur une erreur trompeuse, présentée comme un problème de CORS alors que la connexion n'a simplement pas abouti.
>
> Si vous préférez HTTPS, lancez l'API avec le profil `https` et mettez `VITE_API_BASE_URL=https://localhost:7236/api`.

### Deux points qui vous concernent côté API

**CORS.** Le front tourne sur `http://localhost:3000`, votre API sur un autre port : le navigateur bloquera les appels tant que votre API n'autorise pas explicitement cette origine. C'est la première erreur que vous rencontrerez, et elle se règle dans votre API, pas ici.

**Pagination.** La page produits envoie `?page=&pageSize=` à chaque appel. L'API du TP 1 les ignore volontairement et renvoie le catalogue complet : le front filtre et pagine alors en mémoire. Ces paramètres deviendront utiles dans un module ultérieur.

## Scripts

| Commande         | Effet                                     |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Serveur de développement sur le port 3000 |
| `pnpm build`     | Build de production                       |
| `pnpm storybook` | Catalogue des composants sur le port 6006 |
| `pnpm lint`      | Typecheck TypeScript + oxlint             |
| `pnpm format`    | Formatage du code                         |

## Où regarder

| Chemin                    | Rôle                                                       |
| ------------------------- | ---------------------------------------------------------- |
| `src/lib/api/client.ts`   | Appels HTTP vers l'API                                     |
| `src/lib/api/errors.ts`   | Normalisation des deux formats d'erreur renvoyés par l'API |
| `src/features/product/`   | Écran produits : liste, formulaire, schémas, hooks         |
| `src/features/category/`  | Chargement des catégories                                  |
| `src/routes/produits.tsx` | La route                                                   |
