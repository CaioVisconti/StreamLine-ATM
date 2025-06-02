FROM mysql:latest
WORKDIR /
ENV MYSQL_ROOT_PASSWORD=urubu100
COPY ./arquivos/ /docker-entrypoint-initdb.d/
EXPOSE 3306