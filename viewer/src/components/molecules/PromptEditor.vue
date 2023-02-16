<script setup lang="ts">
import { nextTick, ref, onMounted, watch } from "vue";
import { Prompt } from "../../store/property";
import Input from "../atoms/Input.vue";

const props = defineProps<{
  label: "Positive Prompt" | "Negative Prompt";
  prompt: Prompt[];
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

const receiveVal = (index: number, val: { label: string; value: string }) => {
  prompts.value[index].spell = val.value;
  emits("send-val", prompts.value);
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
  const nextId =
    prompts.value.length !== 0
      ? prompts.value.map((val) => val.id).reduce((a, b) => Math.max(a, b)) + 1
      : 1;
  prompts.value.push({ id: nextId, spell: "", emphasis: 0 });
  emits("send-val", prompts.value);

  // 最後の列にフォーカスする
  nextTick(() => {
    focusInput(editorRowRefs.length - 1);
  });
};

const addNextPrompt = (index: number) => {
  const nextId =
    prompts.value.length !== 0
      ? prompts.value.map((val) => val.id).reduce((a, b) => Math.max(a, b)) + 1
      : 1;
  prompts.value.splice(index + 1, 0, { id: nextId, spell: "", emphasis: 0 });
  emits("send-val", prompts.value);

  nextTick(() => {
    focusInput(index + 1);
  });
};

const addBeforePrompt = (index: number) => {
  const nextId =
    prompts.value.length !== 0
      ? prompts.value.map((val) => val.id).reduce((a, b) => Math.max(a, b)) + 1
      : 1;
  prompts.value.splice(index, 0, { id: nextId, spell: "", emphasis: 0 });
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
  // console.log(val.event);
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
    deletePrompt(index);
  }
};

onMounted(() => {
  prompts.value = props.prompt ?? [];
});
watch(
  () => props.prompt,
  (state) => {
    prompts.value = state;
    editorRowRefs = [];
  }
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
          <Input
            class="prompt-input mr-3"
            :label="null"
            :value="item.spell"
            @send-val="(v: any) => receiveVal(index, v)"
            @key-down="(v: any) => inputKeyDown(index, v)"
          ></Input>
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
                <div>{}</div>
                <div>&times;</div>
                <div>{{ item.emphasis }}</div>
              </template>
              <template v-else>
                <div>[]</div>
                <div>&times;</div>
                <div>{{ -item.emphasis }}</div>
              </template>
            </div>
          </div>
        </div>
        <div class="close-icon ml-2">
          <font-awesome-icon
            class="clickable"
            icon="fa-solid fa-minus"
            @click="deletePrompt(index)"
          />
        </div>
      </div>
      <div class="plus-button clickable mt-3" @click="addPrompt">
        <font-awesome-icon class="plus-icon mr-3" icon="fa-solid fa-plus" />
        <p class="shortcut-text" v-if="prompts.length !== 0">
          click or press EnterKey
        </p>
      </div>
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

      .close-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20px;
        width: 20px;
        font-size: 18px;
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
