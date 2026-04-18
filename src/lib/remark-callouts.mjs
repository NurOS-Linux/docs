import { visit } from 'unist-util-visit';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';

function hastChildrenToHtml(children) {
  return children.map((child) => toHtml(child)).join('');
}

export function rehypeCallouts() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined || node.tagName !== 'p') return;

      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== 'text') return;

      const openMatch = firstChild.value.match(/^:::(\w+)(?:\s+([^\n]+))?\n?/);
      if (!openMatch) return;

      const [fullMatch, type, title] = openMatch;

      const modifiedChildren = node.children
        .map((child, i) => {
          if (i === 0) return { ...child, value: child.value.slice(fullMatch.length) };
          if (i === node.children.length - 1 && child.type === 'text') {
            return { ...child, value: child.value.replace(/\n?:::$/, '') };
          }
          return child;
        })
        .filter((c) => c.type !== 'text' || c.value !== '');

      const titleNode = title
        ? {
            type: 'element',
            tagName: 'p',
            properties: { className: ['callout-title'] },
            children: [{ type: 'text', value: title }],
          }
        : null;

      const bodyNode = {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: modifiedChildren,
      };

      const divNode = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout', `callout-${type}`] },
        children: titleNode ? [titleNode, bodyNode] : [bodyNode],
      };

      parent.children.splice(index, 1, divNode);
    });
  };
}
