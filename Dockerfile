FROM node:10-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# RUN mkdir -p /home/node/schedule_service && chown -R node:node /home/node/schedule_service

WORKDIR /home/node/collaudo_backend

# USER node

ADD . /home/node/collaudo_backend

RUN npm config set unsafe-perm true

RUN mkdir /home/node/collaudo_backend/logs
RUN chmod 755 /home/node/collaudo_backend/logs
RUN npm install pm2 -g --silent

EXPOSE 3000

CMD [ "pm2-runtime", "index.js" ]