export type ThumbnailSize = "small" | "default" | "large";

export interface ImageIndex {
  index: number;
  label: string;
}

export interface ImageDetail {
  id: number;
  label: string; // ファイル名
  meta: Metadata | null;
  dataUrl?: string; // 画像のdataUrl、初期では取得しない
}

export class Metadata {
  width?: number;
  height?: number;
  provider?: string; // Software
  positive?: string; // Description
  // 以下はNovelAIの場合Commentの値、StableDiffusionの場合はプロンプトも含めてparametersの値
  negative?: string; // uc
  steps?: string;
  scale?: string;
  seed?: string;
  sampler?: string;
  strength?: string;
  noise?: string;
  model?: string;
}
