import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProp;
  checked: boolean;
}

export default styled(({ icon, checked, className, disabled, children, ...props }: IProps) => {
  return (
    <button {...props} className={`${className ?? ""} ${checked && !disabled ? "checked" : ""}`} disabled={disabled}>
      <span className={"icon"}>
        <FontAwesomeIcon icon={icon ?? (checked ? faCheckSquare : faSquare)} className={`fa-fw`} />
      </span>
      {children && <span>{children}</span>}
    </button>
  );
})`
  display: inline-flex;
  gap: 0.125rem;
  cursor: pointer;
  text-align: start;
  & > .icon {
    color: var(--local-clr);
    --local-clr: var(--text-accent);
    --local-clr-hover: var(--text-accent-hover);
  }
  &:hover > .icon,
  &:focus-visible > .icon {
    color: var(--local-clr-hover);
  }
  &:hover,
  &:focus-visible {
    color: #fff;
  }
  &:disabled {
    cursor: initial !important;
    color: #666 !important;
  }
  & > .icon > svg {
    filter: drop-shadow(0px 1px 1px #0006);
  }
  &:disabled > .icon {
    cursor: initial !important;
    color: var(--text-disabled) !important;
  }
  &.danger > .icon {
    --local-clr: var(--text-danger);
    --local-clr-hover: var(--text-danger-hover);
  }
  &.emphasis > .icon {
    --local-clr: var(--text-emphasis);
    --local-clr-hover: var(--text-emphasis-hover);
  }
  &.info > .icon {
    --local-clr: var(--text-info);
    --local-clr-hover: var(--text-info-hover);
  }
  &.help > .icon {
    --local-clr: var(--text-help);
    --local-clr-hover: var(--text-help-hover);
  }
  &.confirm > .icon {
    --local-clr: var(--text-confirm);
    --local-clr-hover: var(--text-confirm-hover);
  }
`;
