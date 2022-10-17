import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

type IProps = {
  text?: ReactNode;
  help?: string;
} & HTMLAttributes<HTMLDivElement>;

const Contents = styled.div`
  display: flex;
  align-self: stretch;
`;

const Header = styled.div`
  display: flex;
  background: #222;
  align-self: start;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  margin-inline: 0.25rem;
  color: #aaa;
  min-width: 25%;
  justify-content: center;
`;

const Label = styled.div`
  flex: 1 1 auto;
`;

const HelpIcon = styled(({ className, ...props }: Omit<FontAwesomeIconProps, "icon">) => {
  return <FontAwesomeIcon className={`fa-fw ${className ?? ""}`} {...props} icon={faQuestion} />;
})`
  color: var(--text-info);
  margin-left: 0.5rem;
  display: flex;
  align-self: center;
  cursor: help;
  flex: 0 0 auto;
  &:hover {
    color: var(--text-info-hover);
  }
`;

export default styled(({ text, help, children, ...props }: IProps) => {
  return (
    <div {...props}>
      {(text || help) && (
        <Header>
          <Label>{text}</Label>
          {help && <HelpIcon title={help} />}
        </Header>
      )}
      {children && <Contents>{children}</Contents>}
    </div>
  );
})`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;
