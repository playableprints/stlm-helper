import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { GetContents, GetTree } from "../../../wailsjs/go/fsutil/FSUtil";
import { Hoist } from "../../../wailsjs/go/hoistfiles/HoistFiles";
import { BrowserOpenURL } from "../../../wailsjs/runtime/runtime";
import Checkbox from "../../Components/buttons/Checkbox";
import Radiobox from "../../Components/buttons/Radiobox";
import RunButton from "../../Components/buttons/RunButton";
import SlimButton from "../../Components/buttons/SlimButton";
import Label from "../../Components/layout/Label";
import Panel from "../../Components/layout/Panel";
import ScrollPane from "../../Components/layout/ScrollPane";
import ToolTitle from "../../Components/layout/ToolTitle";
import FileTreeDisplay from "../../Components/output/FileTreeDisplay";
import FolderPicker from "../../Components/selectors/FolderPicker";
import { Items } from "../../Components/selectors/ListSelector";
import useLoadingBar from "../../Utility/loadingbar";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";
import FileTree from "../../Utility/tree/filetree";

const HoistFiles = () => {
  const [path, setPath] = useState<string>("");
  const [hierarchy, setHierarchy] = useState<FileTree | null>(null);
  const [duplicateMode, setDuplicateMode] = useState<string>("suffix");
  const [removeDirs, setRemoveDirs] = useState<boolean>(true);

  const reset = useCallback(() => {
    setPath("");
    setHierarchy(null);
  }, []);

  const logger = useLogger("HoistFiles");
  const notifications = useNotifications();
  const [loadingBar, isLoading] = useLoadingBar();

  useEffect(() => {
    console.log(hierarchy?.show());
  }, [hierarchy]);

  return (
    <>
      <ToolTitle>Hoist Files</ToolTitle>
      <Panel>
        <Label
          text={"Directory"}
          help={"Select a folder on your file system that contains the files you want to split."}
        >
          <FolderPicker
            value={path}
            disabled={isLoading}
            onPick={(v: string) => {
              if (v) {
                setPath(v);
                loadingBar.show();
                GetTree(v)
                  .then((list) => {
                    console.log(list);
                    setHierarchy(FileTree.fromList(list));
                    loadingBar.hide();
                  })
                  .catch((e: Error) => {
                    console.log(e);
                    logger.error(e.name, e.message);
                    loadingBar.hide();
                    reset();
                  });
              }
            }}
            onClear={reset}
          />
        </Label>
        <DisplayWrapper>
          <ScrollPane>
            <FileTreeDisplay tree={hierarchy} />
          </ScrollPane>
        </DisplayWrapper>
        <OptionWrapper>
          <Label text={"Collision Handling"}>
            <OptionGroup>
              <Radiobox value={duplicateMode} target={"suffix"} onPick={setDuplicateMode}>
                Incremental Suffix
              </Radiobox>
              <Radiobox value={duplicateMode} target={"folderNames"} onPick={setDuplicateMode}>
                Bake Folder Names into File Names
              </Radiobox>
            </OptionGroup>
          </Label>
          <Label text={"Misc"}>
            <OptionGroup>
              <Checkbox checked={removeDirs} onPick={setRemoveDirs}>
                Remove Emptied Directories
              </Checkbox>
            </OptionGroup>
          </Label>
        </OptionWrapper>
        <RunButton
          className={"confirm"}
          disabled={isLoading || hierarchy === null}
          onClick={() => {
            const thePath = path;
            loadingBar.show();
            Hoist(path, duplicateMode, removeDirs)
              .then(() => {
                loadingBar.hide();
                logger.success(path);
                notifications.confirm(
                  <>
                    Files hoisted to
                    <SlimButton
                      onClick={() => {
                        BrowserOpenURL(thePath);
                      }}
                    >
                      The chosen Folder
                    </SlimButton>
                  </>,
                  "Success!"
                );
                reset();
              })
              .catch((e: Error) => {
                logger.error(e.name, e.message);
                loadingBar.hide();
                reset();
              });
          }}
        >
          Go!
        </RunButton>
      </Panel>
    </>
  );
};

export default HoistFiles;

const DisplayWrapper = styled.div`
  display: grid;
  height: 50vh;
`;

const OptionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  background: #222;
  border: 1px solid #666;
  flex: 1 1 auto;
  padding: 0.25rem;
  gap: 0.25rem;
  margin-top: -1px;
  border-radius: 0.25rem;
`;
