FROM node:14-alpine

WORKDIR /opt/app

VOLUME /opt/app/dist
VOLUME /opt/app/src

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# COPY . .
# CMD ["ls", "./src"]
CMD [ "npm", "run", "tt" ]