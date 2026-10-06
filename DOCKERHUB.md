# FTELMarket — front

Front web fourni du projet fil rouge **FTELMarket**. Il affiche et collecte les données : toute la logique métier vit dans **votre API .NET**, que ce front appelle par HTTP.

Sources : [github.com/chrisfarin2/FTEL-MARKET-FRONT](https://github.com/chrisfarin2/FTEL-MARKET-FRONT)

> **Cette image est la méthode conseillée pour lancer le front pendant les TP** : rien à installer à part Docker, pas de Node ni de pnpm. En cas de bug côté front, passez par les sources et lancez-le en local pour débugger (voir [Un souci pendant le TP ?](#un-souci-pendant-le-tp-)) : **l'IA est autorisée pour débugger le front !**

## Lancer le front

Créez un fichier `docker-compose.yml` :

```yaml
services:
  ftelmarket-front:
    image: farinchris/ftelmarket-front:latest
    container_name: ftelmarket-front
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: "http://localhost:5082/api"
    restart: unless-stopped
```

Puis :

```bash
docker compose up -d
```

Le front est disponible sur [http://localhost:3000](http://localhost:3000).

Le port 3000 est déjà pris sur votre machine ? Changez uniquement le port de gauche, par exemple `"8081:3000"` : le conteneur écoute toujours sur `3000` en interne.

Pour l'arrêter :

```bash
docker compose down
```

## Pointer vers votre API

`VITE_API_BASE_URL` est l'URL racine de votre API, terminaison `/api` incluse. Elle est lue **au démarrage du conteneur** : modifiez-la dans le `docker-compose.yml`, puis relancez `docker compose up -d`.

| Lancement de l'API                         | Valeur de `VITE_API_BASE_URL`             |
| ------------------------------------------ | ----------------------------------------- |
| `dotnet run` (profil `http`, par défaut)   | `http://localhost:5082/api` (par défaut)  |
| `dotnet run --launch-profile https`        | `https://localhost:7236/api`              |

Ce sont **votre navigateur** et votre API qui communiquent, pas le conteneur : `localhost` désigne donc bien votre machine. Inutile d'utiliser `host.docker.internal`.

N'oubliez pas d'autoriser l'origine `http://localhost:3000` dans la configuration **CORS** de votre API, sinon le navigateur bloquera les appels. Si vous avez changé le port exposé, autorisez ce port-là.

## Un souci pendant le TP ?

Si le front se comporte bizarrement, arrêtez le conteneur (`docker compose down`) et lancez le front directement sur votre machine depuis les sources pour le **débugger** : [github.com/chrisfarin2/FTEL-MARKET-FRONT](https://github.com/chrisfarin2/FTEL-MARKET-FRONT).

Prérequis : Node.js 22 ou plus et pnpm.

```bash
git clone https://github.com/chrisfarin2/FTEL-MARKET-FRONT.git
cd FTEL-MARKET-FRONT
pnpm install
```

Créez un fichier `.env` à la racine du dépôt :

```dotenv
VITE_BASE_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:5082/api
```

Puis :

```bash
pnpm dev            # http://localhost:3000
```

Le `README` du dépôt détaille le reste (scripts, organisation du code).

Si le problème vient du front, **l'IA est autorisée** pour vous aider à le débugger.
