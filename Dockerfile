FROM nginx:latest

ADD ./build /usr/share/nginx/html

COPY nginx.config /etc/nginx/nginx.conf
