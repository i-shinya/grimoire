import { InjectionKey } from "vue";
import { DirectoryStore } from "./directory";
import { ImageStore } from "./image";

export const DirectoryKey: InjectionKey<DirectoryStore> =
  Symbol("directoryStore");

export const ImageKey: InjectionKey<ImageStore> = Symbol("imageStore");
