#stage 1:
    FROM node:latest as node
    WORKDIR /app
    copy . .
    RUN npm install
    RUN npm run build --prod

    #Stage 2
    FROM nginx:alpine
    COPY --from=node /app/dist /usr/share/nginx/html