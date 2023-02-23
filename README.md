# Grimoire

Grimoire はAIイラスト管理用のデスクトップアプリです。

現状はNovel AIのプロンプト対応、Windows版アプリのみ提供しています。

[README in English](./README_en.md)

## ユーザガイド

Grimoireの使い方は [Wiki](https://github.com/i-shinya/grimoire/wiki/Girmoire-User-Guide) から確認できます。

## デモページ

Grimoireの一部機能を [デモページ](https://i-shinya.github.io/grimoire/) で試すことができます。

## ダウンロード

Grimoireは [release page](https://github.com/i-shinya/grimoire/releases) からダウンロード可能です。

---

# 開発用

## テスト

```shell
npm run test
```

## start app dev or debug

### dev mode

```shell
npm run electron:dev
```

### debug

```shell
npm run electron:debug
```

## build

### windows

ビルド成果物は`release/win`に出力されます。

ローカルビルドでは環境の影響を受けないようにdocker内でビルドするようにしています。

```shell
docker compose up --build
```

## SNS

i-shinya (@ishinya4)
https://twitter.com/home
