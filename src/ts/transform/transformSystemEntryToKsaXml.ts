import { DOMParser } from '@xmldom/xmldom';
import xpath from "xpath";

import type { SystemEntry } from "../data/SystemEntry";
import type { GeneratorContext } from '../data/GeneratorContext';
import type { CelestialType } from '../data/CelestialType';
import { isElementNode } from '../xml/isXmlNodeTypeGuards';
import { isNotEmptyString } from '../util/isNotEmptyString';
import { isTrueString } from '../util/isTrueString';

/**
 * Given a SystemEntry, transform it into a KSA Celestial XML Element.
 * @param context The current GeneratorContext
 * @param source The SystemEntry data
 * @returns A XML Element representing the celestial body in KSA format
 */
export function transformSystemEntryToKsaXml(context: GeneratorContext, source: SystemEntry): Element {
  const doc = createDocument();
  const el = createCelestialRootElement(doc, source.MODEL_TYPE, source.ID, source.PARENT);
  transformSystemEntryToKsaXmlIntoElement(context, source, doc, el);
  return el;
}

/**
 * Given a SystemEntry, transform it into a KSA Celestial XML Element.
 * 
 * This variant populates an existing Element rather than creating a new one.  If there are data collisions,
 * the SystemEntry data will replace existing Element data.
 * 
 * @param context The current GeneratorContext
 * @param source The SystemEntry data
 * @param doc The XML Document to create elements in
 * @param el The XML Element to populate with child elements
 * @returns A XML Element representing the celestial body in KSA format
 */
export function transformSystemEntryToKsaXmlIntoElement(context: GeneratorContext, source: SystemEntry, doc: Document, el: Element): void {

  addElementWithAttribute(context, doc, el, true, "SemiMajorAxis", "Km", source.A_SEMI_MAJOR_AXIS_KM);
  addElementWithAttribute(context, doc, el, true, "Inclination", "Degrees", source.IN_INCLINATION_DEG);
  addElementWithAttribute(context, doc, el, true, "Eccentricity", "Value", source.EC_ECCENTRICITY);
  addElementWithAttribute(context, doc, el, true, "LongitudeOfAscendingNode", "Degrees", source.OM_LONGITUDE_ASCENDING_NODE_DEG);
  addElementWithAttribute(context, doc, el, true, "ArgumentOfPeriapsis", "Degrees", source.W_ARG_PERIAPSIS_DEG);
  addElementWithAttribute(context, doc, el, true, "MeanAnomalyAtEpoch", "Degrees", source.MA_MEAN_ANOMALY_DEG);
  addElementWithAttribute(context, doc, el, true, "MeanRadius", "Km", source.MEAN_RADIUS_KM);
  addElementWithAttribute(context, doc, el, true, "Period", "Seconds", source.PERIOD_SEC);
  addElementWithAttribute(context, doc, el, true, "AxialTilt", "Degrees", source.AXIAL_TILT_DEG);

  // mass is (GM_KM3/S2) / (gravitational constant) = celestial mass in Kg
  if (isNotEmptyString(source["GM_KM3/S2"])) {
    addElementWithAttribute(context, doc, el, true, "Mass", "Kg", calculateMassKgFromGm(source["GM_KM3/S2"], context));
  }

  // TidallyLocked if PERIOD_SEC is 0
  if (source.PERIOD_SEC === "0") {
    addElementWithAttribute(context, doc, el, true, "TidallyLocked", "Value", "true");
  }

  // Retrograde if RETROGRADE_ROT is true
  if (isTrueString(source.RETROGRADE_ROT)) {
    addElementWithAttribute(context, doc, el, true, "Retrograde", "Value", "true");
  }

  // add a newline after last child for formatting
  el.appendChild(doc.createTextNode("\n"));
}

export function calculateMassKgFromGm(gmKm3PerS2: string, context: GeneratorContext): string {
  const val = Number(gmKm3PerS2);
  const mass = val / context.gravitational_constant;
  const str = mass.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 2 })
  return str;
}

export function addElementWithAttribute(context: GeneratorContext, doc: Document, parent: Element, replaceExisting: boolean, name: string, attrName: string, value: string | null | undefined) {
  if (isNotEmptyString(value)) {

    if (replaceExisting) {
      var existing = xpath.select1(`${name}`, parent);
      if (isElementNode(existing)) {
        context.info(`Removing existing element ${prettyNameForElement(existing)} in parent ${prettyNameForElement(parent)}`);
        parent.removeChild(existing);
      }
    }

    parent.appendChild(doc.createTextNode("\n    "));

    const child = doc.createElement(name);
    child.setAttribute(attrName, value);
    parent.appendChild(child);

    context.info(`Added element ${prettyNameForElement(child)} to parent ${prettyNameForElement(parent)}`);

  }
}

export function prettyNameForElement(el: Element): string {

  let attributeString = "";

  if (el.hasAttributes()) {

    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes.item(i);
      if (attr) {
        attributeString += ` ${attr.name}="${attr.value}"`;
      }
    }
  }

  return `<${el.nodeName}${attributeString}>`;
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
