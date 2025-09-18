export type FileType = 'file' | 'dir' | 'symlink';

export interface FileStats {
  uid: number;
  gid: number;
  mode: number;
  type: FileType;
  size: number;
  created?: Date;
  modified?: Date;
}

export interface FileNode {
  name: string;
  stats: FileStats;
  content?: Uint8Array | string;
  target?: string;
  children?: Map<string, FileNode>;
}

export interface DirectoryEntry {
  name: string;
  stats: FileStats;
}

export class MemoryFileSystem {
  private root: FileNode;

  constructor() {
    this.root = this.createNode('/', 'dir', 0, 0, 0o755);
    this.root.children = new Map();
  }

  private createNode(
    name: string,
    type: FileType,
    uid: number = 0,
    gid: number = 0,
    mode: number = 0o644
  ): FileNode {
    const now = new Date();
    return {
      name,
      stats: {
        uid,
        gid,
        mode,
        type,
        size: 0,
        created: now,
        modified: now,
      },
      ...(type === 'dir' ? { children: new Map() } : {}),
    };
  }

  private normalizePath(path: string): string[] {
    return path.split('/').filter(part => part && part !== '.');
  }

  private resolveNode(path: string): FileNode | null {
    const parts = this.normalizePath(path);
    let current = this.root;

    for (const part of parts) {
      if (!current.children?.has(part)) {
        return null;
      }
      
      current = current.children.get(part)!;
    }

    return current;
  }

  private getParentNode(path: string): { parent: FileNode; basename: string } | null {
    const parts = this.normalizePath(path);
    if (parts.length === 0) {
      return null;
    }

    const basename = parts.pop()!;
    const parent = parts.length === 0 ? this.root : this.resolveNode('/' + parts.join('/'));
    
    if (!parent || parent.stats.type !== 'dir') {
      return null;
    }

    return { parent, basename };
  }

  exists(path: string): boolean {
    return this.resolveNode(path) !== null;
  }

  stat(path: string): FileStats | null {
    const node = this.resolveNode(path);
    return node ? { ...node.stats } : null;
  }

  lstat(path: string): FileStats | null {
    const node = this.resolveNode(path);
    return node ? { ...node.stats } : null;
  }

  readFile(path: string): Uint8Array | string | null {
    const node = this.resolveNode(path);
    if (!node || node.stats.type !== 'file') {
      return null;
    }
    return node.content || new Uint8Array(0);
  }

  writeFile(
    path: string,
    content: Uint8Array | string,
    options: {
      uid?: number;
      gid?: number;
      mode?: number;
    } = {}
  ): boolean {
    const pathInfo = this.getParentNode(path);
    if (!pathInfo) {
      return false;
    }

    const { parent, basename } = pathInfo;
    const existing = parent.children!.get(basename);

    if (existing && existing.stats.type !== 'file') {
      return false;
    }

    const node = existing || this.createNode(basename, 'file', options.uid, options.gid, options.mode);
    node.content = content;
    node.stats.size = typeof content === 'string' ? new TextEncoder().encode(content).length : content.length;
    node.stats.modified = new Date();

    if (options.uid !== undefined) node.stats.uid = options.uid;
    if (options.gid !== undefined) node.stats.gid = options.gid;
    if (options.mode !== undefined) node.stats.mode = options.mode;

    parent.children!.set(basename, node);
    return true;
  }

  mkdir(
    path: string,
    options: {
      uid?: number;
      gid?: number;
      mode?: number;
      recursive?: boolean;
    } = {}
  ): boolean {
    const parts = this.normalizePath(path);
    let current = this.root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const existing = current.children!.get(part);

      if (existing) {
        if (existing.stats.type !== 'dir') {
          return false;
        }
        current = existing;
      } else {
        if (!options.recursive && i < parts.length - 1) {
          return false;
        }

        const newDir = this.createNode(part, 'dir', options.uid, options.gid, options.mode || 0o755);
        current.children!.set(part, newDir);
        current = newDir;
      }
    }

    return true;
  }

  readdir(path: string): DirectoryEntry[] | null {
    const node = this.resolveNode(path);
    if (!node || node.stats.type !== 'dir' || !node.children) {
      return null;
    }

    return Array.from(node.children.values()).map(child => ({
      name: child.name,
      stats: { ...child.stats },
    }));
  }

  symlink(target: string, path: string, options: {
    uid?: number;
    gid?: number;
    mode?: number;
  } = {}): boolean {
    const pathInfo = this.getParentNode(path);
    if (!pathInfo) {
      return false;
    }

    const { parent, basename } = pathInfo;
    
    if (parent.children!.has(basename)) {
      return false;
    }

    const node = this.createNode(basename, 'symlink', options.uid, options.gid, options.mode || 0o777);
    node.target = target;

    parent.children!.set(basename, node);
    return true;
  }

  readlink(path: string): string | null {
    const node = this.resolveNode(path);
    if (!node || node.stats.type !== 'symlink') {
      return null;
    }
    return node.target || null;
  }

  unlink(path: string): boolean {
    const pathInfo = this.getParentNode(path);
    if (!pathInfo) {
      return false;
    }

    const { parent, basename } = pathInfo;
    const node = parent.children!.get(basename);
    
    if (!node || node.stats.type === 'dir') {
      return false;
    }

    return parent.children!.delete(basename);
  }

  rmdir(path: string, options: { recursive?: boolean } = {}): boolean {
    const pathInfo = this.getParentNode(path);
    if (!pathInfo) {
      return false;
    }

    const { parent, basename } = pathInfo;
    const node = parent.children!.get(basename);
    
    if (!node || node.stats.type !== 'dir') {
      return false;
    }

    if (options.recursive) {
      // Recursively delete all children
      if (node.children) {
        for (const [childName, childNode] of node.children) {
          const childPath = path === '/' ? `/${childName}` : `${path}/${childName}`;
          if (childNode.stats.type === 'dir') {
            this.rmdir(childPath, { recursive: true });
          } else {
            this.unlink(childPath);
          }
        }
      }
    } else if (node.children!.size > 0) {
      return false;
    }

    return parent.children!.delete(basename);
  }

  chmod(path: string, mode: number): boolean {
    const node = this.resolveNode(path);
    if (!node) {
      return false;
    }

    node.stats.mode = mode;
    node.stats.modified = new Date();
    return true;
  }

  chown(path: string, uid: number, gid: number): boolean {
    const node = this.resolveNode(path);
    if (!node) {
      return false;
    }

    node.stats.uid = uid;
    node.stats.gid = gid;
    node.stats.modified = new Date();
    return true;
  }
}