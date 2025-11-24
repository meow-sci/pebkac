import { isTextNode, isElementNode } from "./isXmlNodeTypeGuards";

export function collapseXmlDeadspace(doc: Document): void {

  const root = doc.documentElement;

  if (!root) {
    return;
  }

  collapseElementWhitespace(root);
}

function collapseElementWhitespace(element: Element): void {
  const nodesToRemove: Node[] = [];

  element.childNodes.forEach(node => {
    if (isTextNode(node)) {
      const text = node.nodeValue || "";
      // Check if it's whitespace-only
      if (text.trim() === "") {
        nodesToRemove.push(node);
      }
    } else if (isElementNode(node)) {
      // Recursively process child elements
      collapseElementWhitespace(node);
    }
  });

  for (const node of nodesToRemove) {
    element.removeChild(node);
  }
}