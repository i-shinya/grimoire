import { reactive, readonly } from "vue";
import { Metadata } from "../core/type/image";

export interface Prompt {
  id: number;
  spell: string;
  emphasis: number; // 呪文の強調設定（+は強調、-はマイナス強調）
}

interface PropertyState {
  emphasisSymbolType: EmphasisSymbolType;
  restraintSymbolType: RestraintSymbolType;
  positive: Prompt[];
  negative: Prompt[];
  meta: Omit<Metadata, "positive" | "negative">;
}

// 強調・マイナス強調の記号
type EmphasisSymbolType = "{}" | "()";
type RestraintSymbolType = "[]";
const getEmphasisStartSymbol = (type: EmphasisSymbolType) =>
  type === "()" ? "(" : "{";
const getEmphasisEndSymbol = (type: EmphasisSymbolType) =>
  type === "()" ? ")" : "}";
const getRestraintStartSymbol = (type: RestraintSymbolType) => "[";
const getRestraintEndSymbol = (type: RestraintSymbolType) => "]";

export default function propertyStore() {
  const state: PropertyState = reactive({
    emphasisSymbolType: "{}",
    restraintSymbolType: "[]",
    positive: [],
    negative: [],
    meta: new Metadata(),
  });

  const addEmphasisSymbol = (spell: string, emphasis: number) => {
    if (emphasis === 0) {
      return spell;
    }
    let result: string = spell;
    if (emphasis > 0) {
      for (let i = 0; i < emphasis; i++) {
        result =
          getEmphasisStartSymbol(state.emphasisSymbolType) +
          result +
          getEmphasisEndSymbol(state.emphasisSymbolType);
      }
    } else {
      for (let i = 0; i > emphasis; i--) {
        result =
          getRestraintStartSymbol(state.restraintSymbolType) +
          result +
          getRestraintEndSymbol(state.restraintSymbolType);
      }
    }
    return result;
  };

  const displayPositive = () => {
    return state.positive
      .map((val) => {
        return addEmphasisSymbol(val.spell, val.emphasis);
      })
      .join(", ");
  };

  const displayNegative = () => {
    return state.negative
      .map((val) => {
        return addEmphasisSymbol(val.spell, val.emphasis);
      })
      .join(", ");
  };

  const analyzeSpell = (prompt: string): Prompt[] => {
    const texts = prompt.split(",");
    return texts.map((text, index): Prompt => {
      let spell: string = text.trim();
      let emphasis: number = 0;
      // 強調表現{}が先頭末尾にある場合emphasisをインクリメント
      while (
        spell.startsWith(getEmphasisStartSymbol(state.emphasisSymbolType)) &&
        spell.endsWith(getEmphasisEndSymbol(state.emphasisSymbolType))
      ) {
        spell = spell.slice(1).slice(0, -1);
        emphasis++;
      }

      // マイナス強調表現[]が先頭末尾にある場合emphasisをデクリメント
      while (
        spell.startsWith(getRestraintStartSymbol(state.restraintSymbolType)) &&
        spell.endsWith(getRestraintEndSymbol(state.restraintSymbolType))
      ) {
        spell = spell.slice(1).slice(0, -1);
        emphasis--;
      }

      spell = spell.trim();
      return { id: index++, spell, emphasis };
    });
  };

  // ディレクトリツリーで選択
  const copyProperty = (meta: Metadata) => {
    state.meta = meta;
    // TODO 記号の種類増えたら分岐を追加
    if (meta.provider === "NovelAI") {
      state.emphasisSymbolType = "{}";
      state.restraintSymbolType = "[]";
    } else {
      state.emphasisSymbolType = "()";
      state.restraintSymbolType = "[]";
    }
    state.positive = analyzeSpell(meta.positive ?? "");
    state.negative = analyzeSpell(meta.negative ?? "");
  };

  const updatePositive = (positive: Omit<Prompt[], "id">) => {
    state.positive = positive.map((v, index) => {
      return {
        id: index, // indexを元にidを再設定する
        spell: v.spell,
        emphasis: v.emphasis,
      };
    });
  };
  const updateNegative = (negative: Omit<Prompt[], "id">) => {
    state.negative = negative.map((v, index) => {
      return {
        id: index, // indexを元にidを再設定する
        spell: v.spell,
        emphasis: v.emphasis,
      };
    });
  };

  const updateEmphasisSymbol = (type: EmphasisSymbolType) => {
    state.emphasisSymbolType = type;
  };
  const updateRestraintSymbol = (type: RestraintSymbolType) => {
    state.restraintSymbolType = type;
  };

  // 現状使ってないけどそのうち使いそう
  const setValue = (val: { label: string; value: string }) => {
    if (val.label === "Positive Prompt") {
      state.positive = analyzeSpell(val.value ?? "");
    } else if (val.label === "Negative Prompt") {
      state.negative = analyzeSpell(val.value ?? "");
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
    state: readonly(state), // 読み取りしかできないようにする
    copyProperty,
    displayPositive,
    displayNegative,
    updatePositive,
    updateNegative,
    updateEmphasisSymbol,
    updateRestraintSymbol,
  };
}
export type PropertyStore = ReturnType<typeof propertyStore>;
