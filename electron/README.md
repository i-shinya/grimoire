# electron

package for electron main process 

## test

```shell
npm run test
```

## start app dev or debug

### dev mode

In dev mode, electron window displays resources loaded from `http://localhost:3000`.

Please use debug mode if you want to use Chrome developer console.

```shell
npm run app:dev
```

### debug mode

The difference from dev mode is that Chrome developer console is displayed.

```shell
npm run app:debug
```

## build

Currently, only the Windows version is still buildable.

please build in parent directory.

```shell
cd .. && electron:build-win
```

※ Currently, build with `signAndEditExecutable: false`, so permission is required to run the application.
