FROM mhart/alpine-node:5.9

RUN apk add --no-cache \
  make \
  gcc \
  g++ \
  curl \
  git \
  unzip \
  zlib-dev

ENV NPM_CONFIG_PREFIX /node_modules

ENV NODE_ENV development

WORKDIR /app
ADD . .

EXPOSE 3334

RUN npm install

CMD node app.js
