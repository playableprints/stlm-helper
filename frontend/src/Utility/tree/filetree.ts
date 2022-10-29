import { faSquareHackerNews } from "@fortawesome/free-brands-svg-icons";
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

export default class FileTree extends AbstractTree<File | Folder> {
  static fromList(list: string[], delim: string = "/") {
    const n = new FileTree(delim, { isFolder: true, name: delim });
    list.sort(natsort);

    list.forEach((id) => {
      const isFolder = id.endsWith(delim);
      const chunks = id.split(delim).slice(0, isFolder ? -1 : undefined);
      if (chunks.length > 0) {
        const fullName = chunks.pop();
        console.log(chunks);
        chunks.forEach((segment, i, arr) => {
          console.log(segment, arr);
          if (i > 0) {
            const parent = arr.slice(0, i).join("/") + "/";
            const thisFolder = parent + segment + "/";
            if (!n.has(thisFolder)) {
              n.append(thisFolder, { isFolder: true, name: segment }, parent);
            }
          }
        });
        if (isFolder) {
          const p = chunks.join("/") + "/";
          n.append(id, { isFolder: true, name: fullName! }, p);
        } else {
          const p = chunks.join("/") + "/";
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
