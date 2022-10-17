import styled from "styled-components";

export default styled.button`
    --local-clr: var(--button-accent);
    --local-clr-hover: var(--button-accent-hover);
    background-color: var(--local-clr);
    color: #fffc;
    text-shadow: 0px 1px 1px #0006;
    display: flex;
    flex: 0 0 auto;
    padding: 0.25rem 0.5rem;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover,
    &:focus-visible {
        background-color: var(--local-clr-hover);
    }
    &:disabled {
        color: #fff8 !important;
        cursor: initial !important;
        background-color: var(--button-disabled) !important;
    }
    &.danger {
        --local-clr: var(--button-danger);
        --local-clr-hover: var(--button-danger-hover);
    }
    &.emphasis {
        --local-clr: var(--button-emphasis);
        --local-clr-hover: var(--button-emphasis-hover);
    }
    &.info {
        --local-clr: var(--button-info);
        --local-clr-hover: var(--button-info-hover);
    }
    &.help {
        --local-clr: var(--button-help);
        --local-clr-hover: var(--button-help-hover);
    }
    &.confirm {
        --local-clr: var(--button-confirm);
        --local-clr-hover: var(--button-confirm-hover);
    }
`;
