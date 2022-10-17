import { ReactNode, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { LoadingBarProvider } from "../../Utility/loadingbar";
import { LoggerProvider } from "../../Utility/logger";
import { NotificationProvider } from "../../Utility/notifications";

const interceptContext = (e: Event) => {
  if (!e.defaultPrevented) {
    e.preventDefault();
  }
};

export default ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    document.addEventListener("contextmenu", interceptContext);
    return () => {
      document.removeEventListener("contextmenu", interceptContext);
    };
  }, []);
  return (
    <LoggerProvider>
      <HashRouter>
        <NotificationProvider>
          <LoadingBarProvider>{children}</LoadingBarProvider>
        </NotificationProvider>
      </HashRouter>
    </LoggerProvider>
  );
};
