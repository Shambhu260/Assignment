
FROM node:alpine
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . /var/app
RUN npm install --production
RUN npm run docs
EXPOSE 7777
CMD [ "npm", "start" ]
  