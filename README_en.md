# Grimoire

Grimoire is a desktop application for managing AI illustrations.

Currently, only support Nodel AI prompt and, only the window version application is available.

## user guide

You can see how to use Grimoire in [Wiki Page](https://github.com/i-shinya/grimoire/wiki/Girmoire-User-Guide).

## Demo Page

You can try Grimoire on the [Demo Page](https://i-shinya.github.io/grimoire/).

## download

Grimoire can be downloaded from [release page](https://github.com/i-shinya/grimoire/releases)

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

## SNS

i-shinya (@ishinya4)
https://twitter.com/IT41394313
