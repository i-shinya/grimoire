import { InjectionKey } from "vue";
import { DirectoryStore } from "./directory";

const DirectoryKey: InjectionKey<DirectoryStore> = Symbol("directoryStore");
export default DirectoryKey;
