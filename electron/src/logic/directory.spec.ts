import {
  getDirectoryNodes,
  getAllImages,
  getImageMeta,
  readImage,
  listImageIndex,
  getImages,
} from "./directory";
import { ImageDetail, ImageIndex } from "../type/image";

describe("directory.ts", () => {
  describe("getDirectroyNodes", () => {
    it("正常系：ディレクトリノードが取得できること", () => {
      const res = getDirectoryNodes("./testdata/image");
      expect(res).toMatchObject([
        {
          id: 1,
          basePath: "./testdata/image",
          label: "nest-dir",
          isDirectory: true,
          children: [
            {
              id: 1,
              basePath: "./testdata/image/nest-dir",
              children: undefined,
              label: "novel-ai-image_3.png",
              isDirectory: false,
            },
          ],
        },
        {
          id: 2,
          basePath: "./testdata/image",
          label: "no-meta.jpeg",
          isDirectory: false,
          children: undefined,
        },
        {
          id: 3,
          basePath: "./testdata/image",
          label: "not-image.txt",
          isDirectory: false,
          children: undefined,
        },
        {
          id: 4,
          basePath: "./testdata/image",
          label: "novel-ai-image_1.png",
          isDirectory: false,
          children: undefined,
        },
        {
          id: 5,
          basePath: "./testdata/image",
          label: "novel-ai-image_2.png",
          isDirectory: false,
          children: undefined,
        },
        {
          id: 6,
          basePath: "./testdata/image",
          label: "stable-diffusion-image_1_has-negative.png",
          isDirectory: false,
          children: undefined,
        },
        {
          id: 7,
          basePath: "./testdata/image",
          label: "stable-diffusion-image_2_has-positive.png",
          isDirectory: false,
          children: undefined,
        },
        {
          id: 8,
          basePath: "./testdata/image",
          label: "stable-diffusion-image_3_has-positive-and-negative.png",
          isDirectory: false,
          children: undefined,
        },
        {
          id: 9,
          basePath: "./testdata/image",
          label: "stable-diffusion-image_4_no-positive-and-negative.png",
          isDirectory: false,
          children: undefined,
        },
      ]);
    });
  });

  describe("listImagesIndex", () => {
    it("正常系：画像がインデックス一覧が取得できること", async () => {
      let res: ImageIndex[] = [];
      try {
        res = await listImageIndex("./testdata/image");
      } catch (error) {
        fail;
      }
      expect(res.length).toBe(7);
    });
  });

  describe("getImages", () => {
    it("正常系：画像が取得できること", async () => {
      const req = [{ index: 1, label: "novel-ai-image_1.png" }];
      let res: ImageDetail[] = [];
      try {
        res = await getImages("./testdata/image", req);
      } catch (error) {
        fail;
      }
      expect(res.length).toBe(1);
    });
  });

  describe("getAllImages", () => {
    it("正常系：画像が取得できること", async () => {
      // エラーが起きないことだけ確認
      let res: ImageDetail[] = [];
      try {
        res = await getAllImages("./testdata/image");
      } catch (error) {
        fail;
      }
      expect(res.length).toBe(7);
    });
  });

  describe("readImage", () => {
    it("正常系：画像が読み込めること", async () => {
      // エラーが起きないことだけ確認
      try {
        await readImage("./testdata/image/novel-ai-image_1.png");
      } catch (error) {
        fail;
      }
    });
  });

  describe("getImageMeta", () => {
    describe("NovelAI", () => {
      it("正常系：画像のメタデータが取得できること", async () => {
        const res = await getImageMeta("./testdata/image/novel-ai-image_1.png");
        expect(res).toMatchObject({
          width: 512,
          height: 768,
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
        });
      });
    });

    describe("StableDiffusion", () => {
      it("正常系：画像のメタデータが取得できること（positiveとnegativeを含む）", async () => {
        const res = await getImageMeta(
          "./testdata/image/stable-diffusion-image_3_has-positive-and-negative.png"
        );
        expect(res).toMatchObject({
          width: 512,
          height: 512,
          provider: "StableDiffusion",
          positive: "girl, full body",
          negative: "missing fingers",
          steps: "20",
          sampler: "Euler a",
          seed: "3374665638",
          scale: "7",
        });
      });

      it("正常系：画像のメタデータが取得できること（positiveを含む、negativeを含まない）", async () => {
        const res = await getImageMeta(
          "./testdata/image/stable-diffusion-image_2_has-positive.png"
        );
        expect(res).toMatchObject({
          width: 512,
          height: 512,
          provider: "StableDiffusion",
          negative: undefined,
          positive: "girl",
          steps: "20",
          sampler: "Euler a",
          seed: "2996065324",
          scale: "7",
        });
      });

      it("正常系：画像のメタデータが取得できること（positiveを含まない、negativeを含む）", async () => {
        const res = await getImageMeta(
          "./testdata/image/stable-diffusion-image_1_has-negative.png"
        );
        expect(res).toMatchObject({
          width: 512,
          height: 512,
          provider: "StableDiffusion",
          positive: undefined,
          negative: "missing finger",
          steps: "20",
          sampler: "Euler a",
          seed: "470908257",
          scale: "7",
        });
      });

      it("正常系：画像のメタデータが取得できること（positiveを含まない、negativeを含まない）", async () => {
        const res = await getImageMeta(
          "./testdata/image/stable-diffusion-image_4_no-positive-and-negative.png"
        );
        expect(res).toMatchObject({
          width: 512,
          height: 512,
          provider: "StableDiffusion",
          positive: undefined,
          negative: undefined,
          steps: "20",
          sampler: "Euler a",
          seed: "3209139373",
          scale: "7",
        });
      });
    });

    describe("その他", () => {
      it("メタデータが無い画像", async () => {
        const res = await getImageMeta("./testdata/image/no-meta.jpeg");
        expect(res).toBeNull();
      });
    });
  });
});
