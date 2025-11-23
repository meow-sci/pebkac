import { DOMParser } from '@xmldom/xmldom';

import type { SystemEntry } from "../data/SystemEntry";
import type { GeneratorConfig } from '../data/GeneratorConfig';
import type { CelestialType } from '../data/CelestialType';

export function transformSystemEntryToKsaXml(config: GeneratorConfig, source: SystemEntry): Element {

  const doc = createDocument();
  const el = createCelestialRootElement(doc, source.MODEL_TYPE, source.ID, source.PARENT);

  addElementWithAttribute(doc, el, "SemiMajorAxis", "Km", source.A_SEMI_MAJOR_AXIS_KM);
  addElementWithAttribute(doc, el, "Inclination", "Degrees", source.IN_INCLINATION_DEG);
  addElementWithAttribute(doc, el, "Eccentricity", "Value", source.EC_ECCENTRICITY);
  addElementWithAttribute(doc, el, "LongitudeOfAscendingNode", "Degrees", source.OM_LONGITUDE_ASCENDING_NODE_DEG);
  addElementWithAttribute(doc, el, "ArgumentOfPeriapsis", "Degrees", source.W_ARG_PERIAPSIS_DEG);
  addElementWithAttribute(doc, el, "MeanAnomalyAtEpoch", "Degrees", source.MA_MEAN_ANOMALY_DEG);
  addElementWithAttribute(doc, el, "MeanRadius", "Km", source.MEAN_RADIUS_KM);
  addElementWithAttribute(doc, el, "Period", "Seconds", source.PERIOD_SEC);
  addElementWithAttribute(doc, el, "AxialTilt", "Degrees", source.AXIAL_TILT_DEG);

  // mass is (GM_KM3/S2) / (gravitational constant) = celestial mass in Kg
  if (isNotEmptyString(source["GM_KM3/S2"])) {
    const val = Number(source["GM_KM3/S2"]);
    const mass = val / config.gravitational_constant;
    addElementWithAttribute(doc, el, "Mass", "Kg", mass.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 2 }));
  }

  // TidallyLocked if PERIOD_SEC is 0
  if (source.PERIOD_SEC === "0") {
    addElementWithAttribute(doc, el, "TidallyLocked", "Value", "true");
  }

  // Retrograde if RETROGRADE_ROT is true
  if (isTrueString(source.RETROGRADE_ROT)) {
    addElementWithAttribute(doc, el, "Retrograde", "Value", "true");
  }

  return el;

}

export function addElementWithAttribute(doc: Document, parent: Element, name: string, attrName: string, value: string | null | undefined) {
  if (isNotEmptyString(value)) {
    const child = doc.createElement(name);
    child.setAttribute(attrName, value);
    parent.appendChild(child);
  }
}

export function createDocument(): Document {
  const parser = new DOMParser();
  // create an empty xml document
  return parser.parseFromString("<root/>", "application/xml");
}

export function createCelestialRootElement(doc: Document, type: CelestialType, id: string, parent: string | undefined | null): Element {
  const el = doc.createElement(type);

  el.setAttribute("Id", id);
  if (parent) {
    el.setAttribute("Parent", parent);
  }

  return el;
}

export function isTrueString(o: string | undefined | null): boolean {
  if (typeof o === "string" && o.toLowerCase() === "true") {
    return true;
  }
  return false;
}

function isNotEmptyString(o: string | undefined | null): o is string {
  if (typeof o === "string" && o.trim() !== "") {
    return true;
  }
  return false;
}
