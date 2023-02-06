import {
  getDirectroyNodes,
  getImages,
  getImageMeta,
  readImage,
} from "./directory";
import { ImageDetail } from "../../core/type/image";

describe("directory.ts", () => {
  describe("getDirectroyNodes", () => {
    it("正常系：ディレクトリノードが取得できること", async () => {
      const res = await getDirectroyNodes("./testdata/image");
      expect(res).toMatchObject([
        {
          id: 1,
          label: "nest-dir",
          isDirectory: true,
          children: [
            {
              id: 1,
              label: "sample3.png",
              isDirectory: false,
            },
          ],
        },
        {
          id: 2,
          label: "not-image.txt",
          isDirectory: false,
        },
        {
          id: 3,
          label: "sample1.png",
          isDirectory: false,
        },
        {
          id: 4,
          label: "sample2.png",
          isDirectory: false,
        },
      ]);
    });
  });

  describe("getImages", () => {
    it("正常系：画像が取得できること", async () => {
      // エラーが起きないことだけ確認
      let res: ImageDetail[] = [];
      try {
        res = await getImages("./testdata/image");
      } catch (error) {
        fail;
      }
      expect(res.length).toBe(2);
    });
  });

  describe("readImage", () => {
    it("正常系：画像が読み込めること", async () => {
      // エラーが起きないことだけ確認
      try {
        await readImage("./testdata/image/sample1.png");
      } catch (error) {
        fail;
      }
    });
  });

  describe("getImageMeta", () => {
    it("正常系：メタデータが取得できること", async () => {
      const res = await getImageMeta("./testdata/image/sample1.png");
      expect(res).toMatchObject({
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
      });
    });
  });
});
