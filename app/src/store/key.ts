import { InjectionKey } from "vue";
import { DirectoryStore } from "./directory";
import { ImageStore } from "./image";
import { PropertyStore } from "./property";
import { AreaVisiblilityStore } from "./area-visibility";

export const DirectoryKey: InjectionKey<DirectoryStore> =
  Symbol("directoryStore");

export const ImageKey: InjectionKey<ImageStore> = Symbol("imageStore");

export const PropertyKey: InjectionKey<PropertyStore> = Symbol("propertyStore");

export const AreaVisibilityKey: InjectionKey<AreaVisiblilityStore> = Symbol(
  "areaVisibilityStore"
);
