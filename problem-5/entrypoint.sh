#!/bin/sh
set -e

# migration
bunx sequelize-cli db:migrate

# Start the main process.
exec "$@"