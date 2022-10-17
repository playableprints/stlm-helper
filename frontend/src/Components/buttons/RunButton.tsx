import styled from "styled-components";

export default styled.button`
  font-size: 1.25rem;
  text-align: center;
  align-self: center;
  font-variant: small-caps;
  display: flex;
  flex: 0 0 auto;
  padding: 0.5rem 1rem;
  align-items: center;
  cursor: pointer;
  --local-clr: var(--button-accent);
  --local-clr-hover: var(--button-accent-hover);
  background: var(--local-clr);
  color: #fffc;
  text-shadow: 0px 1px 1px #0006;
  align-items: center;
  cursor: pointer;
  &:hover,
  &:active {
    background: var(--local-clr-hover);
  }
  &:disabled {
    cursor: initial !important;
    color: #fff8 !important;
    background: var(--button-disabled) !important;
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
