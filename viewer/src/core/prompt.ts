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
  let spell: string = text.trim();
  let emphasis: number = 0;
  // 強調表現{}が先頭末尾にある場合emphasisをインクリメント
  while (
    spell.startsWith(getEmphasisStartSymbol(emphasisSymbolType)) &&
    spell.endsWith(getEmphasisEndSymbol(emphasisSymbolType))
  ) {
    spell = spell.slice(1).slice(0, -1);
    emphasis++;
  }

  // マイナス強調表現[]が先頭末尾にある場合emphasisをデクリメント
  while (
    spell.startsWith(getRestraintStartSymbol(restraintSymbolType)) &&
    spell.endsWith(getRestraintEndSymbol(restraintSymbolType))
  ) {
    spell = spell.slice(1).slice(0, -1);
    emphasis--;
  }

  spell = spell.trim();
  return { spell, emphasis };
};
