import { InjectionKey } from "vue";
import { DirectoryStore } from "./directory";
import { ImageStore } from "./image";
import { PropertyStore } from "./property";
import { AreaVisibilityStore } from "./area-visibility";
import { FavoritePromptStore } from "./favorite-prompt";

export const DirectoryKey: InjectionKey<DirectoryStore> =
  Symbol("DirectoryKey");

export const ImageKey: InjectionKey<ImageStore> = Symbol("ImageKey");

export const PropertyKey: InjectionKey<PropertyStore> = Symbol("PropertyKey");

export const AreaVisibilityKey: InjectionKey<AreaVisibilityStore> =
  Symbol("AreaVisibilityKey");

export const FavoritePromptKey: InjectionKey<FavoritePromptStore> =
  Symbol("FavoritePromptKey");
