export type ThumbnailSize = "small" | "default" | "large";

export interface ImageIndex {
  index: number;
  label: string;
}

export interface ImageDetail {
  id: number;
  label: string; // ファイル名
  meta: Metadata | null;
}

export class Metadata {
  width?: number;
  height?: number;
  provider?: string;
  positive?: string; // Description
  // 以下はNovelAIの場合Commentの値、StableDiffusionの場合はプロンプトも含めてparametersの値
  negative?: string; // uc
  steps?: string;
  scale?: string;
  seed?: string;
  sampler?: string;
  strength?: string;
  noise?: string;
  model?: string; // StableDiffusionで選択したモデル

  public static build(metadata: any): Metadata | null {
    if (!metadata) {
      return null;
    }
    // Softwareがある場合はproviderを設定
    if (metadata.Software) {
      return this.buildNovelAiMeta(metadata);
    } else {
      return this.buildStableDiffusionMeta(metadata);
    }
  }

  private static buildNovelAiMeta(metadata: any): Metadata {
    const meta = new Metadata();
    meta.provider = metadata.Software;
    if (metadata.ImageWidth) {
      meta.width = metadata.ImageWidth;
    }
    if (metadata.ImageHeight) {
      meta.height = metadata.ImageHeight;
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

  private static buildStableDiffusionMeta(metadata: any): Metadata {
    let meta = new Metadata();
    meta.provider = "StableDiffusion";
    if (metadata.ImageWidth) {
      meta.width = metadata.ImageWidth;
    }
    if (metadata.ImageHeight) {
      meta.height = metadata.ImageHeight;
    }

    // 共通の設定パラメータを設定する
    const setCommonParam = (meta: Metadata, params: string): Metadata => {
      const values = params.split(",");
      for (let val of values) {
        const trimed = val.trim();
        if (trimed.startsWith("Steps: ")) {
          meta.steps = val.replace("Steps: ", "").trim();
        }
        if (trimed.startsWith("Sampler: ")) {
          meta.sampler = val.replace("Sampler: ", "").trim();
        }
        if (trimed.startsWith("CFG scale: ")) {
          meta.scale = val.replace("CFG scale: ", "").trim();
        }
        if (trimed.startsWith("Seed: ")) {
          meta.seed = val.replace("Seed: ", "").trim();
        }
        if (trimed.startsWith("Model: ")) {
          meta.model = val.replace("Model: ", "").trim();
        }
      }
      return meta;
    };

    // Negative promptを設定する
    // paramsはNegative prompt: で始まる要素から最後の要素を除いた要素までの配列を想定
    const setNegativePrompt = (meta: Metadata, params: string[]): Metadata => {
      meta.negative = params.join("").replace("Negative prompt: ", "");
      return meta;
    };

    // parametersにパラメータが格納されているのでそれを取り出す
    if (metadata.parameters) {
      const params = metadata.parameters
        .split("\n")
        .filter((v: string) => v !== "") as string[]; // 空の行は無視

      // 1行しかない場合は共通のパラメータのみを返却
      if (params.length === 1) {
        meta = setCommonParam(meta, params[0]);
        return meta;
      }

      // 最初の要素の最初がNegative prompt: で始まっている場合はポジティブプロンプトが無い
      if (params[0].startsWith("Negative prompt: ")) {
        // 最後の行は共通パラメータなのでそれを取得する
        meta = setCommonParam(meta, params[params.length - 1]);
        // 最後の行を除いた行を全て連結してNegative promptを設定する
        meta = setNegativePrompt(meta, params.slice(0, params.length - 1));
        return meta;
      }

      // 要素の最初がNegative prompt: で始まっている要素が無い場合はネガティブプロンプトが無い
      if (!params.some((v: string) => v.startsWith("Negative prompt: "))) {
        // 最後の行は共通パラメータなのでそれを取得する
        meta = setCommonParam(meta, params[params.length - 1]);
        // 最後の行を除いた行を全て連結してPositive promptを設定する
        meta.positive = params.slice(0, params.length - 1).join("");
        return meta;
      }

      // それ以外はPositive promptとNegative promptと共通パラメータがある
      // 最後の要素は共通パラメータなのでそれを取得する
      meta = setCommonParam(meta, params[params.length - 1]);

      // 文字列の最初がNegative prompt: で始まっている要素のindexを取得する
      const negativeIndex = params.findIndex((v: string) =>
        v.startsWith("Negative prompt: ")
      );
      // NegativeIndexより前の要素を全て連結してPositive promptを設定する
      meta.positive = params.slice(0, negativeIndex).join("");

      // NegativeIndexから最後の要素までを全て連結してNegative promptを設定する
      meta = setNegativePrompt(
        meta,
        params.slice(negativeIndex, params.length - 1)
      );
    }
    return meta;
  }
}
