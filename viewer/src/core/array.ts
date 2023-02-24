/**
 * 指定数で配列を分割する
 * @param array
 * @param size
 */
export const divideArray = <T>(array: Array<T>, size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    const res = array.slice(i, i + size);
    result.push(res);
  }
  return result;
};
