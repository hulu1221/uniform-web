# base image
FROM docker-registry.lienvietpostbank.com.vn:5000/node_angular:14.15.1-alpine3.12_10.0.0 as builder
# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install and cache app dependencies (if can connetc to internet)
#RUN npm install -g @angular/cli@10.0.0
#COPY package.json /app/package.json
#RUN npm install
# add app
COPY . /app
# start app
#CMD ng serve --host 0.0.0.0
# build
RUN npm run build --prod


# Stage 2
FROM docker-registry.lienvietpostbank.com.vn:5000/nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
## Remove default nginx index page
RUN rm -rf /var/www/uniform-web/*
# Copy from the stage 1
COPY --from=builder /app/dist/smart-form /var/www/uniform-web
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

