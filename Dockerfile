FROM node:7
WORKDIR /app
COPY . /app
RUN npm install
CMD node server/index.js && webpack
EXPOSE 3001