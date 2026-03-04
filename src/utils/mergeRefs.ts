import type { MutableRefObject, RefCallback, Ref } from 'react';

/**
 * Merge multiple refs into a single ref callback
 * @param refs - Array of refs to merge
 * @returns A ref callback that updates all provided refs
 */
export function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined | null>
): RefCallback<T> {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null && ref !== undefined) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}
