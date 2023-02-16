# Grimoire

Grimoire is a desktop application for managing AI illustrations.

Currently, only support Nodel AI prompt and, only the window version application is available.

## user guide

TODO

## Demo Page

You can try Grimoire on the [Demo Page](https://i-shinya.github.io/grimoire/).

## install

Grimoire can be installed from [release page](https://github.com/i-shinya/grimoire/releases)

---

# for Development

## test

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

The artifact is output to `release/win`.

We use docker for builds so as not to affect the build environment.

```shell
docker compose up --build
```
