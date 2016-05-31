FROM golang:1.6.2-alpine

ENV GDAL_VERSION 2.0.1

RUN echo "@edge http://nl.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
RUN echo "@testing http://nl.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

RUN apk update && apk add \
  curl \
  git \
  alpine-sdk \
  autoconf \
  automake \
  libtool \
  mongodb-tools@testing

RUN curl -o gdal-${GDAL_VERSION}.tar.gz -sSL http://download.osgeo.org/gdal/2.0.1/gdal-${GDAL_VERSION}.tar.gz && \
  tar xzf gdal-${GDAL_VERSION}.tar.gz && \
  cd ./gdal-${GDAL_VERSION} && \
  ./configure && \
  make -s && \
  make -s install

ENV GOBIN $GOPATH/bin

WORKDIR /app
ADD . .

RUN go get ./...
