FROM node:slim as builder

WORKDIR /home/app

COPY . .

RUN npm i && REACT_APP_API_URL='/api' npm run build


FROM caddy:alpine

WORKDIR /home/app

COPY --from=builder /home/app/build .
COPY Caddyfile /etc/caddy/Caddyfile