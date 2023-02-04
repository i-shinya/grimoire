# アプリビルド用とりあえずwindows用
FROM node:18-slim

RUN dpkg --add-architecture i386
RUN apt-get update
RUN apt-get install -y wine
RUN apt-get install -y wine32
# これいらんかも
RUN apt-get install -y libwine

WORKDIR /app

COPY ./ /app/
RUN npm i

CMD bash -c "npm run app:build-win && chmod -R 777 ./release"
