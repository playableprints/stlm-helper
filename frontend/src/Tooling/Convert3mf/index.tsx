import { useCallback, useState } from "react";
import styled from "styled-components";
import { GetContents } from "../../../wailsjs/go/fsutil/FSUtil";
import { ConvertMany } from "../../../wailsjs/go/convert3mf/Convert3mf";
import Button from "../../Components/buttons/Button";
import RunButton from "../../Components/buttons/RunButton";
import Label from "../../Components/layout/Label";
import Panel from "../../Components/layout/Panel";
import ScrollPane from "../../Components/layout/ScrollPane";
import ToolTitle from "../../Components/layout/ToolTitle";
import FolderPicker from "../../Components/selectors/FolderPicker";
import ListSelector, { Items } from "../../Components/selectors/ListSelector";
import useLoadingBar from "../../Utility/loadingbar";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";
import { BrowserOpenURL } from "../../../wailsjs/runtime/runtime";
import SlimButton from "../../Components/buttons/SlimButton";
import Nav from "../../Components/buttons/Nav";

const Convert3mf = () => {
  const [path, setPath] = useState<string>("");
  const [filelist, setFileList] = useState<Items>({});
  const [selected, setSelected] = useState<string[]>([]);

  const [outpath, setOutpath] = useState<string>("");

  const reset = useCallback(() => {
    setPath("");
    setFileList({});
    setSelected([]);
    setOutpath("");
  }, []);

  const logger = useLogger("ConvertTo3MF");
  const notifications = useNotifications();
  const [loadingBar, isLoading] = useLoadingBar();

  return (
    <>
      <ToolTitle>Convert STL to 3MF</ToolTitle>
      <Panel>
        <Label text="Source Directory">
          <FolderPicker
            value={path}
            disabled={isLoading}
            onPick={(directory: string) => {
              setPath(directory);
              if (directory) {
                loadingBar.show();
                GetContents(directory, "*.stl", false)
                  .then((l) => {
                    setSelected(l);
                    setFileList(
                      l.reduce((acc, e) => {
                        acc[e] = e;
                        return acc;
                      }, {} as Items)
                    );
                    loadingBar.hide();
                  })
                  .catch((e: Error) => {
                    logger.error(e.name, e.message);
                    reset();
                    loadingBar.hide();
                  });
              }
            }}
            onClear={reset}
          />
        </Label>
        <SelectWrapper>
          <SelectOptions style={{ gridArea: "opt" }}>
            <Button
              disabled={path === "" || isLoading}
              onClick={() => {
                setSelected(Object.keys(filelist));
              }}
              title={"Select All"}
            >
              All
            </Button>
            <Button
              disabled={path === "" || isLoading}
              onClick={() => {
                setSelected([]);
              }}
              title={"Select None"}
            >
              None
            </Button>
          </SelectOptions>
          <ScrollPane style={{ gridArea: "input" }}>
            <ListSelector
              items={filelist}
              disabled={path === "" || isLoading}
              selected={selected}
              onPick={(value: string) => {
                setSelected((prev) => {
                  return prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value];
                });
              }}
            />
          </ScrollPane>
        </SelectWrapper>
        <Label text="Destination Directory">
          <FolderPicker
            placeholder={"[same as source]"}
            value={outpath}
            disabled={path === "" || isLoading}
            onPick={setOutpath}
            onClear={() => {
              setOutpath("");
            }}
          />
        </Label>
        <RunButton
          disabled={path === "" || selected.length === 0 || isLoading}
          onClick={() => {
            const theOutpath = outpath === "" ? path : outpath;
            loadingBar.show();
            notifications.info(
              <>
                Converting {selected.length} {selected.length === 1 ? "STL" : "STLs"}. This might take a little while.
              </>,
              "Hang Tight..."
            );
            ConvertMany(path, selected, theOutpath)
              .then((res) => {
                loadingBar.hide();
                let success = true;
                Object.entries(res).forEach(([file, { Success, Message }]) => {
                  if (Success) {
                    logger.success(file, Message);
                  } else {
                    logger.error(file, Message);
                    success = false;
                  }
                });
                if (success) {
                  notifications.confirm(
                    <>
                      {Object.entries(res).length} files were converted. <br />
                      <SlimButton
                        onClick={() => {
                          BrowserOpenURL(theOutpath);
                        }}
                      >
                        Open Folder
                      </SlimButton>
                    </>,
                    "Success!"
                  );
                } else {
                  notifications.error(
                    <>
                      There was a problem creating your folders, check the <Nav to="/logs">Logs</Nav>
                    </>,
                    "Something went wrong!"
                  );
                }
                reset();
              })
              .catch((e: Error) => {
                loadingBar.hide();
                logger.error(e.message);
                reset();
              });
          }}
        >
          Convert
        </RunButton>
      </Panel>
    </>
  );
};

export default Convert3mf;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: 50vh;
  grid-template-areas: "opt" "input";
`;

const SelectOptions = styled.div`
  justify-self: end;
  font-size: 0.75rem;
  display: flex;
  gap: 0.125rem;
  padding: 0.125rem;
`;
