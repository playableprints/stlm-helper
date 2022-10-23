import { useCallback, useMemo, useState } from "react";
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
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import RegexInput from "../../Components/inputs/RegexInput";

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
    setFilter("");
  }, []);

  const logger = useLogger("ConvertTo3MF");
  const notifications = useNotifications();
  const [loadingBar, isLoading] = useLoadingBar();

  const [filter, setFilter] = useState<string>("");

  const filteredFileList = useMemo(() => {
    if (filter === "") {
      return filelist;
    }
    const r = new RegExp(filter, "i");
    return Object.entries(filelist).reduce((acc, [f, n]) => {
      if (f.match(r)) {
        acc[f] = n;
      }
      return acc;
    }, {} as Items);
  }, [filter, filelist]);

  const filteredSelection = useMemo(() => {
    return selected.filter((a) => (filter === "" ? true : a in filteredFileList));
  }, [selected, filter, filteredFileList]);

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
            <RegexInput
              disabled={path === "" || isLoading}
              icon={faFilter}
              value={filter}
              onChange={(e) => {
                setFilter(e.currentTarget.value);
              }}
              onClear={() => setFilter("")}
            />
            <Button
              disabled={path === "" || isLoading}
              onClick={() => {
                setSelected((prev) => {
                  const f = Object.keys(filteredFileList).filter((a) => !prev.includes(a));
                  return [...prev, ...f];
                });
              }}
              title={"Select All"}
            >
              All
            </Button>
            <Button
              disabled={path === "" || isLoading}
              onClick={() => {
                const f = Object.keys(filteredFileList);
                setSelected((prev) => {
                  return prev.filter((a) => !f.includes(a));
                });
              }}
              title={"Select None"}
            >
              None
            </Button>
          </SelectOptions>
          <ScrollPane style={{ gridArea: "input" }}>
            <ListSelector
              items={filteredFileList}
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
          disabled={path === "" || filteredSelection.length === 0 || isLoading}
          onClick={() => {
            const theOutpath = outpath === "" ? path : outpath;
            loadingBar.show();
            notifications.info(
              <>
                Converting {filteredSelection.length} {filteredSelection.length === 1 ? "STL" : "STLs"}. This might take
                a little while.
              </>,
              "Hang Tight..."
            );
            ConvertMany(path, filteredSelection, theOutpath)
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
  font-size: 0.75rem;
  display: flex;
  gap: 0.125rem;
  padding: 0.125rem;
`;
