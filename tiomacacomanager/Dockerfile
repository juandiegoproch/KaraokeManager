#Build
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm run build

#Create deployment artifact
FROM httpd:2.4
RUN rm -rf /usr/local/apache2/htdocs/*
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/
# Customize for SPA
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
COPY redirect_apache.conf /usr/local/apache2/conf/extra/app.conf
RUN echo "Include conf/extra/app.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80