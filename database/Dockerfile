FROM postgres:16-alpine

# On copie le script d'initialisation dans le dossier spécial de Postgres
COPY init.sql /docker-entrypoint-initdb.d/

# On s'assure que le fichier est lisible par le système
RUN chmod 644 /docker-entrypoint-initdb.d/init.sql