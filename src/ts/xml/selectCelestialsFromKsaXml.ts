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
    StellarBody: q('.//StellarBody'),
    AtmosphericBody: q('.//AtmosphericBody'),
    Comet: q('.//Comet'),
    PlanetaryBody: q('.//PlanetaryBody'),
    MinorBody: q('.//MinorBody'),
    Asteroid: q('.//Asteroid'),

    allBodies: [],
  };

  result.allBodies = [
    ...result.StellarBody,
    ...result.AtmosphericBody,
    ...result.Comet,
    ...result.PlanetaryBody,
    ...result.MinorBody,
    ...result.Asteroid,
  ];

  return result;

}
