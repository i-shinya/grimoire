# Grimoire

Grimoire はAIイラスト管理用のデスクトップアプリです。

現状はWindows版のみ提供しています。

[README in English](./README_en.md)

## ユーザガイド

TODO

## デモページ

Grimoireの一部機能を [デモページ](https://i-shinya.github.io/grimoire/) で試すことができます。

## インストール

Grimoireは [release page](https://github.com/i-shinya/grimoire/releases) からインストール可能です。

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
