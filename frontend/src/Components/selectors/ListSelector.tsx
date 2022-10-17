import { CSSProperties, HTMLAttributes } from "react";
import styled from "styled-components";
import Checkbox from "../buttons/Checkbox";
import Button from "../buttons/Button";

type IProps = {
  items: string[];
  selected: string[];
  onPick: (value: string) => void;
  onPickAll?: (value: string[]) => void;
  onPickNone?: (value: string[]) => void;
  disabled?: boolean;
  innerClass?: string;
  innerStyle?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

const Entry = styled.div`
  flex: 0 0 auto;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  align-self: stretch;
`;

const Options = styled.div`
  justify-self: end;
  font-size: 0.75rem;
  display: flex;
  gap: 0.125rem;
  padding: 0.125rem;
`;

const Inner = styled.div`
  justify-self: stretch;
  background: #111;
  overflow-y: auto;
`;

const ListSelector = ({
  items,
  selected,
  disabled,
  onPick,
  onPickAll,
  onPickNone,
  innerClass,
  innerStyle,
  ...props
}: IProps) => {
  return (
    <Wrapper {...props}>
      {(onPickAll || onPickNone) && (
        <Options className={"options"}>
          {onPickAll && (
            <Button
              disabled={disabled}
              onClick={() => {
                onPickAll([...items]);
              }}
              title={"Select All"}
            >
              All
            </Button>
          )}
          {onPickNone && (
            <Button
              disabled={disabled}
              onClick={() => {
                onPickNone([]);
              }}
              title={"Select None"}
            >
              None
            </Button>
          )}
        </Options>
      )}
      <Inner>
        {items.map((each) => (
          <Entry key={each}>
            <Checkbox
              checked={selected.includes(each)}
              onClick={() => {
                onPick(each);
              }}
              disabled={disabled}
            >
              {each}
            </Checkbox>
          </Entry>
        ))}
      </Inner>
    </Wrapper>
  );
};

export const ScrollingListSelector = styled(ListSelector)`
  & > .inner {
    overflow-y: scroll;
    background: #111;
  }
`;

ListSelector.Scrolling = ScrollingListSelector;

export default ListSelector;
