# Build
FROM node:14.5.0-alpine as node-build

WORKDIR /usr/src/app
COPY . ./
RUN yarn install

ARG SERVER_PORT=3000
ARG APP_NAME=APP_1
ENV SERVER_PORT=$SERVER_PORT
ENV APP_NAME=$APP_NAME

EXPOSE $SERVER_PORT
ENTRYPOINT ["node"]
CMD ["server.js"]
