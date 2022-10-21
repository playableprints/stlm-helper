import { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";
import Checkbox from "../buttons/Checkbox";
import Button from "../buttons/Button";

export type Items = { [key: string]: ReactNode };

type IProps = {
  items: { [key: string]: ReactNode };
  selected: string[];
  onPick: (value: string) => void;
  disabled?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const Entry = styled.div`
  flex: 0 0 auto;
  white-space: nowrap;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
`;

const ListSelector = ({ items, selected, disabled, onPick, ...props }: IProps) => {
  return (
    <Wrapper {...props}>
      {Object.entries(items).map(([v, k]) => (
        <Entry key={v}>
          <Checkbox
            checked={selected.includes(v)}
            onClick={() => {
              onPick(v);
            }}
            disabled={disabled}
          >
            {k}
          </Checkbox>
        </Entry>
      ))}
    </Wrapper>
  );
};

export default ListSelector;
