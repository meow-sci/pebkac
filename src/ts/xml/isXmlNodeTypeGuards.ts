// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType

export function isElementNode(node: any): node is Element {
  return node && node.nodeType === 1; // Node.ELEMENT_NODE
}

export function isAttributeNode(node: any): node is Attr {
  return node && node.nodeType === 2; // Node.ATTRIBUTE_NODE
}

export function isTextNode(node: any): node is Text {
  return node && node.nodeType === 3 // Node.TEXT_NODE
}
