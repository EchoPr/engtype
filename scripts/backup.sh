#!/usr/bin/env bash
# Daily SQLite backup from the app volume, safe while the app is running (sqlite3 .backup).
# Cron: 15 3 * * * root /opt/engtype/scripts/backup.sh
set -euo pipefail
VOLUME="${VOLUME:-engtype_appdata}"
DEST="${DEST:-/var/backups/engtype}"
KEEP_DAYS="${KEEP_DAYS:-14}"

src="$(docker volume inspect -f '{{ .Mountpoint }}' "$VOLUME")/app.db"
mkdir -p "$DEST" && chmod 700 "$DEST"
# SUFFIX tells ad-hoc backups (e.g. before a deploy) apart from the nightly one of the same day
out="$DEST/app-$(date +%F)${SUFFIX:+-$SUFFIX}.db"
sqlite3 "$src" ".backup '$out'"
gzip -f "$out"
find "$DEST" -name 'app-*.db.gz' -mtime +"$KEEP_DAYS" -delete
