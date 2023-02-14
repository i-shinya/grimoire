# grimoire

Grimoire is a desktop tool for managing AI illustrations.

Currently only the window version of the app is available.

## user guide

TODO

## install

Grimoire can be installed from [release page](https://github.com/i-shinya/grimoire/releases)

---

# for Developer

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
