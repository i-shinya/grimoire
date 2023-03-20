<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { Prompt } from "../../store/property";
import PromptInput from "../atoms/PromptInput.vue";
import {
  analyzeSpell,
  EmphasisSymbolType,
  RestraintSymbolType,
} from "../../core/prompt";
import AddButton from "../atoms/AddButton.vue";

const props = defineProps<{
  label: "Positive Prompt" | "Negative Prompt";
  prompt: Prompt[];
  emphasisSymbolType: EmphasisSymbolType;
  restraintSymbolType: RestraintSymbolType;
}>();

const emits = defineEmits<{
  (e: "send-val", prompt: Prompt[]): void;
}>();

const prompts = ref<Prompt[]>([]);

// v-forの配列を取得する用
let editorRowRefs: any[] = [];
const setEditorRowRefs = (el: any): void => {
  if (!el) return;
  editorRowRefs.push(el);
};

const getNextId = (): number => {
  return prompts.value.length !== 0
    ? prompts.value.map((val) => val.id).reduce((a, b) => Math.max(a, b)) + 1
    : 1;
};

const receiveVal = (index: number, val: string) => {
  const values = val.split(",");
  const length = values.length;
  values.forEach((value, i) => {
    const spell = analyzeSpell(
      value,
      props.emphasisSymbolType,
      props.restraintSymbolType
    );
    if (i === 0) {
      // カンマ区切りじゃなかったらそのまま上書き
      prompts.value[index].spell = spell.spell;
      prompts.value[index].emphasis =
        prompts.value[index].emphasis + spell.emphasis;
    } else {
      // カンマ区切りだったら新規行を追加
      prompts.value.splice(index + i, 0, {
        id: getNextId(),
        spell: spell.spell.trim(), // こっちは明示的にtrimしとく
        emphasis: spell.emphasis,
      });
    }
  });

  emits("send-val", prompts.value);

  // 最後の列にフォーカスする
  nextTick(() => {
    // 手動入力を想定、その場合は次の行をフォーカス
    if (length === 2) {
      focusInput(index + 1);
    }
  });
};

const emphasis = (index: number) => {
  prompts.value[index].emphasis = prompts.value[index].emphasis + 1;
  emits("send-val", prompts.value);
};

const restraint = (index: number) => {
  prompts.value[index].emphasis = prompts.value[index].emphasis - 1;
  emits("send-val", prompts.value);
};

const focusInput = (target: number) => {
  const rowEl = editorRowRefs[target] as Element;
  const borderArea = rowEl.childNodes.item(0);
  const inputArea = borderArea.childNodes.item(1);
  let input: HTMLInputElement | undefined;
  inputArea.childNodes.forEach((el) => {
    if (el.nodeName === "INPUT") {
      input = el as HTMLInputElement;
      input.focus();
    }
  });
};

const addPrompt = () => {
  prompts.value.push({ id: getNextId(), spell: "", emphasis: 0 });
  emits("send-val", prompts.value);

  // 最後の列にフォーカスする
  nextTick(() => {
    focusInput(editorRowRefs.length - 1);
  });
};

const addNextPrompt = (index: number) => {
  prompts.value.splice(index + 1, 0, {
    id: getNextId(),
    spell: "",
    emphasis: 0,
  });
  emits("send-val", prompts.value);

  nextTick(() => {
    focusInput(index + 1);
  });
};

const addBeforePrompt = (index: number) => {
  prompts.value.splice(index, 0, { id: getNextId(), spell: "", emphasis: 0 });
  emits("send-val", prompts.value);

  nextTick(() => {
    focusInput(index);
  });
};

const deletePrompt = (index: number) => {
  prompts.value.splice(index, 1);
  emits("send-val", prompts.value);

  // 削除後の同じindexに行があったらフォーカスする
  nextTick(() => {
    if (editorRowRefs.length === 0) {
      return;
    }
    // 最後の行の場合は一個前にフォーカス
    let target = editorRowRefs.length - 1 < index ? index - 1 : index;
    focusInput(target);
  });
};

// 行を上に移動する
const moveToUp = (index: number) => {
  if (index === 0) {
    return;
  }
  let tmp = prompts.value[index - 1]; // 入れ替え対象をtmpに
  prompts.value[index - 1] = prompts.value[index]; // 対象indexに値を設定
  prompts.value[index] = tmp;
  emits("send-val", prompts.value);

  nextTick(() => {
    focusInput(index - 1);
  });
};

// 行を下に移動する
const moveToDown = (index: number) => {
  if (index === prompts.value.length - 1) {
    return;
  }
  let tmp = prompts.value[index + 1]; // 入れ替え対象をtmpに
  prompts.value[index + 1] = prompts.value[index]; // 対象indexに値を設定
  prompts.value[index] = tmp;
  emits("send-val", prompts.value);

  nextTick(() => {
    focusInput(index + 1);
  });
};

// インプットで入力されたキー入力を判定
const inputKeyDown = (index: number, event: KeyboardEvent) => {
  // console.log(event);
  if (event.code === "ArrowDown") {
    if (index === prompts.value.length - 1) {
      // 最後の行だった場合何もしない
      return;
    }
    if (event.ctrlKey) {
      // 行を下に移動
      moveToDown(index);
    } else {
      // 次の要素をフォーカスする
      focusInput(index + 1);
    }
  } else if (event.code === "ArrowUp") {
    if (index === 0) {
      // 最初の行だった場合何もしない
      return;
    }
    if (event.ctrlKey) {
      // 行を上に移動
      moveToUp(index);
    } else {
      // 前の要素をフォーカスする
      focusInput(index - 1);
    }
  } else if (event.code === "Enter") {
    if (event.shiftKey) {
      addBeforePrompt(index);
    } else {
      addNextPrompt(index);
    }
  } else if (event.code === "Delete") {
    if (event.ctrlKey) {
      deletePrompt(index);
    }
  }
};

watch(
  () => props.prompt,
  (state) => {
    prompts.value = state;
    editorRowRefs = [];
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="prompt-editor">
    <div class="label-area">
      <div class="label mb-2 mr-2">{{ label }}</div>
    </div>
    <div class="editor-area">
      <div
        class="editor-row mb-1"
        v-for="(item, index) in prompts"
        key="id"
        :ref="setEditorRowRefs"
      >
        <div class="editor-border-area" :class="item.id">
          <div class="up-down-icon mr-3">
            <font-awesome-icon
              class="clickable"
              icon="fa-solid fa-angle-up"
              @click="moveToUp(index)"
            />
            <font-awesome-icon
              class="clickable"
              icon="fa-solid fa-angle-down"
              @click="moveToDown(index)"
            />
          </div>
          <PromptInput
            class="prompt-input mr-3"
            :value="item.spell"
            @send-val="(v: string) => receiveVal(index, v)"
            @key-down="(e: KeyboardEvent) => inputKeyDown(index, e)"
          ></PromptInput>
          <div class="emphasis-area">
            <font-awesome-icon
              class="clickable mr-2"
              icon="fa-solid fa-arrow-down-wide-short"
              @click="restraint(index)"
            />
            <font-awesome-icon
              class="clickable mr-2"
              icon="fa-solid fa-arrow-up-wide-short"
              @click="emphasis(index)"
            />
            <div class="emphasis">
              <template v-if="item.emphasis >= 0">
                <span class="pr-1">{}</span>
                <span class="pr-1">&times;</span>
                <span>{{ item.emphasis }}</span>
              </template>
              <template v-else>
                <span class="pr-1">[]</span>
                <span class="pr-1">&times;</span>
                <span>{{ -item.emphasis }}</span>
              </template>
            </div>
          </div>
        </div>
        <div class="delete-icon ml-1">
          <font-awesome-icon
            class="clickable"
            icon="fa-solid fa-trash-can"
            @click="deletePrompt(index)"
          />
        </div>
      </div>
      <AddButton
        class="mt-3"
        :showText="prompts.length !== 0"
        text="click or press EnterKey"
        @click="addPrompt"
      ></AddButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

.prompt-editor {
  width: 100%;
  height: 100%;
  background-color: rgb(37, 18, 18);
  padding: 12px;
  overflow-y: auto;

  /* スクロール幅 */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  /* スクロール背景 */
  &::-webkit-scrollbar-track {
    border-radius: 5px;
    background: rgba(110, 108, 108, 0.2);
  }
  /* ドラック部 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #acb2c7;
  }

  .label-area {
    display: flex;
    .label {
      padding-left: 4px;
    }
  }

  .editor-area {
    .editor-row {
      display: flex;
      align-items: center;
      font-size: 14px;

      .editor-border-area {
        display: flex;
        border: 1px solid rgb(129, 129, 129);
        background-color: rgb(54, 54, 54);
        padding-left: 4px;
        padding-right: 4px;
        align-items: center;
        flex-grow: 1;

        // 子要素がフォーカスされていたら
        &:focus-within {
          background-color: rgb(73, 70, 70);
        }

        .prompt-input {
          flex-grow: 1;
        }

        .emphasis-area {
          display: flex;
          flex-grow: 0;
          align-items: center;

          .emphasis {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .up-down-icon {
          display: flex;
          flex-flow: column;
          font-size: 14px;
          flex-grow: 0;
          justify-content: center;
        }
      }

      .delete-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20px;
        width: 20px;
        font-size: 14px;
      }
    }

    .plus-button {
      width: 100%;
      display: flex;
      border: 1px solid rgb(255, 255, 255);
      padding: 2px;
      justify-content: center;

      .plus-icon {
        height: 13px;
        width: 13px;
        border: 1px solid rgb(255, 255, 255);
        border-radius: 50%;
      }

      .shortcut-text {
        color: rgb(182, 182, 182);
        font-size: 13px;
      }
    }
  }
}
</style>
