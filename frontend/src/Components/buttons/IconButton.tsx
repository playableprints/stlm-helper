import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

type IProps = {
  icon: IconProp;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton = styled(({ icon, children, ...props }: IProps) => {
  return (
    <button {...props}>
      <FontAwesomeIcon icon={icon} className={"fa-fw"} />
      {children}
    </button>
  );
})`
  --local-clr: var(--text-accent);
  --local-clr-hover: var(--text-accent-hover);
  display: inline-flex;
  align-self: center;
  cursor: pointer;
  color: var(--local-clr);
  transition: color 0.3s;
  & > svg {
    filter: drop-shadow(0px 1px 1px #0006);
  }
  &:disabled {
    cursor: initial !important;
    color: var(--text-disabled) !important;
  }
  &:hover,
  &:focus-visible {
    color: var(--local-clr-hover);
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

export default IconButton;
