import { isTextNode, isElementNode, isAttributeNode } from "./isXmlNodeTypeGuards";

/**
 * Recurisively walk the Document, looking for any "Path" attribute and mutate the existing
 * value with a prefix of `../Core/`
 * 
 * @param doc Document to mutate
 * @returns 
 */
export function fixPathsToCore(doc: Document): void {

  const root = doc.documentElement;

  if (!root) {
    return;
  }

  fixElementPaths(root);
}

function fixElementPaths(element: Element): void {
  // Check if this element has a "Path" attribute
  if (element.hasAttribute("Path")) {
    const currentPath = element.getAttribute("Path");
    if (currentPath && !currentPath.startsWith("../Core/")) {
      element.setAttribute("Path", `../Core/${currentPath}`);
    }
  }

  // Recursively process child elements
  element.childNodes.forEach(node => {
    if (isElementNode(node)) {
      fixElementPaths(node);
    }
  });
}
