FROM node:7
WORKDIR /dist
COPY . /public/dist/bundle.js
RUN npm install
CMD mysql -u root < ./server/db/schema.sql && node server/index.js && webpack
EXPOSE 3000