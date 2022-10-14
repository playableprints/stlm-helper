import { HTMLAttributes } from "react";
import styled from "styled-components";

const Title = styled.div`
    font-size: 1.25rem;
    border-bottom: 1px solid currentColor;
    flex: 0 1 auto;
`;
const Contents = styled.div`
    flex: 1 1 auto;
    align-items: start;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    background: #fff2;
    padding: 0.25rem;
`;

const ToolPanel = ({
    title,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <Wrapper {...props}>
            <Title>{title}</Title>
            <Contents>{children}</Contents>
        </Wrapper>
    );
};

export default ToolPanel;
