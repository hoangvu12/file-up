import { del, get, set } from "idb-keyval";
import { atomWithStorage } from "jotai/utils";

export function atomWithIndexedDB<T>(key: string, initial: T) {
  return atomWithStorage<T>(key, initial, {
    setItem: (key, value) => set(key, value),
    getItem: (key) =>
      get<T>(key).then((value) => {
        if (value !== undefined) {
          return value;
        }

        if (initial !== undefined) {
          set(key, initial);
        }

        return initial;
      }),

    removeItem: (key) => del(key),
  });
}
