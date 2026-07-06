#!/usr/bin/env sh
set -eu

cd /app

if [ "${RUN_MIGRATIONS:-1}" = "1" ]; then
  pnpm db:migrate
fi

exec pnpm start
