export interface ImageDetail {
  id: number;
  label: string; // ファイル名
  buffer: Buffer; // バイナリも一応持ってみているけどいらない気がする
  dataUrl: string;
  meta: Metadata;
}

export class Metadata {
  provider?: string; // Software
  positive?: string; // Description
  // 以下はCommentの値
  negative?: string; // uc
  steps?: string;
  scale?: string;
  seed?: string;
  sampler?: string;
  strength?: string;
  noise?: string;

  public static build(metadata: any): Metadata {
    const meta = new Metadata();
    // Softwareがある場合はproviderを設定
    if (metadata.Software) {
      meta.provider = metadata.Software;
    }
    // Descriptionがある場合はポジティブプロンプトを設定
    if (metadata.Description) {
      meta.positive = metadata.Description;
    }
    // Commentがある場合配下のパラメータを設定
    if (metadata.Comment) {
      // TODO json形式が不正な時どうするかそのうち考える
      const comment = JSON.parse(metadata.Comment);
      if (comment.uc) {
        meta.negative = comment.uc.toString();
      }
      if (comment.steps) {
        meta.steps = comment.steps.toString();
      }
      if (comment.sampler) {
        meta.sampler = comment.sampler.toString();
      }
      if (comment.seed) {
        meta.seed = comment.seed.toString();
      }
      if (comment.strength) {
        meta.strength = comment.strength.toString();
      }
      if (comment.noise) {
        meta.noise = comment.noise.toString();
      }
      if (comment.scale) {
        meta.scale = comment.scale.toString();
      }
    }
    return meta;
  }
}
