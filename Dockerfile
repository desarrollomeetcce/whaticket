FROM node:14

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend

ADD frontend /usr/src/app/frontend

RUN ls

WORKDIR /usr/src/app/frontend
RUN npm install


CMD ["npm", "start"]
