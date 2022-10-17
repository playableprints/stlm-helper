import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { createContext, HTMLAttributes, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import styled from "styled-components";
import IconButton from "../Components/buttons/IconButton";

export type Logger = {
  warn: (...text: string[]) => void;
  error: (...text: string[]) => void;
  info: (...text: string[]) => void;
  log: (...text: string[]) => void;
  success: (...text: string[]) => void;
  clear: () => void;
};

const CTXControls = createContext<Logger>({
  warn: () => {},
  error: () => {},
  info: () => {},
  log: () => {},
  success: () => {},
  clear: () => {},
});

const CTXData = createContext<ILogMessage[]>([]);

type ILogMessage = {
  level: "WRN" | "ERR" | "SCS" | "INF" | "LOG" | "UNK";
  message: string;
};

export const useLogger = (prefix: string) => {
  const { warn, error, info, success, log } = useContext(CTXControls);

  const theRet = useMemo(() => {
    return {
      warn: (...p: string[]) => warn(prefix, ...p),
      error: (...p: string[]) => error(prefix, ...p),
      info: (...p: string[]) => info(prefix, ...p),
      success: (...p: string[]) => success(prefix, ...p),
      log: (...p: string[]) => log(prefix, ...p),
    };
  }, [warn, error, info, success, log, prefix]);

  return theRet;
};

export const LoggerProvider = ({ children }: { children: ReactNode }) => {
  const [logData, setLogData] = useState<ILogMessage[]>([]);

  const warn = useCallback((...message: string[]) => {
    setLogData((p) => [...p, { level: "WRN", message: message.join(" ") }]);
  }, []);

  const error = useCallback((...message: string[]) => {
    setLogData((p) => [...p, { level: "ERR", message: message.join(" ") }]);
  }, []);

  const info = useCallback((...message: string[]) => {
    setLogData((p) => [...p, { level: "INF", message: message.join(" ") }]);
  }, []);

  const log = useCallback((...message: string[]) => {
    setLogData((p) => [...p, { level: "LOG", message: message.join(" ") }]);
  }, []);

  const success = useCallback((...message: string[]) => {
    setLogData((p) => [...p, { level: "SCS", message: message.join(" ") }]);
  }, []);

  const clear = useCallback(() => {
    setLogData([]);
  }, []);

  const controls = useMemo(() => {
    return {
      log,
      info,
      success,
      clear,
      error,
      warn,
    };
  }, [log, info, success, clear, error, warn]);

  return (
    <CTXControls.Provider value={controls}>
      <CTXData.Provider value={logData}>{children}</CTXData.Provider>
    </CTXControls.Provider>
  );
};

const LogMessage = styled(({ level, message, className, ...props }: ILogMessage & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} className={`level_${level} ${className}`}>
      <span className={"type"}>[{level}]</span> {message}
    </div>
  );
})`
  display: block;
  white-space: nowrap;
  font-family: monospace;
  &.level_WRN > .type {
    color: #fc3;
  }
  &.level_ERR > .type {
    color: #f66;
  }
  &.level_SCS > .type {
    color: #6f6;
  }
  &.level_INF > .type {
    color: #69f;
  }
  &.level_LOG > .type {
    color: #ccc;
  }
`;

const Options = styled.div`
  justify-self: end;
`;

export const LogView = styled((props: HTMLAttributes<HTMLDivElement>) => {
  const log = useContext(CTXData);
  const { clear } = useContext(CTXControls);

  return (
    <>
      <Title>Logs</Title>
      <div {...props}>
        <Options>
          <IconButton
            className={"danger"}
            onClick={() => {
              clear();
            }}
            title={"Clear Log"}
            icon={faTrash}
          />
        </Options>
        <LogList>
          {log.map((each, i) => (
            <LogMessage key={i} {...each} />
          ))}
        </LogList>
      </div>
    </>
  );
})`
  flex: 1 1 auto;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const LogList = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: start;
  background: #111;
`;

const Title = styled.h2`
  text-align: center;
  font-variant: small-caps;
  font-weight: 100;
  font-size: 2rem;
  grid-column: 1 / -1;
`;

export default useLogger;
