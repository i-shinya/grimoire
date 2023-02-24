import { divideArray } from "./array";

describe("sliceByNumber", function () {
  it("指定数の倍数", function () {
    const array = [1, 2, 3, 4, 5, 6];
    const res = divideArray(array, 2);
    expect(res).toMatchObject([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("指定数の倍数ではない", function () {
    const array = [1, 2, 3, 4, 5];
    const res = divideArray(array, 2);
    expect(res).toMatchObject([[1, 2], [3, 4], [5]]);
  });

  it("指定数未満", function () {
    const array = [1, 2, 3, 4, 5];
    const res = divideArray(array, 6);
    expect(res).toMatchObject([[1, 2, 3, 4, 5]]);
  });
});
