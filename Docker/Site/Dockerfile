FROM node:lts-bookworm AS dependencies
WORKDIR /
COPY ./Site/package.json .
RUN npm install

FROM node:lts-alpine3.20 AS deploy
WORKDIR /
COPY --from=dependencies ./node_modules ./node_modules
COPY ./Site .
EXPOSE 3333
CMD [ "node", "app.js" ]
