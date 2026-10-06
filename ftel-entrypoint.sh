#!/bin/sh
set -eu

case "$VITE_API_BASE_URL" in
  http://*|https://*) ;;
  *)
    echo "Erreur : VITE_API_BASE_URL doit être une URL commençant par http:// ou https:// (valeur reçue : '$VITE_API_BASE_URL')." >&2
    exit 1
    ;;
esac

api_base_url=$(printf '%s' "${VITE_API_BASE_URL%/}" | sed -e 's/[\&|]/\&/g')

find /app/output -mindepth 1 -delete
cp -R /app/template/. /app/output/

grep -rl 'ftel-api-base-url\.invalid' /app/output | while read -r file; do
  sed -i "s|https://ftel-api-base-url\.invalid|${api_base_url}|g" "$file"
done

echo "FTELMarket front : port 3000 du conteneur -> API ${VITE_API_BASE_URL}"

export HOST=0.0.0.0 PORT=3000
exec node /app/output/server/index.mjs
