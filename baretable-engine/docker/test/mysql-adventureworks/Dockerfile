FROM mysql/mysql-server:8.0

COPY AdventureWorks.sql.gz /docker-entrypoint-initdb.d/00-AdventureWorks.sql.gz
RUN chmod -R 775 /docker-entrypoint-initdb.d