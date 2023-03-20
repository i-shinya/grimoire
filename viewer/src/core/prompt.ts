// 強調・マイナス強調の記号
export type EmphasisSymbolType = "{}" | "()";
export type RestraintSymbolType = "[]";

export const getEmphasisStartSymbol = (type: EmphasisSymbolType) =>
  type === "()" ? "(" : "{";
export const getEmphasisEndSymbol = (type: EmphasisSymbolType) =>
  type === "()" ? ")" : "}";
export const getRestraintStartSymbol = (type: RestraintSymbolType) => "[";
export const getRestraintEndSymbol = (type: RestraintSymbolType) => "]";

// 強調・抑止記号の解析を行う
export const analyzeSpell = (
  text: string,
  emphasisSymbolType: EmphasisSymbolType,
  restraintSymbolType: RestraintSymbolType
): { spell: string; emphasis: number } => {
  let spell: string = text;
  let emphasis: number = 0;
  // 強調表現{}が先頭末尾にある場合emphasisをインクリメント
  while (
    spell.trim().startsWith(getEmphasisStartSymbol(emphasisSymbolType)) &&
    spell.trim().endsWith(getEmphasisEndSymbol(emphasisSymbolType))
  ) {
    spell = spell.replace(getEmphasisStartSymbol(emphasisSymbolType), "");
    // 末尾の強調表現を削除
    spell = spell
      .split("")
      .reverse()
      .join("")
      .replace(getEmphasisEndSymbol(emphasisSymbolType), "")
      .split("")
      .reverse()
      .join("");
    emphasis++;
  }

  // マイナス強調表現[]が先頭末尾にある場合emphasisをデクリメント
  while (
    spell.trim().startsWith(getRestraintStartSymbol(restraintSymbolType)) &&
    spell.trim().endsWith(getRestraintEndSymbol(restraintSymbolType))
  ) {
    spell = spell.replace(getRestraintStartSymbol(restraintSymbolType), "");
    // 末尾の強調表現を削除
    spell = spell
      .split("")
      .reverse()
      .join("")
      .replace(getRestraintStartSymbol(restraintSymbolType), "")
      .split("")
      .reverse()
      .join("");
    emphasis--;
  }
  return { spell, emphasis };
};
