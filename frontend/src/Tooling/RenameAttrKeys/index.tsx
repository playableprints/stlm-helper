import { faArrowRight, faChevronRight, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import Panel from "../../Components/layout/Panel";
import ScrollPane from "../../Components/layout/ScrollPane";
import ToolTitle from "../../Components/layout/ToolTitle";
import FolderPicker from "../../Components/selectors/FolderPicker";
import ListSelector, { Items } from "../../Components/selectors/ListSelector";
import useLoadingBar from "../../Utility/loadingbar";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";
import styled from "styled-components";
import Button from "../../Components/buttons/Button";
import Label from "../../Components/layout/Label";
import Input from "../../Components/inputs/Input";
import RegexInput from "../../Components/inputs/RegexInput";
import RunButton from "../../Components/buttons/RunButton";
import natsort from "../../Utility/natsort";
import useDebounceCallback from "../../Utility/usedebouncecallback";
import { FindAttributeKeys, PreviewReplaceKeys, ReplaceKeys } from "../../../wailsjs/go/manifest/Attributes";

const RenameAttrKeys = () => {
  const [loadingBar, isLoading] = useLoadingBar();
  const notifications = useNotifications();
  const logger = useLogger("AttrKeyReplacer");

  const [attrKeyList, setAttrKeyList] = useState<Items>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [path, setPath] = useState<string>("");

  const [matcher, setMatcher] = useState<string>("");
  const [replace, setReplace] = useState<string>("");
  const [results, setResults] = useState<{ [key: string]: string }>({});

  const [filter, setFilter] = useState<string>("");

  const filteredAttrKeyList = useMemo(() => {
    if (filter === "") {
      return attrKeyList;
    }
    const r = new RegExp(filter, "i");
    return Object.entries(attrKeyList).reduce((acc, [t, n]) => {
      if (t.match(r)) {
        acc[t] = n;
      }
      return acc;
    }, {} as Items);
  }, [filter, attrKeyList]);

  const reset = useCallback(() => {
    setAttrKeyList({});
    setResults({});
    setPath("");
    setFilter("");
  }, []);

  const load = useCallback((v: string, setAll: boolean = false) => {
    setPath(v);
    if (v) {
      loadingBar.show();
      FindAttributeKeys(v)
        .then((list: string[]) => {
          list.sort(natsort);
          if (setAll) {
            setSelected(list);
          } else {
            setSelected((p) => {
              return p.filter((a) => list.includes(a));
            });
          }
          setAttrKeyList(
            list.reduce((acc, e) => {
              if (e !== "") {
                acc[e] = e;
              }
              return acc;
            }, {} as Items)
          );
          loadingBar.hide();
        })
        .catch((e: Error) => {
          logger.error(e.name, e.message);
          loadingBar.hide();
        });
    }
  }, []);

  const filteredSelection = useMemo(() => {
    return selected.filter((a) => (filter === "" ? true : a in filteredAttrKeyList));
  }, [selected, filter, filteredAttrKeyList]);

  const [preview] = useDebounceCallback((s: string[], p: string, m: string, r: string) => {
    if (s.length > 0 && p !== "" && (r !== "" || m !== "")) {
      PreviewReplaceKeys(s, m === "" ? ".*" : m, r)
        .then((result) => {
          setResults(result);
        })
        .catch((e: Error) => {
          logger.error(e.name, e.message);
          setResults({});
        });
    } else {
      setResults({});
    }
  }, 200);

  useEffect(() => {
    preview(filteredSelection, path, matcher, replace);
  }, [path, filteredSelection, matcher, replace]);

  return (
    <>
      <ToolTitle>Rename Attribute Keys</ToolTitle>
      <Panel>
        <Label text={"Directory"} help={"Select a folder from which to collect attribute keys"}>
          <FolderPicker
            value={path}
            onClear={reset}
            onPick={(v) => {
              load(v, true);
            }}
            disabled={isLoading}
          />
        </Label>
        <SelectWrapper>
          <SelectOptions style={{ gridArea: "opt1" }}>
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
                  const f = Object.keys(filteredAttrKeyList).filter((a) => !prev.includes(a));
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
                const f = Object.keys(filteredAttrKeyList);
                setSelected((prev) => {
                  return prev.filter((a) => !f.includes(a));
                });
              }}
              title={"Select None"}
            >
              None
            </Button>
          </SelectOptions>
          <ScrollPane style={{ gridArea: "input1" }}>
            <ListSelector
              items={filteredAttrKeyList}
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
            {Object.keys(filteredAttrKeyList).map((t) => {
              const newValue = results[t] ?? t;
              return (
                <AttrKeyRx key={t} className={newValue === "" ? "deleted" : newValue === t ? "unchanged" : "changed"}>
                  {newValue === "" ? <ToDelete>[will be deleted]</ToDelete> : newValue ?? t}
                </AttrKeyRx>
              );
            })}
          </ScrollPane>
        </SelectWrapper>
        <InputWrapper>
          <Label text="Match" help={"RegExp to group filenames"}>
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
          <Label
            text="Replace"
            help={
              "Replace the matched text with this. captured regex can be accessed with '$n' ('$0' is the entire value). empty strings will be deleted."
            }
          >
            <Input
              value={replace}
              onChange={(e) => {
                setReplace(e.currentTarget.value);
              }}
              onClear={() => setReplace("")}
              disabled={isLoading}
            />
          </Label>
        </InputWrapper>
        <RunButton
          className={"confirm"}
          onClick={() => {
            loadingBar.show();
            const startId = notifications.info(
              <>Depending on the size of the library you've selected, this might take a little while</>,
              "Hang Tight"
            );
            ReplaceKeys(path, matcher === "" ? ".*" : matcher, replace, filteredSelection)
              .then((changes) => {
                notifications.remove(startId);
                if (changes.length > 0) {
                  changes.forEach((each) => {
                    logger.success(`changed '${each.From}' to '${each.To}' in '${each.In}'`);
                  });
                  notifications.confirm(
                    <>
                      {changes.length} attribute {changes.length === 1 ? "key" : "keys"} changed
                    </>,
                    "Success!"
                  );
                } else {
                  notifications.confirm(<>No attribute keys were changed</>, "Nothing happened!");
                }
              })
              .catch((e: Error) => {
                logger.error(e.name, e.message);
                notifications.error(<>Check the logs</>, "Something went wrong");
              })
              .finally(() => {
                load(path, false);
                loadingBar.hide();
              });
          }}
          disabled={filteredSelection.length <= 0 || path === "" || (matcher === "" && replace === "") || isLoading}
        >
          Go!
        </RunButton>
      </Panel>
    </>
  );
};

export default RenameAttrKeys;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto 1fr;
  height: 50vh;
  grid-template-areas: "opt1 . opt2" "input1 arrow input2";
`;

const SelectOptions = styled.div`
  font-size: 0.75rem;
  display: flex;
  gap: 0.125rem;
  padding: 0.125rem;
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
`;

const AttrKeyRx = styled.div`
  white-space: nowrap;
  padding-inline: 0.25rem;
  &.changed {
    color: var(--text-emphasis);
    background-color: var(--bg-emphasis);
  }
  &.deleted {
    color: var(--text-danger);
    background-color: var(--bg-danger);
  }
`;

const ToDelete = styled.span`
  font-style: italic;
`;
