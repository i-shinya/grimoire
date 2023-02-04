# アプリビルド用とりあえずwindows用
FROM node:18-slim

RUN apt-get update
RUN apt-get install
RUN apt install -y wine
RUN apt install -y libwine

WORKDIR /app

COPY ./ /app/
RUN npm i

CMD ["npm", "run", "app:build-win"]
