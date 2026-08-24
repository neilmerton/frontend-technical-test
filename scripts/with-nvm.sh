#!/usr/bin/env bash
# Loads nvm and switches to the Node version pinned in .nvmrc before
# running the command passed as arguments. Needed because npm scripts
# run in a non-interactive shell, and nvm is a shell function rather
# than a binary on PATH.
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm use
else
  echo "with-nvm: nvm not found at $NVM_DIR, continuing with system Node ($(node -v))" >&2
fi

exec "$@"
