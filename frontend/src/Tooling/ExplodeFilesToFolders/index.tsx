import { Prepare, ExplodeList } from "../../../wailsjs/go/folderexploder/Exploder";
import { GetContents } from "../../../wailsjs/go/fsutil/FSUtil";
import { useCallback, useEffect, useState } from "react";
import ToolTitle from "../../Components/layout/ToolTitle";
import FolderPicker from "../../Components/selectors/FolderPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ListSelector from "../../Components/selectors/ListSelector";
import RegexInput from "../../Components/inputs/RegexInput";
import RunButton from "../../Components/buttons/RunButton";
import Label from "../../Components/layout/Label";
import Input from "../../Components/inputs/Input";
import Columns from "../../Components/layout/Columns";
import ScrollPane from "../../Components/layout/ScrollPane";
import FileTree, { IFileTree } from "../../Components/output/FileTree";
import Panel from "../../Components/layout/Panel";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";
import Nav from "../../Components/buttons/Nav";
import { BrowserOpenURL } from "../../../wailsjs/runtime/runtime";
import SlimButton from "../../Components/buttons/SlimButton";

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
  const [filelist, setFileList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [hierarchy, setHierarchy] = useState<IFileTree[]>([]);
  const [matcher, setMatcher] = useState<string>("");
  const [replace, setReplace] = useState<string>("");

  const reset = useCallback(() => {
    setPath("");
    setFileList([]);
    setSelected([]);
    setHierarchy([]);
  }, []);

  const logger = useLogger("ExplodeFiles");

  const notifications = useNotifications();

  useEffect(() => {
    if (selected.length > 0) {
      Prepare(selected, matcher === "" ? ".*" : matcher, replace === "" ? "$0" : replace).then((h) => {
        setHierarchy(toTree(h));
      });
    } else {
      setHierarchy([]);
    }
  }, [selected, matcher, replace]);

  return (
    <>
      <ToolTitle>Explode Files to Folders</ToolTitle>
      <Panel>
        <Label text={"Folder"} help={"Select a folder on your file system that contains the files you want to split."}>
          <FolderPicker
            value={path}
            onCancel={reset}
            onPick={(v: string) => {
              setPath(v);
              if (v) {
                GetContents(v, "*.*", false).then((l) => {
                  setFileList(l);
                  setSelected(l);
                });
              }
            }}
            onClear={reset}
          />
        </Label>
        <Columns
          value={"1fr auto 1fr"}
          style={{
            height: "50vh",
          }}
        >
          <ListSelector
            items={filelist}
            disabled={path === ""}
            selected={selected}
            onPick={(value: string) => {
              setSelected((prev) => {
                return prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value];
              });
            }}
            onPickAll={setSelected}
            onPickNone={setSelected}
          />
          <FontAwesomeIcon icon={faChevronRight} className={"fa-fw"} style={{ alignSelf: "center" }} />
          <ScrollPane>
            <FileTree tree={hierarchy} />
          </ScrollPane>
        </Columns>
        <Columns value={"1fr auto 1fr"}>
          <Label text="Regex Matching" help={"RegExp to group filenames"}>
            <RegexInput
              value={matcher}
              onChange={(e) => {
                setMatcher(e.currentTarget.value);
              }}
              placeholder={".*"}
              onClear={() => setMatcher("")}
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
            />
          </Label>
        </Columns>
        <RunButton
          className={"confirm"}
          onClick={() => {
            const thePath = path;
            ExplodeList(path, selected, matcher === "" ? ".*" : matcher, replace === "" ? "$0" : replace).then(
              (res) => {
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
              }
            );
          }}
          disabled={selected.length <= 0 || path === ""}
        >
          Boom!
        </RunButton>
      </Panel>
    </>
  );
};

export default FilesToFolders;
