export type ThumbnailSize = "small" | "default" | "large";

export interface ImageLocation {
  basePath: string;
  filename: string;
}

export interface ImageIndex {
  index: number;
  label: string;
}

export interface ImageDetail {
  id: number;
  label: string; // ファイル名
  createdUnitTimeMs: number; // ファイル作成時間ミリ秒（実測値: 1676377114354）
  meta: Metadata | null;
}

export class Metadata {
  width?: number;
  height?: number;
  provider?: string;
  positive?: string; // Description
  // 以下はNovelAIの場合Commentの値、StableDiffusionの場合はpositiveも含めてparametersの値
  negative?: string; // uc
  steps?: string;
  scale?: string;
  seed?: string;
  sampler?: string;
  strength?: string;
  noise?: string;
  model?: string; // StableDiffusionで選択したモデル
  other?: string; // その他のパラメータ（上記にないものは全部ここに突っ込みたい）

  public static build(metaJson: any): Metadata | null {
    if (!metaJson) {
      return null;
    }
    const meta = new Metadata();
    meta.provider = metaJson.Software;
    if (metaJson.ImageWidth) {
      meta.width = metaJson.ImageWidth;
    }
    if (metaJson.ImageHeight) {
      meta.height = metaJson.ImageHeight;
    }
    // Softwareがある場合はproviderを設定
    if (metaJson.Software) {
      return this.setNovelAiMeta(meta, metaJson);
    } else {
      return this.setStableDiffusionMeta(meta, metaJson);
    }
  }

  private static setNovelAiMeta(meta: Metadata, metaJson: any): Metadata {
    meta.provider = metaJson.Software;
    // TODO モデル名を取得できる気がするのでそのうち実装する（コード値になってるっぽいのでネームマッピングは必要）

    // Descriptionがある場合はポジティブプロンプトを設定
    if (metaJson.Description) {
      meta.positive = metaJson.Description;
    }
    // Commentがある場合配下のパラメータを設定
    if (metaJson.Comment) {
      // TODO json形式が不正な時どうするかそのうち考える
      const comment = JSON.parse(metaJson.Comment);
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

  private static setStableDiffusionMeta(
    meta: Metadata,
    metaJson: any
  ): Metadata {
    meta.provider = "StableDiffusion";

    // 共通の設定パラメータを設定する
    const setCommonParam = (meta: Metadata, params: string) => {
      const values = params.split(",");
      const otherProperties = [];
      for (let val of values) {
        const trimed = val.trim();
        if (trimed.startsWith("Steps: ")) {
          meta.steps = val.replace("Steps: ", "").trim();
          continue;
        }
        if (trimed.startsWith("Sampler: ")) {
          meta.sampler = val.replace("Sampler: ", "").trim();
          continue;
        }
        if (trimed.startsWith("CFG scale: ")) {
          meta.scale = val.replace("CFG scale: ", "").trim();
          continue;
        }
        if (trimed.startsWith("Seed: ")) {
          meta.seed = val.replace("Seed: ", "").trim();
          continue;
        }
        if (trimed.startsWith("Model: ")) {
          meta.model = val.replace("Model: ", "").trim();
          continue;
        }
        if (trimed.startsWith("Size: ") || trimed.startsWith("Model hash: ")) {
          // SizeとModel hashは無視
          continue;
        }
        otherProperties.push(val);
      }
      if (otherProperties.length > 0) {
        meta.other = otherProperties.join(",");
      }
    };

    // Negative promptを設定する
    // paramsはNegative prompt: で始まる要素から最後の要素を除いた要素までの配列を想定
    const setNegativePrompt = (meta: Metadata, params: string[]) => {
      meta.negative = params.join("").replace("Negative prompt: ", "");
    };

    // parametersにパラメータが格納されているのでそれを取り出す
    if (metaJson.parameters) {
      const params = metaJson.parameters
        .split("\n")
        .filter((v: string) => v !== "") as string[]; // 空の行は無視

      // 1行しかない場合は共通のパラメータのみを返却
      if (params.length === 1) {
        setCommonParam(meta, params[0]);
        return meta;
      }

      // 最初の要素の最初がNegative prompt: で始まっている場合はポジティブプロンプトが無い
      if (params[0].startsWith("Negative prompt: ")) {
        // 最後の行は共通パラメータなのでそれを取得する
        setCommonParam(meta, params[params.length - 1]);
        // 最後の行を除いた行を全て連結してNegative promptを設定する
        setNegativePrompt(meta, params.slice(0, params.length - 1));
        return meta;
      }

      // 要素の最初がNegative prompt: で始まっている要素が無い場合はネガティブプロンプトが無い
      if (!params.some((v: string) => v.startsWith("Negative prompt: "))) {
        // 最後の行は共通パラメータなのでそれを取得する
        setCommonParam(meta, params[params.length - 1]);
        // 最後の行を除いた行を全て連結してPositive promptを設定する
        meta.positive = params.slice(0, params.length - 1).join("");
        return meta;
      }

      // それ以外はPositive promptとNegative promptと共通パラメータがある
      // 最後の要素は共通パラメータなのでそれを取得する
      setCommonParam(meta, params[params.length - 1]);

      // 文字列の最初がNegative prompt: で始まっている要素のindexを取得する
      const negativeIndex = params.findIndex((v: string) =>
        v.startsWith("Negative prompt: ")
      );
      // NegativeIndexより前の要素を全て連結してPositive promptを設定する
      meta.positive = params.slice(0, negativeIndex).join("");

      // NegativeIndexから最後の要素までを全て連結してNegative promptを設定する
      setNegativePrompt(meta, params.slice(negativeIndex, params.length - 1));
    }
    return meta;
  }
}
