export interface ImageDetail {
  id: number;
  label: string; // ファイル名
  dataUrl: string;
  meta: Metadata;
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
