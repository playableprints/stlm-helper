import { faSquareHackerNews } from "@fortawesome/free-brands-svg-icons";
import { Children } from "react";
import natsort from "../natsort";
import AbstractTree from "./abstract";

export type File = {
  isFolder: false;
  name: string;
  ext: string;
};

export type Folder = {
  isFolder: true;
  name: string;
};

const getName = (fullName: string) => {
  const n = fullName.split(".");
  if (n.length > 1) {
    const e = n.pop();
    return [n.join("."), e!];
  }
  return [fullName, ""];
};

type NestedElement = {
  name: string;
  full: string;
  children: NestedElement[];
};

const collapse = (n: FileTree, delim: string, tree: NestedElement, parent: string) => {
  if (tree.name.endsWith(delim)) {
    tree.name = tree.name + delim;
    tree.full = tree.full + delim;
    if (tree.children.length === 1) {
      if (tree.children[0].name.endsWith(delim)) {
        tree.name = tree.name + tree.children[0].name;
        tree.full = tree.children[0].full;
        tree.children = tree.children[0].children;
        collapse(n, delim, tree, parent);
      } else {
        n.append(tree.full, { isFolder: true, name: tree.name }, parent);
        const [name, ext] = getName(tree.children[0].name);
        n.append(tree.children[0].full, { isFolder: false, name, ext }, tree.full);
      }
    } else {
      n.append(tree.full, { isFolder: true, name: tree.name }, parent);
      tree.children.forEach((c) => {
        if (c.name.endsWith(delim)) {
          collapse(n, delim, c, tree.full);
        } else {
          const [name, ext] = getName(c.name);
          n.append(c.full, { isFolder: false, name, ext }, tree.full);
        }
      });
    }
  }
};

export default class FileTree extends AbstractTree<File | Folder> {
  static fromList(list: string[], delim: string = "/", condense: boolean = false) {
    const n = new FileTree(delim, { isFolder: true, name: delim });
    list.sort(natsort);

    if (condense) {
      const result = [] as NestedElement[];
      list.forEach((path) => {
        let c = result;
        path
          .split(delim)
          .slice(1, path.endsWith(delim) ? -1 : undefined)
          .forEach((part, i, arr) => {
            const name = part + (i !== arr.length - 1 || path.endsWith(delim) ? delim : "");
            const existing = c.find((o) => o.name === name);
            if (existing) {
              c = existing.children;
            } else {
              const n = {
                name,
                children: [],
                full: delim + arr.slice(0, i + 1).join(delim),
              };
              c.push(n);
              c = n.children;
            }
          });
      });
      result.forEach((child) => {
        collapse(n, delim, child, delim);
      });
      return n;
    }

    list.forEach((id) => {
      const isFolder = id.endsWith(delim);
      const chunks = id.split(delim).slice(0, isFolder ? -1 : undefined);
      if (chunks.length > 0) {
        const fullName = chunks.pop();
        chunks.forEach((segment, i, arr) => {
          if (i > 0) {
            const parent = arr.slice(0, i).join(delim) + delim;
            const thisFolder = parent + segment + delim;
            if (!n.has(thisFolder)) {
              n.append(thisFolder, { isFolder: true, name: segment }, parent);
            }
          }
        });
        if (isFolder) {
          const p = chunks.join(delim) + delim;
          n.append(id, { isFolder: true, name: fullName! }, p);
        } else {
          const p = chunks.join(delim) + delim;
          const [basename, ext] = getName(fullName!);
          n.append(id, { isFolder: false, name: basename!, ext }, p);
        }
      }
    });

    // `/`
    // `/level1/`
    // `/level1/level2/file.txt`
    // `/level1/level2/`
    // `/level1/level2/level3/file.text`

    /*
    list.forEach((id: string) => {
      const isFolder = id.endsWith(delim);
      const chunks = id.split(delim);
      //   const chunks = e.split(delim).slice(e.startsWith(delim) ? 1 : isFolder ? -1 : undefined);
      if (isFolder) {
        chunks.pop();
      }
      if (chunks.length > 0) {
        const fullName = chunks.pop();
      }
    });
    */

    return n;
  }
}
