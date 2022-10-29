import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircle, faCircleDot } from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes, useCallback, MouseEvent } from "react";
import styled from "styled-components";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProp;
  value: string;
  target: string;
  onPick?: (value: string) => void;
  comparitor?: (a: any, b: any) => boolean;
}

const DEFAULT_COMPARITOR = (a: any, b: any) => a === b;

export default styled(
  ({
    icon,
    value,
    target,
    comparitor = DEFAULT_COMPARITOR,
    className,
    disabled,
    children,
    onPick,
    onClick,
    ...props
  }: IProps) => {
    const checked = comparitor(value, target);
    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick && onClick(e);
        onPick && onPick(target);
      },
      [onClick, onPick, target]
    );
    return (
      <button
        {...props}
        className={`${className ?? ""} ${checked && !disabled ? "checked" : ""}`}
        disabled={disabled}
        onClick={handleClick}
      >
        <span className={"icon"}>
          <FontAwesomeIcon icon={icon ?? (checked ? faCircleDot : faCircle)} className={`fa-fw`} />
        </span>
        {children && <span className={"text"}>{children}</span>}
      </button>
    );
  }
)`
  display: inline-flex;
  gap: 0.125rem;
  cursor: pointer;
  text-align: start;
  & > .icon {
    color: var(--local-clr);
    --local-clr: var(--text-accent);
    --local-clr-hover: var(--text-accent-hover);
    flex: 0 0 auto;
  }
  & > .text {
    flex: 1 1 auto;
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
