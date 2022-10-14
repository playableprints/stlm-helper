import { HTMLAttributes } from "react";
import styled from "styled-components";

const BigRedButton = styled((props: HTMLAttributes<HTMLButtonElement>) => {
    return <button {...props} />;
})`
    display: flex;
    background: #333;
    color: white;
    margin-inline: auto;
    font-size: 1rem;
    font-variant: small-caps;
    padding: 0.5rem 1rem;
`;

export default BigRedButton;
