import { Prepare, ExplodeList } from "../../../wailsjs/go/folderexploder/Exploder";
import { GetContents } from "../../../wailsjs/go/fsutil/FSUtil";
import { useCallback, useEffect, useState } from "react";
import ToolTitle from "../../Components/layout/ToolTitle";
import FolderPicker from "../../Components/selectors/FolderPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ListSelector, { Items } from "../../Components/selectors/ListSelector";
import RegexInput from "../../Components/inputs/RegexInput";
import RunButton from "../../Components/buttons/RunButton";
import Label from "../../Components/layout/Label";
import Input from "../../Components/inputs/Input";
import ScrollPane from "../../Components/layout/ScrollPane";
import FileTree, { IFileTree } from "../../Components/output/FileTree";
import Panel from "../../Components/layout/Panel";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";
import Nav from "../../Components/buttons/Nav";
import { BrowserOpenURL } from "../../../wailsjs/runtime/runtime";
import SlimButton from "../../Components/buttons/SlimButton";
import useLoadingBar from "../../Utility/loadingbar";
import styled from "styled-components";
import Button from "../../Components/buttons/Button";
import useDebounceCallback from "../../Utility/usedebouncecallback";

const toTree = (h: { [key: string]: string[] }) => {
  return Object.entries(h).map(([folder, files]) => {
    return {
      name: folder,
      isFolder: true,
      contents: files.map((f) => {
        return {
          name: f,
          isFolder: false,
          contents: null,
        };
      }),
    };
  }) as IFileTree[];
};

const FilesToFolders = () => {
  const [path, setPath] = useState<string>("");
  const [filelist, setFileList] = useState<Items>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [hierarchy, setHierarchy] = useState<IFileTree[]>([]);
  const [matcher, setMatcher] = useState<string>("");
  const [replace, setReplace] = useState<string>("");

  const reset = useCallback(() => {
    setPath("");
    setFileList({});
    setSelected([]);
    setHierarchy([]);
  }, []);

  const logger = useLogger("ExplodeFiles");
  const notifications = useNotifications();
  const [loadingBar, isLoading] = useLoadingBar();

  const [preview] = useDebounceCallback((s: string[], m: string, r: string) => {
    if (s.length > 0) {
      Prepare(s, m === "" ? ".*" : m, r === "" ? "$0" : r)
        .then((h) => {
          setHierarchy(toTree(h));
        })
        .catch((e: Error) => {
          logger.error(e.name, e.message);
          setHierarchy([]);
        });
    } else {
      setHierarchy([]);
    }
  }, 200);

  useEffect(() => {
    preview(selected, matcher, replace);
  }, [selected, matcher, replace]);

  return (
    <>
      <ToolTitle>Explode Files to Folders</ToolTitle>
      <Panel>
        <Label
          text={"Directory"}
          help={"Select a folder on your file system that contains the files you want to split."}
        >
          <FolderPicker
            value={path}
            disabled={isLoading}
            onPick={(v: string) => {
              setPath(v);
              if (v) {
                loadingBar.show();
                GetContents(v, "*.*", false)
                  .then((l) => {
                    setFileList(
                      l.reduce((acc, e) => {
                        acc[e] = e;
                        return acc;
                      }, {} as Items)
                    );
                    setSelected(l);
                    loadingBar.hide();
                  })
                  .catch((e: Error) => {
                    logger.error(e.name, e.message);
                    loadingBar.hide();
                    reset();
                  });
              }
            }}
            onClear={reset}
          />
        </Label>
        <SelectWrapper>
          <SelectOptions style={{ gridArea: "opt1" }}>
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
          <ScrollPane style={{ gridArea: "input1" }}>
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
          <FontAwesomeIcon
            icon={faChevronRight}
            className={"fa-fw"}
            style={{ alignSelf: "center", gridArea: "arrow" }}
          />
          <ScrollPane style={{ gridArea: "input2" }}>
            <FileTree tree={hierarchy} />
          </ScrollPane>
        </SelectWrapper>
        <InputWrapper>
          <Label text="Regex Matching" help={"RegExp to group filenames"}>
            <RegexInput
              value={matcher}
              onChange={(e) => {
                setMatcher(e.currentTarget.value);
              }}
              placeholder={".*"}
              onClear={() => setMatcher("")}
              disabled={isLoading}
            />
          </Label>
          <FontAwesomeIcon icon={faArrowRight} className={"fa-fw"} />
          <Label text="Folder Names" help={"Name the folders. Regex Matches can be accessed here with '$n'."}>
            <Input
              value={replace}
              onChange={(e) => {
                setReplace(e.currentTarget.value);
              }}
              placeholder={"$0"}
              onClear={() => setReplace("")}
              disabled={isLoading}
            />
          </Label>
        </InputWrapper>
        <RunButton
          className={"confirm"}
          onClick={() => {
            const thePath = path;
            loadingBar.show();
            ExplodeList(path, selected, matcher === "" ? ".*" : matcher, replace === "" ? "$0" : replace)
              .then((res) => {
                loadingBar.hide();
                let success = true;
                Object.entries(res).forEach(([file, { Success, Message }]) => {
                  if (Success) {
                    logger.success(file);
                  } else {
                    logger.error(file, Message);
                    success = false;
                  }
                });
                if (success) {
                  notifications.confirm(
                    <>
                      Your folders were created. <br />
                      <SlimButton
                        onClick={() => {
                          BrowserOpenURL(thePath);
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
                logger.error(e.name, e.message);
                loadingBar.hide();
                reset();
              });
          }}
          disabled={selected.length <= 0 || path === "" || isLoading}
        >
          Boom!
        </RunButton>
      </Panel>
    </>
  );
};

export default FilesToFolders;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto 1fr;
  height: 50vh;
  grid-template-areas: "opt1 . opt2" "input1 arrow input2";
`;

const SelectOptions = styled.div`
  justify-self: end;
  font-size: 0.75rem;
  display: flex;
  gap: 0.125rem;
  padding: 0.125rem;
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
`;
