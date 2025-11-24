import { isAttributeNode, isElementNode, isTextNode } from "./isXmlNodeTypeGuards";

const NUM_SPACES = 2;

export function prettifyDocument(doc: Document): void {
  if (!doc.documentElement) return;

  // Remove existing whitespace-only text nodes first
  removeWhitespaceNodes(doc.documentElement);

  // Add pretty printing
  prettifyNode(doc.documentElement, 0);
}

function removeWhitespaceNodes(node: Node): void {
  const childNodes = Array.from(node.childNodes);

  for (const child of childNodes) {
    if (isTextNode(child) && child.nodeValue?.trim() === '') {
      node.removeChild(child);
    } else if (isElementNode(child)) {
      removeWhitespaceNodes(child);
    }
  }
}

function prettifyNode(node: Element, depth: number): void {
  const indent = '\n' + ' '.repeat(depth * NUM_SPACES);
  const childIndent = '\n' + ' '.repeat((depth + 1) * NUM_SPACES);

  const childNodes = Array.from(node.childNodes);

  if (childNodes.length === 0) {
    return;
  }

  // Check if node has only text content (no element children)
  const hasElementChildren = childNodes.some(child => isElementNode(child));

  if (!hasElementChildren) {
    // Keep text as-is for elements with only text content
    return;
  }

  // Add indentation before each child element
  for (let i = childNodes.length - 1; i >= 0; i--) {
    const child = childNodes[i];

    if (isElementNode(child)) {
      // Add indent before element
      node.insertBefore(node.ownerDocument.createTextNode(childIndent), child);
      // Recursively prettify child
      prettifyNode(child, depth + 1);
    }
  }

  // Add indent before closing tag
  node.appendChild(node.ownerDocument.createTextNode(indent));
}