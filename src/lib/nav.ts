import fs from 'node:fs';
import path from 'node:path';

export type NavFile = {
  type: 'file';
  label: string;
  slug: string;
};

export type NavDir = {
  type: 'dir';
  label: string;
  position: number;
  dirPath: string;
  children: NavNode[];
};

export type NavNode = NavFile | NavDir;

function readCategory(dirPath: string): { label: string; position: number } {
  const catPath = path.join(dirPath, '_category_.json');
  try {
    const raw = fs.readFileSync(catPath, 'utf-8');
    const cat = JSON.parse(raw);
    return {
      label: cat.label ?? path.basename(dirPath),
      position: cat.position ?? 999,
    };
  } catch {
    return { label: path.basename(dirPath), position: 999 };
  }
}

function extractTitle(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : path.basename(filePath, '.md');
  } catch {
    return path.basename(filePath, '.md');
  }
}

function scanDir(dirPath: string, prefix: string): NavNode[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: NavNode[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const cat = readCategory(fullPath);
      const childPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
      nodes.push({
        type: 'dir',
        label: cat.label,
        position: cat.position,
        dirPath: childPrefix,
        children: scanDir(fullPath, childPrefix),
      });
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const rawSlug = (prefix ? `${prefix}/${entry.name}` : entry.name).replace(/\.md$/, '');
      const slug = sanitizeSlug(rawSlug);
      nodes.push({
        type: 'file',
        label: extractTitle(fullPath),
        slug,
      });
    }
  }

  nodes.sort((a, b) => {
    if (a.type === 'dir' && b.type === 'dir') return a.position - b.position;
    if (a.type === 'dir') return -1;
    if (b.type === 'dir') return 1;
    return a.label.localeCompare(b.label, 'ru');
  });

  return nodes;
}

export function sanitizeSlug(slug: string): string {
  return slug.split('/').map((s) => s.replace(/\./g, '')).join('/');
}

const DOCS_DIR = path.resolve(process.cwd(), 'docs');

export function buildNavTree(): NavNode[] {
  return scanDir(DOCS_DIR, '');
}

export function flattenNavTree(nodes: NavNode[]): NavFile[] {
  const result: NavFile[] = [];
  for (const node of nodes) {
    if (node.type === 'file') {
      result.push(node);
    } else {
      result.push(...flattenNavTree(node.children));
    }
  }
  return result;
}
