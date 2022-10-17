import { HTMLAttributes } from "react";
import styled from "styled-components";

type IProps = {
  value: string;
  gap?: string;
} & HTMLAttributes<HTMLDivElement>;

export default styled(({ value, style, gap, ...props }: IProps) => {
  return (
    <div
      {...props}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: value,
        gap,
      }}
    />
  );
})`
  & > * {
    min-height: 0;
  }
`;
