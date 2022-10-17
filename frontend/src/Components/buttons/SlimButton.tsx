import styled from "styled-components";

export default styled.button`
  --local-clr: var(--text-accent);
  --local-clr-hover: var(--text-accent-hover);
  color: var(--local-clr);
  text-shadow: 0px 1px 1px #0006;
  display: inline-flex;
  margin-inline: 0.125rem;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s;
  &:hover,
  &:focus-visible {
    color: var(--local-clr-hover);
  }
  &:disabled {
    color: #fff8 !important;
    cursor: initial !important;
  }
  &.danger {
    --local-clr: var(--text-danger);
    --local-clr-hover: var(--text-danger-hover);
  }
  &.emphasis {
    --local-clr: var(--text-emphasis);
    --local-clr-hover: var(--text-emphasis-hover);
  }
  &.info {
    --local-clr: var(--text-info);
    --local-clr-hover: var(--text-info-hover);
  }
  &.help {
    --local-clr: var(--text-help);
    --local-clr-hover: var(--text-help-hover);
  }
  &.confirm {
    --local-clr: var(--text-confirm);
    --local-clr-hover: var(--text-confirm-hover);
  }
`;
