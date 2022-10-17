import { faFolderOpen, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLAttributes } from "react";
import styled from "styled-components";

export type IFileTree = {
    name: string;
    isFolder: boolean;
    contents?: IFileTree[] | null;
    type?: string;
};

const Icon = styled(FontAwesomeIcon)`
    color: #777;
`;

type IHierarchy = {
    depth: number;
    last: boolean;
    first?: boolean;
    parentLast: boolean;
};

const Spacer = styled(
    ({
        depth,
        first = false,
        last = false,
        parentLast = false,
        className,
        ...props
    }: IHierarchy & HTMLAttributes<HTMLSpanElement>) => {
        return (
            <span {...props} className={`${className} ${depth === 0 ? "root" : ""}`}>
                {depth > 0
                    ? Array(depth - 1)
                          .fill(parentLast ? " " : "│")
                          .map((e, i) => {
                              return <span key={i}>{e}</span>;
                          })
                    : null}
                {depth > 0 ? <span>{last ? "└" : "├"}</span> : null}
            </span>
        );
    }
)`
    font-family: monospace;
    color: #555;
    font-size: 1.1em;
    white-space: pre;
    display: flex;
    gap: 0.375rem;
    padding-left: 0.125rem;
`;

const Name = styled.span`
    padding-left: 0.125rem;
`;

const Entry = styled(
    ({
        last = false,
        depth = 0,
        type,
        contents,
        name,
        isFolder,
        parentLast,
        ...props
    }: IFileTree & IHierarchy & HTMLAttributes<HTMLDivElement>) => {
        return (
            <>
                <div {...props}>
                    <Spacer depth={depth} last={last} parentLast={parentLast} />
                    <Icon className={"fa-fw"} icon={isFolder ? faFolderOpen : faFile} />
                    <Name>{name}</Name>
                </div>
                {contents?.map((entry, i, ary) => {
                    return (
                        <Entry
                            key={i}
                            depth={depth + 1}
                            last={i === ary.length - 1}
                            parentLast={last}
                            {...entry}
                        />
                    );
                })}
            </>
        );
    }
)`
    display: flex;
    white-space: nobreak;
    align-items: center;
    padding-left: 0.125rem;
`;

type IProps = {
    tree: IFileTree[] | IFileTree;
} & HTMLAttributes<HTMLDivElement>;

const FileTree = styled(({ tree, ...props }: IProps) => {
    tree = Array.isArray(tree) ? tree : [tree];
    return (
        <div {...props}>
            {tree.map((entry, i, ary) => {
                return (
                    <Entry
                        key={i}
                        depth={0}
                        last={i === ary.length - 1}
                        parentLast={false}
                        {...entry}
                    />
                );
            })}
        </div>
    );
})`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: stretch;
`;

export default FileTree;
