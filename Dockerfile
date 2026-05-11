FROM node:14.17.0-alpine AS builder
WORKDIR /usr/src/app
RUN apk add --no-cache bash git openssh

COPY . .

RUN yarn cache clean && yarn install && yarn run build

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
