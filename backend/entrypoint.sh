#!/bin/sh

DB_HOST="${POSTGRES_HOST:-db}"
DB_PORT="${POSTGRES_PORT:-5432}"

echo "Waiting for postgres at ${DB_HOST}:${DB_PORT}..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "Postgres is up. Applying migrations..."
python manage.py migrate --noinput

echo "Starting Django development server..."
exec python manage.py runserver 0.0.0.0:8000
