## dockerfile
#FROM node:20-alpine AS build
#LABEL authors="Kuldeep"
#
#WORKDIR /app
#
## copy package files first for layer caching
#COPY package*.json ./
#
## install dependencies (reproducible)
#RUN npm ci
#
## copy source and build
#COPY . .
#RUN npm run build
#
#FROM nginx:alpine
#LABEL authors="Kuldeep"
#
## adjust this path if your build outputs to a different folder
#COPY --from=build /app/dist /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS build
LABEL authors="Kuldeep"
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
LABEL authors="Kuldeep"
# Copy built static files to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html
# Overwrite default Nginx config with your custom proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
