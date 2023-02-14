# windowsアプリビルド用
# CI環境はgithubactions上で行えば良さそう
FROM node:18-slim

RUN dpkg --add-architecture i386
RUN apt-get update
RUN apt-get install -y wine
RUN apt-get install -y wine32

WORKDIR /app

COPY ./ /app/
RUN npm ci

CMD bash -c "npm run electron:build-win && chmod -R 777 ./release"
