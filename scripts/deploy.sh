#!/usr/bin/env bash
# Deploys a commit of main on the server: backup, checkout, rebuild, health check.
# By hand:     /opt/engtype/scripts/deploy.sh [commit]      (default: latest origin/main)
# From CI:     the deploy key is restricted to this script; the commit comes in SSH_ORIGINAL_COMMAND.
# Rollback:    run it with an older commit (migrations only go forward, so restore a backup if one ran).
set -euo pipefail
cd "$(dirname "$0")/.."

ref="${1:-${SSH_ORIGINAL_COMMAND:-}}"
git fetch -q origin main
if [ -z "$ref" ]; then
  ref=origin/main
elif ! [[ "$ref" =~ ^[0-9a-f]{7,40}$ ]]; then
  echo "refusing to deploy '$ref': expected a commit hash" >&2
  exit 2
fi
commit="$(git rev-parse --verify "$ref^{commit}")"
git merge-base --is-ancestor "$commit" origin/main || { echo "$commit is not on main" >&2; exit 2; }

echo "==> backup"
SUFFIX="predeploy-$(date +%H%M%S)" "$(dirname "$0")/backup.sh"

echo "==> deploying $(git log -1 --format='%h %s' "$commit")"
git checkout -q --detach "$commit"
docker compose up -d --build --remove-orphans

echo "==> health check"
domain="$(grep -E '^SITE_DOMAIN=' .env | cut -d= -f2-)"
for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null --resolve "$domain:443:127.0.0.1" "https://$domain/"; then
    echo "==> ok: https://$domain is up on $(git rev-parse --short HEAD)"
    docker image prune -f >/dev/null
    exit 0
  fi
  sleep 2
done
echo "health check failed, recent app logs:" >&2
docker compose logs app --tail 40 >&2
exit 1
