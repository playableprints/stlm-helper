import { faFolderOpen, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLAttributes } from "react";
import styled from "styled-components";
import FileTree from "../../Utility/tree/filetree";

const Icon = styled(FontAwesomeIcon)`
  color: #777;
`;

type IHierarchy = {
  depth: boolean[];
};

type IFileTreeEntry = {
  tree: FileTree;
  treeId: string;
  name?: string;
};

const Name = styled.span`
  padding-left: 0.125rem;
`;

const Spacer = styled(({ depth, className, ...props }: IHierarchy & HTMLAttributes<HTMLSpanElement>) => {
  if (depth.length === 0) {
    return null;
  }
  return (
    <span {...props} className={`${className} ${depth.length === 0 ? "root" : ""}`}>
      {depth.slice(0, -1).map((e, i) => {
        return <span key={i}>{e ? " " : "│"}</span>;
      })}
      <span>{depth[depth.length - 1] ? "└" : "├"}</span>
    </span>
  );
})`
  font-family: monospace;
  color: #555;
  font-size: 1.1em;
  white-space: pre;
  display: inline-flex;
  gap: 0.375rem;
  padding-left: 0.125rem;
`;

const Entry = ({ depth = [], tree, treeId, name }: IFileTreeEntry & IHierarchy) => {
  const entry = tree.get(treeId);
  return (
    <>
      <div>
        <Spacer depth={depth} />
        <Icon className={"fa-fw"} icon={entry.isFolder ? faFolderOpen : faFile} />
        <Name>{name ?? (entry.isFolder ? entry.name : `${entry.name}.${entry.ext}`)}</Name>
      </div>
      {entry.isFolder ? (
        <>
          {entry.children?.map((entry, i, ary) => {
            return <Entry key={i} tree={tree} treeId={entry} depth={[...depth, i === ary.length - 1]} />;
          })}
        </>
      ) : null}
    </>
  );
};

type IProps = {
  tree: FileTree | null;
  showRoot?: boolean;
  rootName?: string;
} & HTMLAttributes<HTMLDivElement>;

const FileTreeDisplay = ({ tree, showRoot = false, rootName, ...props }: IProps) => {
  return (
    <div {...props}>
      {tree ? (
        showRoot ? (
          <Entry tree={tree} depth={[]} treeId={"/"} name={rootName} />
        ) : (
          tree.get("/").children.map((childId) => {
            return <Entry key={childId} depth={[]} tree={tree} treeId={childId} />;
          })
        )
      ) : null}
    </div>
  );
};

export default FileTreeDisplay;
