FROM node:21.6.0-alpine3.18

WORKDIR /usr/local/app

RUN apk add --no-cache curl tar && \
   curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v3.17.3/protoc-3.17.3-linux-x86_64.zip && \
   unzip protoc-3.17.3-linux-x86_64.zip -d /usr/local && \
   rm -f protoc-3.17.3-linux-x86_64.zip

COPY package.json package-lock.json /usr/local/app/

RUN npm install && npm cache clean --force

RUN npm install pm2 typescript -g

RUN npm i -g @nestjs/cli

COPY ./ /usr/local/app/

RUN npm run build

EXPOSE 3500

CMD [ "pm2-runtime","start","ecosystem.config.js" ]