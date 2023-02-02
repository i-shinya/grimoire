import { InjectionKey } from "vue";
import { DirectoryStore } from "./index";

const DirectoryKey: InjectionKey<DirectoryStore> = Symbol("directoryStore");
export default DirectoryKey;
