FROM node:lts-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json /app/

RUN npm install -g serve

RUN yarn install

COPY ./ /app/

RUN yarn run build
