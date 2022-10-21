import { faClose, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLAttributes, useCallback } from "react";
import styled from "styled-components";
import { PickDirectory } from "../../../wailsjs/go/main/App";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";

type IProps = {
  onPick: (value: string) => void;
  onClear?: () => void;
  onCancel?: () => void;
  value: string;
  disabled?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const FolderPicker = ({ onPick, onClear, onCancel, disabled, value, placeholder, ...props }: IProps) => {
  const handleChange = useCallback(() => {
    if (!disabled) {
      PickDirectory().then((folder) => {
        if (folder) {
          onPick(folder);
        } else {
          onCancel && onCancel();
        }
      });
    }
  }, [onPick, onCancel, disabled]);

  return (
    <Wrapper {...props} className={disabled ? "disabled" : ""}>
      <LocalButton onClick={handleChange} disabled={disabled} title={"Pick Folder..."}>
        <FontAwesomeIcon icon={faFolderOpen} />
      </LocalButton>
      <Value className={value === "" ? "empty" : ""} onClick={handleChange}>
        {value === "" ? placeholder : value}
      </Value>
      {onClear && (
        <IconButton disabled={disabled} tabIndex={-1} icon={faClose} className={"danger"} onClick={() => onClear()} />
      )}
    </Wrapper>
  );
};

const LocalButton = styled(Button)`
  border-radius: 0.125rem;
  padding: 0.125rem 0.25rem;
`;

const Wrapper = styled.div`
  display: inline-grid;
  grid-template-columns: auto 1fr;
  grid-auto-column: auto;
  grid-auto-flow: column;
  gap: 0.25rem;
  flex: 1 1 auto;
  background: #222;
  padding: 0.125rem 0.125rem;
  border: 1px solid #666;
  border-radius: 0.25rem;
  font-family: monospace;
  cursor: pointer;
  &:focus-within {
    border-color: #999;
  }
  &.invalid {
    border-color: #c66;
  }
  &.disabled {
    border-color: #666 !important;
    background-color: #333 !important;
    color: #aaa !important;
    cursor: initial !important;
  }
  &:focus-within.invalid {
    border-color: #f99;
  }
`;

const Value = styled.div`
  &.empty {
    color: #888;
  }
  white-space: nowrap;
  overflow-x: hidden;
  direction: rtl;
  text-overflow: ellipsis;
  text-align: end;
`;

export default FolderPicker;
