import { useState } from "react";
import RunButton from "../../Components/buttons/RunButton";
import Label from "../../Components/layout/Label";
import Panel from "../../Components/layout/Panel";
import ToolTitle from "../../Components/layout/ToolTitle";
import FolderPicker from "../../Components/selectors/FolderPicker";
import useLoadingBar from "../../Utility/loadingbar";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";
import { MigrateManifests } from "../../../wailsjs/go/manifest/Manifest";

const MigrateManifest = () => {
  const [loadingBar, isLoading] = useLoadingBar();
  const notifications = useNotifications();
  const logger = useLogger("MigrateManifest");

  const [path, setPath] = useState<string>("");
  const [backup, setBackup] = useState<boolean>(true);

  return (
    <>
      <ToolTitle>Manifest Upgrade</ToolTitle>
      <Panel>
        <Label text={"Directory"} help={"Select a folder from which to upgrade manifests"}>
          <FolderPicker
            value={path}
            onClear={() => {
              setPath("");
            }}
            onPick={(v) => {
              setPath(v);
            }}
            disabled={isLoading}
          />
        </Label>
        <RunButton
          className={"confirm"}
          onClick={() => {
            loadingBar.show();
            const startId = notifications.info(
              <>Depending on the size of the library you've selected, this might take a little while</>,
              "Hang Tight"
            );
            MigrateManifests(path)
              .then((changes) => {
                notifications.remove(startId);
                if (changes.length > 0) {
                  changes.forEach((each) => {
                    logger.success(`found and converted ${each}`);
                  });
                  notifications.confirm(
                    <>
                      {changes.length} {changes.length === 1 ? "manifest" : "manifests"} converted
                    </>,
                    "Success!"
                  );
                } else {
                  notifications.confirm(<>No manifests were changed</>, "Nothing happened!");
                }
              })
              .catch((e: Error) => {
                logger.error(e.name, e.message);
                notifications.error(<>Check the logs</>, "Something went wrong");
              })
              .finally(() => {
                setPath("");
                loadingBar.hide();
              });
          }}
          disabled={path === "" || isLoading}
        >
          Go!
        </RunButton>
      </Panel>
    </>
  );
};

export default MigrateManifest;
