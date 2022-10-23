import { faCheck, faExclamationTriangle, faFilter, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useCallback, HTMLAttributes, useMemo } from "react";
import styled from "styled-components";
import { GetContents } from "../../../wailsjs/go/fsutil/FSUtil";
import { CheckMany } from "../../../wailsjs/go/stlintegrity/STLIntegrity";
import Button from "../../Components/buttons/Button";
import Checkbox from "../../Components/buttons/Checkbox";
import RunButton from "../../Components/buttons/RunButton";
import RegexInput from "../../Components/inputs/RegexInput";
import Label from "../../Components/layout/Label";
import Panel from "../../Components/layout/Panel";
import ScrollPane from "../../Components/layout/ScrollPane";
import ToolTitle from "../../Components/layout/ToolTitle";
import FolderPicker from "../../Components/selectors/FolderPicker";
import ListSelector, { IDisplayProps, Items } from "../../Components/selectors/ListSelector";
import useLoadingBar from "../../Utility/loadingbar";
import useLogger from "../../Utility/logger";
import useNotifications from "../../Utility/notifications";

const STLIntegrity = () => {
  const logger = useLogger("STLIntegrity");
  const notifications = useNotifications();
  const [loadingBar, isLoading] = useLoadingBar();

  const [path, setPath] = useState<string>("");
  const [filelist, setFileList] = useState<Items>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<{ [key: string]: { report: string[]; status: boolean } }>({});

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

  const reset = useCallback(() => {
    setPath("");
    setFileList({});
    setSelected([]);
    setResults({});
    setFilter("");
  }, []);

  const displayItem = useCallback(
    (props: IDisplayProps) => {
      return (
        <Entry>
          <EntryName>
            <Checkbox
              disabled={props.disabled}
              checked={props.checked}
              onClick={() => {
                props.onPick(props.value);
              }}
            >
              {props.children}
            </Checkbox>
          </EntryName>
          <Flag
            status={
              results[props.value] === undefined ? "unknown" : results[props.value].status ? "success" : "failure"
            }
            report={results[props.value]?.report ?? []}
          />
        </Entry>
      );
    },
    [results]
  );

  return (
    <>
      <ToolTitle>STL Integrity Checker</ToolTitle>
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
              display={displayItem}
            />

            <List>
              {Object.entries(filteredFileList).map(([tag, name]) => {
                return (
                  <Entry key={tag}>
                    <EntryName>
                      <Checkbox
                        disabled={path === "" || isLoading}
                        checked={selected.includes(tag)}
                        onClick={() => {
                          setSelected((prev) => {
                            return prev.includes(tag) ? prev.filter((n) => n !== tag) : [...prev, tag];
                          });
                        }}
                      >
                        {name}
                      </Checkbox>
                    </EntryName>
                    <Flag
                      status={results[tag] === undefined ? "unknown" : results[tag].status ? "success" : "failure"}
                      report={results[tag]?.report ?? []}
                    />
                  </Entry>
                );
              })}
            </List>
          </ScrollPane>
        </SelectWrapper>
        <RunButton
          onClick={() => {
            loadingBar.show();
            CheckMany(path, filteredSelection)
              .then((results) => {
                let fails = 0;
                let passes = 0;
                let checks = 0;
                setResults(
                  Object.entries(results).reduce((acc, [file, s]) => {
                    checks++;
                    if (s.Success) {
                      logger.success(path, file, "passed");
                      passes++;
                    } else {
                      logger.warn(path, file, ...s.Issues);
                      fails++;
                    }
                    acc[file] = { status: s.Success, report: s.Issues };
                    return acc;
                  }, {} as { [key: string]: { status: boolean; report: string[] } })
                );
                if (checks > 0) {
                  if (fails === 0) {
                    notifications.confirm(<>all {checks} had no issues!</>, "Huzzah!", 6000);
                  } else if (passes === 0) {
                    notifications.confirm(
                      <>{fails} check(s) had issues. Hover over the icon to check them</>,
                      "Danger Will Robinson",
                      6000
                    );
                  } else {
                    notifications.warning(
                      <>
                        Check completed. {passes} passed. {fails} had issues. Hover over the icon to check them
                      </>,
                      "Mixed Bag...",
                      6000
                    );
                  }
                }
                loadingBar.hide();
              })
              .catch((e: Error) => {
                logger.error(e.name, e.message);
                reset();
                loadingBar.hide();
              });
          }}
          className={"confirm"}
          disabled={path === "" || filteredSelection.length === 0 || isLoading}
        >
          Check
        </RunButton>
      </Panel>
    </>
  );
};

export default STLIntegrity;

const EntryName = styled.span`
  flex: 1 1 auto;
`;
const Entry = styled.div`
  display: flex;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
`;

const FLAG_ICON = {
  unknown: faQuestion,
  success: faCheck,
  failure: faExclamationTriangle,
};

type IFlagProps = {
  status: "unknown" | "success" | "failure";
  report: string[];
} & HTMLAttributes<HTMLSpanElement>;

const Flag = styled(({ status, report, className, ...props }: IFlagProps) => {
  return (
    <span {...props} className={`${status} ${className ?? ""}`} title={report.join("\n")}>
      <FontAwesomeIcon icon={FLAG_ICON[status]} />
    </span>
  );
})`
  flex: 0 0 auto;
  padding-inline: 0.5rem;
  &.unknown {
    color: var(--text-help);
  }
  &.failure {
    color: var(--text-emphasis);
  }
  &.success {
    color: var(--text-confirm);
  }
`;

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
