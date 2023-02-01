export function getDirectroyName(pathName: string) {
  return pathName.split("\\").pop()?.split("/").pop();
}

export const getBaseDirName = (pathName: string) => {
  const directoryName = pathName.split("\\").pop()?.split("/").pop();
  return pathName
    .split(`\\${directoryName}`)
    .shift()
    ?.split(`/${directoryName}`)
    .shift();
};
