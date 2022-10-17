import { createContext, HTMLAttributes, ReactNode, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";

export type ILoadingBarControls = {
  show: () => void;
  hide: () => void;
  for: (time: number) => void;
};

const CTX = createContext<ILoadingBarControls>({ show: () => {}, for: () => {}, hide: () => {} });

const cylon = keyframes`
  from {
    left: -100%;
  }
  to {
    left: 0%;
  }
`;

const Bar = styled.div`
  position: fixed;
  inset: 0;
  height: 4px;
  background: none;
  pointer-events: none;
  overflow: hidden;
  &:after {
    content: "";
    opacity: 0;
    transition: opacity 0.3s 0.3s;
    position: absolute;
    height: 100%;
    width: 200%;
    background: linear-gradient(to right, transparent 30%, var(--button-accent), transparent 70%);
    animation: ${cylon} ease-in-out 1.2s alternate infinite;
  }
  &.visible:after {
    opacity: 1;
  }
`;

export const LoadingBarProvider = ({ children }: { children?: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  const controls = useMemo<ILoadingBarControls>(() => {
    return {
      show: () => setIsVisible(true),
      hide: () => setIsVisible(false),
      for: (time: number) => {
        if (time > 0) {
          setIsVisible(true);
          setTimeout(() => {
            setIsVisible(false);
          }, time);
        }
      },
    };
  }, []);

  return (
    <CTX.Provider value={controls}>
      {createPortal(<Bar className={isVisible ? "visible" : ""} />, document.getElementById("meta-root")!)}
      {children}
    </CTX.Provider>
  );
};

export const useLoadingBar = () => {
  return useContext(CTX);
};

export default useLoadingBar;
