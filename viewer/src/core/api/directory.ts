import { DirectoryNode } from "../type/directory";
import { ImageDetail } from "../type/image";
import aiImage1 from "../../../assets/ai-image_1.png";
import aiImage2 from "../../../assets/ai-image_2.png";

// inject用のkey
export const DirectoryAPIKey = Symbol("DirectoryAPIKey");

export interface DirectoryAPI {
  openDialog(): Promise<string>;
  showDirectories(path: string): Promise<DirectoryNode[]>;
  getImages(path: string): Promise<ImageDetail[]>;
}

export class DirectoryNodeAPI implements DirectoryAPI {
  async openDialog(): Promise<string> {
    return await window.directoryAPI.openDialog();
  }

  async showDirectories(path: string): Promise<DirectoryNode[]> {
    return await window.directoryAPI.showDirectories(path);
  }

  async getImages(path: string): Promise<ImageDetail[]> {
    return await window.directoryAPI.getImages(path);
  }
}

export class DirectoryDemoAPI implements DirectoryAPI {
  async openDialog(): Promise<string> {
    // 適当なパスを返す
    return "/grimoire/demo";
  }

  async showDirectories(path: string): Promise<DirectoryNode[]> {
    return [
      new DirectoryNode(1, "directory1", "/grimoire/demo", true, [
        new DirectoryNode(
          1,
          "ai-image_1.png",
          "/grimoire/demo/directory1",
          false
        ),
        new DirectoryNode(
          2,
          "ai-image_2.png",
          "/grimoire/demo/directory1",
          false
        ),
      ]),
      new DirectoryNode(2, "directory2", "/grimoire/demo", true, [
        new DirectoryNode(
          1,
          "sub-directory",
          "/grimoire/demo/directory2",
          true,
          [
            new DirectoryNode(
              1,
              "ai-image_1.png",
              "/grimoire/demo/directory2/sub-directory",
              false
            ),
          ]
        ),
      ]),
      new DirectoryNode(3, "directory3", "/grimoire/demo", true),
    ];
  }

  async getImages(path: string): Promise<ImageDetail[]> {
    const imageDetail1 = {
      id: 1,
      label: "ai-image_1.png",
      dataUrl: aiImage1,
      meta: {
        provider: "NovelAI",
        positive:
          "masterpiece, best quality, masterpiece, best quality, masterpiece, best quality, {{{{ancient mechanical monster}}}}, {{{clockwork}}}, manipulate time,  {{antique watch}},  {{glass strips}}, {floating glass fragments}, {{colorful refraction}}, {beautiful detailed sky}, {{dark intense shadows}}, {{cinematic lighting}}, {{overexposure}}",
        negative:
          "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, girl, human, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, girl, human, nsfw, lowres, bad anatomy, bad hands, text error, missing fingers, extra digits, fewer digits, cropped, worst quality, low quality, standard quality, peg artifacts, signature, watermark, username, blurry",
        steps: "28",
        sampler: "k_euler_ancestral",
        seed: "521325063",
        strength: "0.69",
        noise: "0.667",
        scale: "11",
      },
    };
    const imageDetail2 = {
      id: 2,
      label: "ai-image_2.png",
      dataUrl: aiImage2,
      meta: {
        provider: "NovelAI",
        positive: "masterpiece, best quality, bahamut, final fantasy",
        negative:
          "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
        steps: "50",
        sampler: "k_euler_ancestral",
        seed: "1466122361",
        strength: "0.8",
        noise: "0.1",
        scale: "11",
      },
    };

    if (path === "/grimoire/demo/directory1") {
      return [imageDetail1, imageDetail2];
    } else if (path === "/grimoire/demo/directory2/sub-directory") {
      return [imageDetail1];
    } else {
      return [];
    }
  }
}
