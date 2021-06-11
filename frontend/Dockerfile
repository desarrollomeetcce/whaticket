FROM node:14
  
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend

ADD . /usr/src/app/frontend

WORKDIR /usr/src/app/frontend
RUN npm install
RUN npm run build 
RUN npm install -g serve
CMD ["serve","-s", "build"]
