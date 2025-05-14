# Frontend Dockerfile
FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Nginx image to serve the Angular app
FROM nginx:alpine

COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80
