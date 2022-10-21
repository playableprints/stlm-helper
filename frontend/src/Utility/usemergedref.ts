import { ForwardedRef, MutableRefObject, useRef, useCallback, RefObject } from "react";

/**
 * for use within forwardRef components to combine a forwarded ref and an inner ref.
 * This is only intended to be used for refs that go onto an internal component and *not* for useImperativeHandle.
 * put the setRef in the ref prop of the inner component.
 *
 * example:
 *
 * const someComponent = forwardRef((props, fRef) => {
 *  const [innerRef, setRef] = useMergedRef<HTMLButtonElement>(fRef);
 *
 *  // use innerRef just as though it came from a useRef();
 *
 *  return <button ref={setRef} {...props} />
 *
 * })
 *
 * @param forwardedRef
 * @returns [innerRef, setRef]
 */

function useMergedRef<T extends HTMLElement>(
  forwardedRef: ForwardedRef<T>
): [innerRef: MutableRefObject<T | undefined>, setRef: (n: T) => void] {
  const innerRef = useRef<T>();
  const setRef = useCallback(
    (element: T) => {
      innerRef.current = element;
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else {
          forwardedRef.current = element;
        }
      }
    },
    [forwardedRef]
  );

  return [innerRef, setRef];
}

export default useMergedRef;
