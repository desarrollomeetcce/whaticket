FROM node:14
  
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/backend

ADD . /usr/src/app/backend

WORKDIR /usr/src/app/backend
RUN npm install
RUN npm run build 

CMD ["npm", "start"]
