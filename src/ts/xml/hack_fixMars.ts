import xpath from "xpath";


/**
 * Remove any <SlopeMaterial> elements that contain a <Diffuse Id="LunaCliffsDiffuse"/>
 * Also remove any <Terrain> nodes that are descendants of an <AtmosphericBody Id="Mars"> node.
 *
 */
export function hack_fixMars(doc: Document): void {
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

  // Remove any Terrain nodes that are under AtmosphericBody with Id='Mars'
  const marsTerrainNodes = q(".//AtmosphericBody[@Id='Mars']//Terrain");
  marsTerrainNodes.forEach(node => {
    const parent = node.parentNode;
    if (parent) {
      parent.removeChild(node);
    }
  });

  // Remove any Terrain nodes that are under MinorBody with Id='Phobos'
  const phobosTerrainNodes = q(".//MinorBody[@Id='Phobos']//Terrain");
  phobosTerrainNodes.forEach(node => {
    const parent = node.parentNode;
    if (parent) {
      parent.removeChild(node);
    }
  });

}
