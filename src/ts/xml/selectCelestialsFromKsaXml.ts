import { DOMParser } from '@xmldom/xmldom'
import xpath from "xpath";

import type { ExtractedCelestials } from '../data/ExtractedCelestials';

export function selectCelestialsFromKsaXml(fileName: string, xml: string): ExtractedCelestials {
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  // use the document element as the context so the root name (System, Assets, etc.) is irrelevant
  const root = doc.documentElement;

  const q = (expr: string) => xpath.select(expr, root) as Element[];

  const result: ExtractedCelestials = {
    fileName,
    doc,
    stellarBodies: q('.//StellarBody'),
    terrestrialBodies: q('.//TerrestrialBody'),
    atmosphericBodies: q('.//AtmosphericBody'),
    comets: q('.//Comet'),
    allBodies: [],
  };

  result.allBodies = [
    ...result.stellarBodies,
    ...result.terrestrialBodies,
    ...result.atmosphericBodies,
    ...result.comets,
  ];

  return result;

}