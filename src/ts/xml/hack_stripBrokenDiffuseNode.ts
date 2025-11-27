import xpath from "xpath";


/**
 * Remove any <SlopeMaterial> elements that contain a <Diffuse Id="LunaCliffsDiffuse"/>
 *
 */
export function hack_stripBrokenDiffuseNode(doc: Document): void {
  const root = doc.documentElement;
  if (!root) {
    return;
  }

  const q = (expr: string) => xpath.select(expr, root) as Element[];

  // Select any SlopeMaterial element which has a Diffuse child where @Id='LunaCliffsDiffuse'
  const brokenSlopeMaterials = q(".//SlopeMaterial[Diffuse/@Id='LunaCliffsDiffuse']");

  brokenSlopeMaterials.forEach(node => {
    const parent = node.parentNode;
    if (parent) {
      parent.removeChild(node);
    }
  });
}
