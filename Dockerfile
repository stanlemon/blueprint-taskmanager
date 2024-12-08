FROM node:22.10.0@sha256:da53547a061beb7f11f58ee2231589b999acfca89bdf6dfd740627340c879f63

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN npm install

CMD [ "npm", "start" ]
