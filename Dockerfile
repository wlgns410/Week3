FROM node:18.18.2

WORKDIR /app

COPY package*.json ./

# 기존의 node_modules 폴더를 제거합니다.
RUN rm -rf node_modules

RUN npm install

COPY . .

RUN npm run build 

EXPOSE 5001
