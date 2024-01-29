import useLoadingBar from "../../Utility/loadingbar";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";
import styled from "styled-components";
import { useState, useCallback, useMemo, useEffect } from "react";
import FolderPicker from "../../Components/selectors/FolderPicker";
import { ConvertTagsToAttributes, PreviewConvertTagsToAttributes } from "../../../wailsjs/go/manifest/Attributes";
import Label from "../../Components/layout/Label";
import ToolTitle from "../../Components/layout/ToolTitle";
import Panel from "../../Components/layout/Panel";
import ListSelector, { Items } from "../../Components/selectors/ListSelector";
import { FindTags } from "../../../wailsjs/go/manifest/Tags";
import natsort from "../../Utility/natsort";
import { faChevronRight, faFilter } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Components/buttons/Button";
import RegexInput from "../../Components/inputs/RegexInput";
import ScrollPane from "../../Components/layout/ScrollPane";
import Input from "../../Components/inputs/Input";
import RunButton from "../../Components/buttons/RunButton";
import useDebounceCallback from "../../Utility/usedebouncecallback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlockLabel from "../../Components/layout/BlockLabel";

const TagToAttribute = () => {
  const [loadingBar, isLoading] = useLoadingBar();
  const notifications = useNotifications();
  const logger = useLogger("TagToAttribute");

  const [taglist, setTaglist] = useState<Items>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [path, setPath] = useState<string>("");
  const [results, setResults] = useState<{ Key: string; Value: string }[]>([]);
  const [leftBehind, setLeftBehind] = useState<string[]>([]);

  const [filter, setFilter] = useState<string>("");
  const [delim, setDelim] = useState<string>("");

  const load = useCallback((v: string, setAll: boolean = false) => {
    setPath(v);
    if (v) {
      loadingBar.show();
      FindTags(v).then((list: string[]) => {
        list.sort(natsort);
        if (setAll) {
          setSelected(list);
        } else {
          setSelected((p) => {
            return p.filter((a) => list.includes(a));
          });
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
      });
    }
  }, []);

  const reset = useCallback(() => {
    setTaglist({});
    setPath("");
    setFilter("");
    setResults([]);
    setLeftBehind([]);
  }, []);

  const [preview] = useDebounceCallback((t: string[], d: string, l: string[]) => {
    console.log("okay");
    if (t.length > 0 && d !== "") {
      console.log("foo");
      PreviewConvertTagsToAttributes(t, d, l)
        .then(({ Result, LeftBehind }) => {
          //console.log(result, leftBehind);
          setResults(Result);
          setLeftBehind(LeftBehind);
        })
        .catch((e: Error) => {
          logger.error(e.name, e.message);
          setResults([]);
          setLeftBehind([]);
        });
    } else {
      setResults([]);
      setLeftBehind([]);
    }
  }, 200);

  useEffect(() => {
    preview(Object.keys(taglist), delim, selected);
  }, [taglist, selected, delim]);

  const filteredTaglist = useMemo(() => {
    if (filter === "") {
      return taglist;
    }
    const r = new RegExp(filter, "i");
    return Object.entries(taglist).reduce((acc, [t, n]) => {
      if (t.match(r)) {
        acc[t] = n;
      }
      return acc;
    }, {} as Items);
  }, [filter, taglist]);

  const filteredSelection = useMemo(() => {
    return selected.filter((a) => (filter === "" ? true : a in filteredTaglist));
  }, [selected, filter, filteredTaglist]);

  return (
    <>
      <ToolTitle>Tag to Attribute Converter</ToolTitle>
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
                  const f = Object.keys(filteredTaglist).filter((a) => !prev.includes(a));
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
                const f = Object.keys(filteredTaglist);
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
              items={filteredTaglist}
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
          <BlockLabel text={"Attributes"} style={{ gridArea: "input2" }}>
            <ScrollPane>
              {results.map(({ Key: key, Value: value }) => {
                return (
                  <AttrRx key={`${key}=${value}`}>
                    <span className={"key"}>{key}</span>
                    <span className={"value"}>{value}</span>
                  </AttrRx>
                );
              })}
            </ScrollPane>
          </BlockLabel>
          <BlockLabel text={"Leftover Tags"} style={{ gridArea: "input3" }}>
            <ScrollPane>
              {leftBehind.map((each) => {
                return <TagRx key={each}>{each}</TagRx>;
              })}
            </ScrollPane>
          </BlockLabel>
        </SelectWrapper>
        <InputWrapper>
          <Label text="Delimiter" help={"The character(s) on which to split a tag into a key-value pair"}>
            <Input
              value={delim}
              onChange={(e) => {
                setDelim(e.currentTarget.value);
              }}
              onClear={() => setDelim("")}
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
            ConvertTagsToAttributes(path, delim, filteredSelection)
              .then((changes) => {
                notifications.remove(startId);
                if (changes.length > 0) {
                  changes.forEach((each) => {
                    logger.success(`found and converted ${each.To} in ${each.In}`);
                  });
                  notifications.confirm(
                    <>
                      {changes.length} {changes.length === 1 ? "tag" : "tags"} converted
                    </>,
                    "Success!"
                  );
                } else {
                  notifications.confirm(<>No tags were changed</>, "Nothing happened!");
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
          disabled={filteredSelection.length <= 0 || path === "" || delim === "" || isLoading}
        >
          Go!
        </RunButton>
      </Panel>
    </>
  );
};

export default TagToAttribute;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto 1fr 1fr;
  height: 50vh;
  gap: 0.25rem;
  grid-template-areas: "opt1 . input2" "input1 arrow input2" "input1 arrow input3";
`;

const SelectOptions = styled.div`
  font-size: 0.75rem;
  display: flex;
  gap: 0.125rem;
  padding: 0.125rem;
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const AttrRx = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4px;
  margin: 2px;
  & > .key {
    background: #222;
  }
  & > .key,
  & > .value {
    padding: 1px;
  }
`;

const TagRx = styled.div`
  margin: 2px;
`;
