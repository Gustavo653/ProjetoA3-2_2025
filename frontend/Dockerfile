# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json angular.json tsconfig*.json ./ 
RUN npm install && npm install -g @angular/cli
COPY src ./src
RUN ng build --output-path=dist
# runtime
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
