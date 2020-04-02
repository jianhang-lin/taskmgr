
const typeCache: { [lable: string]: boolean} = {};

export function type<T>(lable: T | ''): T {
  if (typeCache[lable as string]) {
    throw new Error(`Action type "lable" is not unique`);
  }
  typeCache[lable as string] = true;
  return lable as T;
}
