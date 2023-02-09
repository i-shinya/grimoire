<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Prompt } from "../../store/property";
import Input from "../atoms/Input.vue";

const props = defineProps<{
  label: string;
  prompt: Prompt[];
}>();

const emits = defineEmits<{
  (e: "send-val", prompt: Prompt[]): void;
}>();

const prompts = ref<Prompt[]>([]);

const receiveVal = (val: { id: number; label: string; value: string }) => {
  const res = prompts.value.map((prop: Prompt) => {
    if (prop.id === val.id) {
      prop.spell = val.value;
    }
    return prop;
  });
  emits("send-val", res);
};

const emphasis = (id: number) => {
  const res = prompts.value.map((prop: Prompt) => {
    if (prop.id === id) {
      prop.emphasis++;
    }
    return prop;
  });
  emits("send-val", res);
};

const restraint = (id: number) => {
  const res = prompts.value.map((prop: Prompt) => {
    if (prop.id === id) {
      prop.emphasis--;
    }
    return prop;
  });
  emits("send-val", res);
};

const addSpell = () => {
  const nextId =
    prompts.value.map((val) => val.id).reduce((a, b) => Math.max(a, b)) + 1;
  console.log(nextId);
  prompts.value.push({ id: nextId, spell: "", emphasis: 0 });
  emits("send-val", prompts.value);
};

const deletePrompt = (id: number) => {
  const res = prompts.value.filter((val) => val.id !== id);
  emits("send-val", res);
};

const incrementIndex = (prompt: Prompt, index: number) => {
  if (index === 0) {
    return;
  }
  let tmp = prompts.value[index - 1]; // 入れ替え対象をtmpに
  prompts.value[index - 1] = prompt; // 対象indexに値を設定
  prompts.value[index] = tmp;
  emits("send-val", prompts.value);
};

const decrementIndex = (prompt: Prompt, index: number) => {
  if (index === prompts.value.length - 1) {
    return;
  }
  let tmp = prompts.value[index + 1]; // 入れ替え対象をtmpに
  prompts.value[index + 1] = prompt; // 対象indexに値を設定
  prompts.value[index] = tmp;
  emits("send-val", prompts.value);
};

onMounted(() => {
  prompts.value = props.prompt ?? "";
});
watch(
  () => props.prompt,
  (state, prevState) => {
    prompts.value = state;
  }
);
</script>

<template>
  <div class="prompt-editor">
    <div class="label-area">
      <div class="label mb-2 mr-2">{{ label }}</div>
    </div>
    <div class="editor-area">
      <template v-for="(item, index) in prompts" key="id">
        <div class="editor-row mb-1">
          <div class="editor-border-area">
            <div class="up-down-icon mr-4">
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-angle-up"
                @click="incrementIndex(item, index)"
              />
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-angle-down"
                @click="decrementIndex(item, index)"
              />
            </div>
            <Input
              class="prompt-input mr-4"
              :id="item.id"
              :label="null"
              :value="item.spell"
              @send-val="receiveVal"
            ></Input>
            <div class="emphasis-area">
              <font-awesome-icon
                class="clickable mr-2"
                icon="fa-solid fa-arrow-down-wide-short"
                @click="restraint(item.id)"
              />
              <font-awesome-icon
                class="clickable mr-2"
                icon="fa-solid fa-arrow-up-wide-short"
                @click="emphasis(item.id)"
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
              class="window-operate-button clickable"
              icon="fa-solid fa-xmark"
              @click="deletePrompt(item.id)"
            />
          </div>
        </div>
      </template>
      <div class="plus-button mt-3" @click="addSpell">
        <font-awesome-icon
          class="plus-icon clickable"
          icon="fa-solid fa-plus"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../variables.scss" as var;

.prompt-editor {
  width: 100%;
  background-color: rgb(37, 18, 18);
  padding: 16px;

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
        border: 1px solid rgb(255, 255, 255);
        border-radius: 50%;
      }
    }

    .plus-button {
      width: 100%;
      display: flex;
      border: 1px solid rgb(255, 255, 255);
      padding: 4px;
      justify-content: center;

      .plus-icon {
        height: 14px;
        width: 14px;
        border: 1px solid rgb(255, 255, 255);
        border-radius: 50%;
      }
    }
  }
}
</style>
