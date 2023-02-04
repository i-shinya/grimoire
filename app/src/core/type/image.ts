export interface ImageDetail {
  id: number;
  label: string; // ファイル名
  buffer: Buffer; // バイナリも一応持ってみているけどいらない気がする
  dataUrl: string;
  meta: Metadata;
}

export class Metadata {
  positive?: string; // Description
  // 以下はCommentの値
  negative?: string; // uc
  steps?: number;
  sampler?: string;
  seed?: number;
  strength?: number;
  noise?: number;
  scale?: number;

  public static build(metadata: any): Metadata {
    const meta = new Metadata();
    // Descriptionがある場合はポジティブプロンプトを設定
    if (metadata.Description) {
      meta.positive = metadata.Description;
    }
    // Commentがある場合配下のパラメータを設定
    if (metadata.Comment) {
      // TODO json形式が不正な時どうするかそのうち考える
      const comment = JSON.parse(metadata.Comment);
      if (comment.uc) {
        meta.negative = comment.uc;
      }
      if (comment.steps) {
        meta.steps = comment.steps;
      }
      if (comment.sampler) {
        meta.sampler = comment.sampler;
      }
      if (comment.seed) {
        meta.seed = comment.seed;
      }
      if (comment.strength) {
        meta.strength = comment.strength;
      }
      if (comment.noise) {
        meta.noise = comment.noise;
      }
      if (comment.scale) {
        meta.scale = comment.scale;
      }
    }
    return meta;
  }
}
