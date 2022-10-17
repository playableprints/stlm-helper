import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled(Link)`
    color: var(--text-accent);
    &:hover,
    &:focus-visible {
        color: var(--text-accent-hover);
    }
    transition: color 0.3s;
`;

export default Nav;
