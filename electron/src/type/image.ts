export interface ImageIndex {
  index: number;
  label: string;
}

export interface ImageDetail {
  id: number;
  label: string; // ファイル名
  dataUrl: string; // 画像のdataURL
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

    // parametersにパラメータが格納されているのでそれを取り出す
    if (metadata.parameters) {
      const params = metadata.parameters.split("\n");
      if (params.length === 1) {
        meta = setCommonParam(meta, params[0]);
      } else if (params.length === 2) {
        if (params[0].startsWith("Negative prompt: ")) {
          meta.negative = params[0].replace("Negative prompt: ", "");
        } else {
          meta.positive = params[0];
        }
        meta = setCommonParam(meta, params[1]);
      } else if (params.length === 3) {
        meta.positive = params[0];
        meta.negative = params[1].replace("Negative prompt: ", "");
        meta = setCommonParam(meta, params[2]);
      }
    }
    return meta;
  }
}
