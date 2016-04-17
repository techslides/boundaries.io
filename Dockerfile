FROM mhart/alpine-node:5.9

RUN apk add --no-cache \
  make \
  gcc \
  g++ \
  curl \
  git \
  unzip \
  zlib-dev

ENV NODE_ENV production

WORKDIR /app
ADD . .

EXPOSE 3334

RUN npm install

CMD node app.js
