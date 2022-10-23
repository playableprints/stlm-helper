import { CSSProperties, HTMLAttributes, ReactComponentElement, ReactElement, ReactNode, Component } from "react";
import styled from "styled-components";
import Checkbox from "../buttons/Checkbox";
import Button from "../buttons/Button";

class Test extends Component<IDisplayProps> {
  constructor(props: IDisplayProps) {
    super(props);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export type Items = { [key: string]: ReactNode };

export type IDisplayProps = {
  checked: boolean;
  disabled?: boolean;
  value: string;
  children: ReactNode;
  onPick: (value: string) => void;
};

type IProps = {
  items: { [key: string]: ReactNode };
  selected: string[];
  onPick: (value: string) => void;
  disabled?: boolean;
  display?: ((props: IDisplayProps) => JSX.Element) | typeof Component<IDisplayProps, any>;
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

const DEFAULT_DISPLAY = ({ children, disabled, value, checked, onPick }: IDisplayProps) => (
  <Entry>
    <Checkbox
      checked={checked}
      disabled={disabled}
      onClick={() => {
        onPick(value);
      }}
    >
      {children}
    </Checkbox>
  </Entry>
);

const ListSelector = ({ items, selected, disabled, display: Display = DEFAULT_DISPLAY, onPick, ...props }: IProps) => {
  return (
    <Wrapper {...props}>
      {Object.entries(items).map(([v, k]) => (
        <Display key={v} onPick={onPick} value={v} disabled={disabled} checked={selected.includes(v)}>
          {k}
        </Display>
      ))}
    </Wrapper>
  );
};

export default ListSelector;
