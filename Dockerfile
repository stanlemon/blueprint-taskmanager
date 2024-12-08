FROM node:20@sha256:f4755c9039bdeec5c736b2e0dd5b47700d6393b65688b9e9f807ec12f54a8690

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN npm install

CMD [ "npm", "start" ]
