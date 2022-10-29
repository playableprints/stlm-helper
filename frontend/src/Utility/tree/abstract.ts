type Entry = {
  parent: string | null;
  children: string[];
  id: string;
};

export default class AbstractTree<T extends Object> {
  #tree = {} as {
    [key: string]: Entry & T;
  };
  #root: string;
  constructor(rootKey: string, data: T) {
    this.#root = rootKey;
    this.#tree[rootKey] = {
      ...data,
      id: rootKey,
      children: [],
      parent: null,
    };
    this.get = this.get.bind(this);
    this.has = this.has.bind(this);
    this.getParent = this.getParent.bind(this);
    this.getChildren = this.getChildren.bind(this);
    this.isRoot = this.isRoot.bind(this);
    this.append = this.append.bind(this);
  }

  get(key: string) {
    return this.#tree[key];
  }

  has(key: string) {
    return key in this.#tree;
  }

  getParent(key: string) {
    if (this.has(key)) {
      const e = this.#tree[key];
      if (e.parent !== null) {
        return this.#tree[e.parent];
      }
    }
  }

  getChildren(key: string) {
    if (this.has(key)) {
      const e = this.#tree[key];
      return e.children.map((child) => {
        return this.#tree[child];
      });
    }
  }

  isRoot(key: string) {
    if (this.has(key)) {
      return key === this.#root;
    }
  }

  append(key: string, data: T, parent: string = this.#root) {
    this.#tree[key] = {
      ...data,
      children: [],
      parent,
      id: key,
    };
    this.#tree[parent].children.push(key);
  }

  show() {
    return this.#tree;
  }
}
