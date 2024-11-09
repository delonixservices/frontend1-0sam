# Stage 1: Build Angular App
FROM node:14 as node
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --verbose
COPY . .
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=node /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost/ || exit 1
