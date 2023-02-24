import { reactive, readonly } from "vue";
import { Metadata } from "../core/type/image";
import {
  analyzeSpell,
  EmphasisSymbolType,
  getEmphasisEndSymbol,
  getEmphasisStartSymbol,
  getRestraintEndSymbol,
  getRestraintStartSymbol,
  RestraintSymbolType,
} from "../core/prompt";

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

const equalProperty = (one: PropertyState, two: PropertyState): boolean => {
  return (
    one.emphasisSymbolType === two.emphasisSymbolType &&
    one.restraintSymbolType === two.restraintSymbolType &&
    one.positive.toString() === two.positive.toString() &&
    one.negative.toString() === two.negative.toString() &&
    one.meta === two.meta
  );
};

// ヒストリー管理用
class PropertyHistory {
  index: number = 0; // 1スタート
  historyStack: PropertyState[] = [];

  private copyState(state: PropertyState): PropertyState {
    return {
      emphasisSymbolType: state.emphasisSymbolType,
      restraintSymbolType: state.restraintSymbolType,
      positive: state.positive,
      negative: state.negative,
      meta: state.meta,
    };
  }

  addHistory(state: PropertyState) {
    // console.log(state);
    // console.log(this.historyStack);
    // console.log(`length: ${this.historyStack.length}`);
    // console.log(`index: ${this.index}`);
    // 履歴が空の場合は単純に追加
    if (this.historyStack.length === 0) {
      // stateをそのまま追加すると参照を渡してしまうのでコピーする
      this.historyStack.push(this.copyState(state));
      this.index = this.historyStack.length;
      return;
    }

    // watchが発火するせいで戻るとかで履歴更新されちゃうので
    // 雑実装だけど同じヒストリーがきたら何もしない
    // if (equalProperty(this.historyStack[this.index], state)) {
    //   return;
    // }

    // indexが過去
    if (this.historyStack.length > this.index) {
      // TODO 入力内容が一緒なら何もしない
      if (equalProperty(this.historyStack[this.index - 1], state)) {
        return;
      }
      // TODO 一緒じゃないなら先を消す（履歴戻している状態で更新）
      this.historyStack.splice(this.index);
    }

    // stateをそのまま追加すると参照を渡してしまうのでコピーする
    this.historyStack.push(this.copyState(state));
    // 一定の長さを超えたら先頭消す
    if (this.historyStack.length > 200) {
      this.historyStack.shift();
    }
    this.index = this.historyStack.length;
    console.log(this.historyStack);
  }

  getPreviousHistory(): PropertyState | void {
    if (this.historyStack.length === 0 || this.index === 0) {
      return;
    }
    this.index--;
    return this.historyStack[this.index - 1];
  }

  getNextHistory(): PropertyState | void {
    if (
      this.historyStack.length === 0 ||
      this.historyStack.length === this.index
    ) {
      return;
    }
    this.index++;
    return this.historyStack[this.index - 1];
  }
}

// プロンプト解析
const analyzePrompt = (state: PropertyState, prompt: string): Prompt[] => {
  const texts = prompt.split(",");
  return texts.map((text, index): Prompt => {
    const spell = analyzeSpell(
      text,
      state.emphasisSymbolType,
      state.restraintSymbolType
    );
    return { id: index++, ...spell };
  });
};

// 強調記号を追加
const addEmphasisSymbol = (
  state: PropertyState,
  spell: string,
  emphasis: number
) => {
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

export default function propertyStore() {
  const state: PropertyState = reactive({
    emphasisSymbolType: "{}",
    restraintSymbolType: "[]",
    positive: [],
    negative: [],
    meta: new Metadata(),
  });

  // TODO プロパティのヒストリー
  const history = new PropertyHistory();

  const displayPositive = () => {
    return state.positive
      .map((val) => {
        return addEmphasisSymbol(state, val.spell, val.emphasis);
      })
      .join(", ");
  };

  const displayNegative = () => {
    return state.negative
      .map((val) => {
        return addEmphasisSymbol(state, val.spell, val.emphasis);
      })
      .join(", ");
  };

  const clearProperty = () => {
    // stateの中身を初期値に戻す
    state.emphasisSymbolType = "{}";
    state.restraintSymbolType = "[]";
    state.positive = [];
    state.negative = [];
    state.meta = new Metadata();
    history.addHistory(state);
  };

  // ディレクトリツリーで選択
  const copyProperty = (meta: Metadata) => {
    state.meta = meta;
    // TODO 記号の種類増えたら分岐を追加
    if (meta.provider === "NovelAI") {
      state.emphasisSymbolType = "{}";
      state.restraintSymbolType = "[]";
    } else if (meta.provider === "StableDiffusion") {
      state.emphasisSymbolType = "()";
      state.restraintSymbolType = "[]";
    } else {
      state.emphasisSymbolType = "()";
      state.restraintSymbolType = "[]";
    }
    state.positive = analyzePrompt(state, meta.positive ?? "");
    state.negative = analyzePrompt(state, meta.negative ?? "");
    history.addHistory(state);
  };

  // 履歴を戻す
  const returnHistory = () => {
    const previous = history.getPreviousHistory();
    if (!previous) {
      return;
    }
    state.emphasisSymbolType = previous.emphasisSymbolType;
    state.restraintSymbolType = previous.restraintSymbolType;
    state.positive = previous.positive;
    state.negative = previous.negative;
    state.meta = previous.meta;
  };

  // 履歴を進める
  const forwardHistory = () => {
    const next = history.getNextHistory();
    if (!next) {
      return;
    }
    state.emphasisSymbolType = next.emphasisSymbolType;
    state.restraintSymbolType = next.restraintSymbolType;
    state.positive = next.positive;
    state.negative = next.negative;
    state.meta = next.meta;
  };

  const updatePositive = (positive: Omit<Prompt[], "id">) => {
    state.positive = positive.map((v, index) => {
      return {
        id: index, // indexを元にidを再設定する
        spell: v.spell,
        emphasis: v.emphasis,
      };
    });
    history.addHistory(state);
  };
  const updateNegative = (negative: Omit<Prompt[], "id">) => {
    state.negative = negative.map((v, index) => {
      return {
        id: index, // indexを元にidを再設定する
        spell: v.spell,
        emphasis: v.emphasis,
      };
    });
    history.addHistory(state);
  };

  const updateEmphasisSymbol = (type: EmphasisSymbolType) => {
    state.emphasisSymbolType = type;
    history.addHistory(state);
  };
  const updateRestraintSymbol = (type: RestraintSymbolType) => {
    state.restraintSymbolType = type;
    history.addHistory(state);
  };

  // 現状使ってないけどそのうち使いそう
  // TODO 使うときは動作確認ちゃんとする
  const setValue = (val: { label: string; value: string }) => {
    if (val.label === "Positive Prompt") {
      state.positive = analyzePrompt(state, val.value ?? "");
    } else if (val.label === "Negative Prompt") {
      state.negative = analyzePrompt(state, val.value ?? "");
    } else if (val.label === "Steps") {
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
    } else if (val.label === "Model") {
      state.meta.model = val.value;
    }
    history.addHistory(state);
  };

  return {
    state: readonly(state), // 読み取りしかできないようにする
    clearProperty,
    copyProperty,
    displayPositive,
    displayNegative,
    forwardHistory,
    history,
    returnHistory,
    updatePositive,
    updateNegative,
    updateEmphasisSymbol,
    updateRestraintSymbol,
  };
}
export type PropertyStore = ReturnType<typeof propertyStore>;
