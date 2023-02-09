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
      <template v-for="item of prompts" key="id">
        <div class="editor-row mb-1">
          <div class="up-down-icon mr-4">
            <font-awesome-icon icon="fa-solid fa-angle-up" />
            <font-awesome-icon icon="fa-solid fa-angle-down" />
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
              class="mr-2"
              icon="fa-solid fa-arrow-down-wide-short"
              @click="restraint(item.id)"
            />
            <font-awesome-icon
              class="mr-2"
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
      </template>
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
      cursor: pointer;
    }
  }

  .editor-area {
    .editor-row {
      display: flex;
      border: 1px solid rgb(129, 129, 129);
      background-color: rgb(54, 54, 54);
      align-items: center;
      padding-left: 4px;
      padding-right: 4px;

      .prompt-input {
        flex-grow: 1;
      }
      .emphasis-area {
        display: flex;
        flex-grow: 0;
        align-items: center;

        .emphasis {
          display: flex;
          // align-items: center;
          // justify-content: center;
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
  }
}
</style>
