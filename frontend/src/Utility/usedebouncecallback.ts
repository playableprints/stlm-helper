import { useCallback, useRef } from "react";

const useDebounceCallback = (callback: (...args: any) => any, delay: number | null = 0) => {
  const timeout = useRef<number>();

  const set = useCallback(
    (...args: any) => {
      clearTimeout(timeout.current);
      if (delay !== null) {
        timeout.current = setTimeout(
          () => {
            callback(...args);
          },
          delay < 0 ? 0 : delay
        );
      }
    },
    [callback, delay]
  );

  const cancel = useCallback(() => {
    clearTimeout(timeout.current);
  }, [callback]);

  const commit = useCallback((...args: any) => {
    clearTimeout(timeout.current);
    return callback(...args);
  }, []);

  return [set, cancel, commit];
};

export default useDebounceCallback;
