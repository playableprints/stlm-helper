import { HTMLAttributes } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #111;
`;

const ScrollPane = ({ style = {}, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <Wrapper {...props} style={{ ...style, overflowY: "auto" }}>
      {children}
    </Wrapper>
  );
};

export default ScrollPane;
