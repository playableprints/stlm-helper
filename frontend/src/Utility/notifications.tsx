import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle,
  faCircleExclamation,
  faClose,
  faInfoCircle,
  faQuestionCircle,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, Dispatch, HTMLAttributes, ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import IconButton from "../Components/buttons/IconButton";

type INotice = {
  message: ReactNode;
  title: string | undefined;
  type: INoticeType;
  duration?: number | null;
  id: string;
};

type INoticeType = "warning" | "info" | "error" | "help" | "confirm";

type IReducerArgs =
  | {
      action: "remove";
      payload: string;
    }
  | {
      action: "add";
      payload: INotice;
    }
  | {
      action: "clear";
      payload?: never;
    };

const CTX = createContext<INoticeControls>({
  clear: () => {},
  remove: () => {},
  info: () => {},
  warning: () => {},
  error: () => {},
  help: () => {},
  confirm: () => {},
});

const genId = () => {
  let first = (Math.random() * 46656) | 0;
  let second = (Math.random() * 46656) | 0;
  return ("000" + first.toString(36)).slice(-3) + ("000" + second.toString(36)).slice(-3);
};

const ICONS = {
  warning: faTriangleExclamation,
  info: faInfoCircle,
  error: faCircleExclamation,
  help: faQuestionCircle,
  confirm: faCheckCircle,
};

const REDUCER = (state: INotice[], { action, payload }: IReducerArgs) => {
  switch (action) {
    case "add":
      return [...state, payload];
    case "remove":
      return state.filter((each) => {
        return each.id !== payload;
      });
    case "clear":
      return [];
    default:
      return state;
  }
};

const NoticeTitle = styled.div`
  font-size: 13pt;
  font-weight: bold;
  font-variant: small-caps;
  grid-area: title;
  color: var(--local-text);
  white-space: nowrap;
  padding-inline: 0.25rem;
`;

const NoticeFlag = styled(({ icon, ...props }: { icon: IconProp } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <FontAwesomeIcon icon={icon} />
    </div>
  );
})`
  font-size: 16pt;
  padding: 0.5rem;
  align-self: stretch;
  display: grid;
  justify-content: center;
  align-content: center;
  background: var(--local-lyr);
  color: var(--local-text);
  grid-area: flag;
`;

const CloseButton = styled(IconButton)`
  grid-area: close;
  align-self: start;
  font-size: 1.25rem;
`;

const NoticeMessage = styled.div`
  grid-area: message;
  align-self: start;
  padding: 0.25rem;
`;

const progress = keyframes`
    0% { width: 100%; }
    100% { width: 0%; }
`;

const FadeBar = styled.div`
  height: 3px;
  grid-area: bar;
  background: var(--local-text);
  animation-name: ${progress};
  animation-timing-function: linear;
`;

const Notice = styled(
  ({
    className,
    message,
    id,
    title,
    type,
    duration = null,
    close,
  }: INotice &
    HTMLAttributes<HTMLDivElement> & {
      close: Dispatch<IReducerArgs>;
    }) => {
    const handleClose = useCallback(() => {
      close({ action: "remove", payload: id });
    }, [close, id]);

    return (
      <div className={`${className ?? ""} theme_${type} ${title ? "" : "no_title"}`}>
        {title && <NoticeTitle>{title}</NoticeTitle>}
        <NoticeFlag icon={ICONS[type]} />
        <NoticeMessage>{message}</NoticeMessage>
        <CloseButton icon={faClose} className={"danger"} onClick={handleClose} />
        <FadeBar style={{ animationDuration: `${duration}ms` }} />
      </div>
    );
  }
)`
  --local-btn: var(--button-accent);
  --local-bg: var(--bg-accent);
  --local-text: var(--text-accent);
  --local-lyr: var(--layer-accent);
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "flag title close"
    "flag message message"
    "bar bar bar";
  align-items: center;
  border: 1px solid var(--local-btn);
  background: var(--local-bg);
  min-width: 256px;
  max-width: 40vw;
  align-self: stretch;
  box-shadow: 0px 4px 4px 2px #0006;

  &.theme_warning {
    --local-btn: var(--button-emphasis);
    --local-lyr: var(--layer-emphasis);
    --local-bg: var(--bg-emphasis);
    --local-text: var(--text-emphasis);
  }
  &.theme_info {
    --local-btn: var(--button-info);
    --local-lyr: var(--layer-info);
    --local-bg: var(--bg-info);
    --local-text: var(--text-info);
  }
  &.theme_error {
    --local-btn: var(--button-danger);
    --local-lyr: var(--layer-danger);
    --local-bg: var(--bg-danger);
    --local-text: var(--text-danger);
  }
  &.theme_help {
    --local-btn: var(--button-help);
    --local-lyr: var(--layer-help);
    --local-bg: var(--bg-help);
    --local-text: var(--text-help);
  }
  &.theme_confirm {
    --local-btn: var(--button-confirm);
    --local-lyr: var(--layer-confirm);
    --local-bg: var(--bg-confirm);
    --local-text: var(--text-confirm);
  }

  &.no_title {
    grid-template-columns: auto 1fr auto;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      "flag message close"
      "bar bar bar";
  }
`;

const Container = styled((props: HTMLAttributes<HTMLDivElement>) => {
  return <div {...props} />;
})`
  position: absolute;
  right: 0;
  margin: 0.25rem;
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: max-content;
  grid-gap: 0.5rem;
  max-height: calc(100vh - 120px);
  max-width: 60vw;
  width: min-content;
  min-width: 384px;
  overflow-y: auto;
  padding: 10px;
  justify-items: stretch;
  justify-content: end;
`;

export type INoticeControls = {
  clear: () => void;
  remove: (id: string) => void;
  info: (message: ReactNode, title?: string | null, duration?: number) => void;
  warning: (message: ReactNode, title?: string | null, duration?: number) => void;
  error: (message: ReactNode, title?: string | null, duration?: number) => void;
  help: (message: ReactNode, title?: string | null, duration?: number) => void;
  confirm: (message: ReactNode, title?: string | null, duration?: number) => void;
};

export const NotificationProvider = ({
  children,
  defaultDuration = 4000,
}: {
  children?: ReactNode;
  defaultDuration?: number;
}) => {
  const [notices, dispatch] = React.useReducer(REDUCER, [] as INotice[]);

  const controls = React.useMemo<INoticeControls>(() => {
    return {
      clear: () => {
        dispatch({ action: "clear" });
      },
      remove: (id: string) => {
        dispatch({ action: "remove", payload: id });
      },
      info: (message: ReactNode, title: string | null = null, duration: number = defaultDuration) => {
        console.log("Here goes");
        const id = genId();
        if (duration > 0) {
          setTimeout(dispatch, duration, {
            action: "remove",
            payload: id,
          });
        }
        dispatch({
          action: "add",
          payload: {
            type: "info",
            message,
            duration,
            id,
            title: title ?? undefined,
          },
        });
      },
      warning: (message: ReactNode, title: string | null = null, duration: number = defaultDuration) => {
        const id = genId();
        if (duration > 0) {
          setTimeout(dispatch, duration ?? defaultDuration, {
            action: "remove",
            payload: id,
          });
        }
        dispatch({
          action: "add",
          payload: {
            type: "warning",
            message,
            duration,
            id,
            title: title ?? undefined,
          },
        });
      },
      error: (message: ReactNode, title: string | null = null, duration: number = defaultDuration) => {
        const id = genId();
        if (duration > 0) {
          setTimeout(dispatch, duration ?? defaultDuration, {
            action: "remove",
            payload: id,
          });
        }
        dispatch({
          action: "add",
          payload: {
            type: "error",
            message,
            duration,
            id,
            title: title ?? undefined,
          },
        });
      },
      help: (message: ReactNode, title: string | null = null, duration: number = defaultDuration) => {
        const id = genId();
        if (duration > 0) {
          setTimeout(dispatch, duration ?? defaultDuration, {
            action: "remove",
            payload: id,
          });
        }
        dispatch({
          action: "add",
          payload: {
            type: "help",
            message,
            duration,
            id,
            title: title ?? undefined,
          },
        });
      },
      confirm: (message: ReactNode, title: string | null = null, duration: number = defaultDuration) => {
        const id = genId();
        if (duration > 0) {
          setTimeout(dispatch, duration ?? defaultDuration, {
            action: "remove",
            payload: id,
          });
        }
        dispatch({
          action: "add",
          payload: {
            type: "confirm",
            message,
            duration,
            id,
            title: title ?? undefined,
          },
        });
      },
    };
  }, [defaultDuration]);

  return (
    <CTX.Provider value={controls}>
      {children}
      {notices.length <= 0
        ? null
        : createPortal(
            <Container>
              {notices.map((each) => {
                const ret = <Notice key={each.id} close={dispatch} {...each} />;
                return ret;
              })}
            </Container>,
            document.getElementById("meta-root")!
          )}
    </CTX.Provider>
  );
};

export const useNotifications = () => React.useContext(CTX);
export default useNotifications;
