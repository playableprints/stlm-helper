import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import Panel from "../../Components/layout/Panel";
import ScrollPane from "../../Components/layout/ScrollPane";
import ToolTitle from "../../Components/layout/ToolTitle";
import FolderPicker from "../../Components/selectors/FolderPicker";
import ListSelector, { Items } from "../../Components/selectors/ListSelector";
import useLoadingBar from "../../Utility/loadingbar";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";
import { FindTags, PreviewReplace, ReplaceTags } from "../../../wailsjs/go/manifest/Tags";
import styled from "styled-components";
import Button from "../../Components/buttons/Button";
import Label from "../../Components/layout/Label";
import Input from "../../Components/inputs/Input";
import RegexInput from "../../Components/inputs/RegexInput";
import RunButton from "../../Components/buttons/RunButton";
import natsort from "../../Utility/natsort";
import useDebounceCallback from "../../Utility/usedebouncecallback";

const TagReplacer = () => {
  const [loadingBar, isLoading] = useLoadingBar();
  const notifications = useNotifications();
  const logger = useLogger("TagReplacer");

  const [taglist, setTaglist] = useState<Items>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [path, setPath] = useState<string>("");

  const [matcher, setMatcher] = useState<string>("");
  const [replace, setReplace] = useState<string>("");
  const [results, setResults] = useState<{ [key: string]: string }>({});

  const reset = useCallback(() => {
    setTaglist({});
    setResults({});
    setPath("");
  }, []);

  const load = useCallback((v: string, setAll: boolean = false) => {
    setPath(v);
    if (v) {
      loadingBar.show();
      FindTags(v)
        .then((list: string[]) => {
          list.sort(natsort);
          if (setAll) {
            setSelected(list);
          }
          setTaglist(
            list.reduce((acc, e) => {
              if (e !== "") {
                acc[e] = e;
              }
              return acc;
            }, {} as Items)
          );
          loadingBar.hide();
        })
        .catch((e) => {
          logger.error(e);
          loadingBar.hide();
        });
    }
  }, []);

  const [preview] = useDebounceCallback((s: string[], p: string, m: string, r: string) => {
    if (s.length > 0 && p !== "" && (r !== "" || m !== "")) {
      PreviewReplace(s, m === "" ? ".*" : m, r)
        .then((result) => {
          setResults(result);
        })
        .catch((e) => {
          logger.error(e);
          setResults({});
        });
    } else {
      setResults({});
    }
  }, 200);

  useEffect(() => {
    preview(selected, path, matcher, replace);
  }, [path, selected, matcher, replace]);

  return (
    <>
      <ToolTitle>Bulk Tag Replacer</ToolTitle>
      <Panel>
        <Label text={"Directory"} help={"Select a folder from which to collect tags"}>
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
            <Button
              disabled={path === "" || isLoading}
              onClick={() => {
                setSelected(Object.keys(taglist));
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
              items={taglist}
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
            {Object.keys(taglist).map((t) => {
              const newValue = results[t] ?? t;
              return (
                <TagRx key={t} className={newValue === t ? "unchanged" : "changed"}>
                  {newValue === "" ? <>&nbsp;</> : newValue ?? t}
                </TagRx>
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
              "Replace the matched text with this. captured regex can be accessed with '$n' ('$0' is the entire value)"
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
            ReplaceTags(path, matcher === "" ? ".*" : matcher, replace, selected)
              .then((changes) => {
                if (changes.length > 0) {
                  changes.forEach((each) => {
                    logger.success(`changed '${each.From}' to '${each.To}' in '${each.In}'`);
                  });
                  notifications.confirm(
                    <>
                      {changes.length} tag {changes.length === 1 ? "entry" : "entries"} changed
                    </>,
                    "Success!"
                  );
                } else {
                  notifications.confirm(<>No tags were changed</>, "Nothing happened!");
                }
              })
              .catch((e) => {
                logger.error(e);
                notifications.error(<>Check the logs</>, "Something went wrong");
              })
              .finally(() => {
                load(path, false);
                loadingBar.hide();
              });
          }}
          disabled={selected.length <= 0 || path === "" || (matcher === "" && replace === "") || isLoading}
        >
          Go!
        </RunButton>
      </Panel>
    </>
  );
};

export default TagReplacer;

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

const TagRx = styled.div`
  white-space: nowrap;
  padding-inline: 0.25rem;
  &.changed {
    color: var(--text-emphasis);
    background-color: var(--bg-emphasis);
  }
`;
