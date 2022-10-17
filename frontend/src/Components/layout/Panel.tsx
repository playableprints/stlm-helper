import { HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #333;
  box-shadow: 0px 3px 2px 0px #0004;
  border-radius: 0.25rem;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  flex-direction: column;
  padding: 0.25rem;
  max-width: 1200px;
  align-self: center;
  min-width: 700px;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.25rem;
  grid-column: 1 / -1;
  grid-row: 2;
`;

const Title = styled.h2`
  grid-column: 1;
  grid-row: 1;
  font-variant: small-caps;
  font-weight: 100;
  font-size: 1.25rem;
  padding: 0 0.25rem;
`;

const Options = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  gap: 0.25rem;
  padding: 0 0.25rem;
`;

type IProps = {
  options?: ReactNode;
  title?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "title">;

const ToolPanel = ({ title, options, children, ...props }: IProps) => {
  return (
    <Wrapper {...props}>
      <Title>{title}</Title>
      <Options>{options}</Options>
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default ToolPanel;
