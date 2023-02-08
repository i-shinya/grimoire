import { reactive } from "vue";
import { Metadata } from "../core/type/image";

interface Prompt {
  spell: string;
  emphasis: number; // 呪文の強調設定（+は強調、-はマイナス強調）
}

interface PropertyState {
  postitive: Prompt[];
  negative: Prompt[];
  meta: Omit<Metadata, "positive" | "negative">;
}

// TODO Stable Diffusionの場合は強調が()なのでこれを考慮する必要あり
// 強調・マイナス強調の記号
const emphasisStartSymbol = "{";
const emphasisEndSymbol = "}";
const conservativeStartSymbol = "[";
const conservativeEndSymbol = "]";

export default function propertyStore() {
  const state: PropertyState = reactive({
    postitive: [],
    negative: [],
    meta: new Metadata(),
  });

  const addEmphasisSymbol = (spell: string, emphasis: number) => {
    if (emphasis == 0) {
      return spell;
    }
    let result: string = spell;
    if (emphasis > 0) {
      for (let i = 0; i < emphasis; i++) {
        emphasisStartSymbol + spell + emphasisEndSymbol;
      }
    } else {
      for (let i = 0; i < emphasis; i--) {
        conservativeStartSymbol + spell + conservativeEndSymbol;
      }
    }
    return result;
  };

  const displayPostive = () => {
    return state.postitive
      .map((val) => {
        return addEmphasisSymbol(val.spell, val.emphasis);
      })
      .join(",");
  };

  const displayNegative = () => {
    return state.negative
      .map((val) => {
        return addEmphasisSymbol(val.spell, val.emphasis);
      })
      .join(",");
  };

  const analizeSpell = (text: string): Prompt[] => {
    const texts = text.split(",");
    return texts.map((text): Prompt => {
      let spell: string = text;
      let emphasis: number = 0;
      // 強調表現{}が先頭末尾にある場合emphasisをインクリメント
      while (
        spell.startsWith(emphasisStartSymbol) &&
        spell.startsWith(emphasisEndSymbol)
      ) {
        spell = spell.slice(1).slice(0, -1);
        emphasis++;
      }

      // マイナス強調表現[]が先頭末尾にある場合emphasisをデクリメント
      while (
        spell.startsWith(conservativeStartSymbol) &&
        spell.startsWith(conservativeEndSymbol)
      ) {
        spell = spell.slice(1).slice(0, -1);
        emphasis--;
      }

      return { spell, emphasis };
    });
  };

  // ディレクトリツリーで選択
  const copyProperty = (meta: Metadata) => {
    state.meta = meta;
    state.postitive = analizeSpell(meta.positive ?? "");
    state.negative = analizeSpell(meta.negative ?? "");
  };

  // 現状使ってないけどそのうち使いそう
  const setValue = (val: { label: string; value: string }) => {
    if (val.label === "Positive Prompt") {
      state.postitive = analizeSpell(val.value ?? "");
    } else if (val.label === "Negative Prompt") {
      state.negative = analizeSpell(val.value ?? "");
    } else if (val.label === "Negative Prompt") {
      state.meta.steps = val.value;
    } else if (val.label === "Scale") {
      state.meta.scale = val.value;
    } else if (val.label === "Seed") {
      state.meta.seed = val.value;
    } else if (val.label === "Sampler") {
      state.meta.sampler = val.value;
    } else if (val.label === "Strength") {
      state.meta.strength = val.value;
    } else if (val.label === "Noise") {
      state.meta.noise = val.value;
    }
  };

  return {
    state,
    copyProperty,
    displayPostive,
    displayNegative,
  };
}
export type PropertyStore = ReturnType<typeof propertyStore>;
