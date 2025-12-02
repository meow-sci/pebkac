import xpath from "xpath";

import type { SystemEntry } from "../data/SystemEntry";
import type { GeneratorContext } from '../data/GeneratorContext';
import type { BodyType } from '../data/CelestialType';
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
  const el = createCelestialRootElement(doc, source.BODY_TYPE, source.ID, source.PARENT);
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

  // KSA now defines the orbital data inside an <Orbit> element which itself has attributes: <Orbit DefinitionFrame="Ecliptic" />
  if (isNotEmptyString(source.REF_FRAME) && (source.REF_FRAME.toLowerCase() == "equatorial" || source.REF_FRAME.toLowerCase() == "ecliptic")) {
    if (source.REF_FRAME.toLowerCase() == "equatorial") { addElementWithAttribute(context, doc, el, true, "Orbit", "DefinitionFrame", "Equatorial"); }
    else if (source.REF_FRAME.toLowerCase() == "ecliptic") { addElementWithAttribute(context, doc, el, true, "Orbit", "DefinitionFrame", "Ecliptic"); }
    else { addElementWithAttribute(context, doc, el, true, "Orbit", "DefinitionFrame", "Ecliptic"); }
  } else { addElementWithAttribute(context, doc, el, true, "Orbit", "DefinitionFrame", "Ecliptic"); }
  // Now add the child elements to the Orbit element
  const orbitEl = xpath.select1(`Orbit`, el);
  if (isElementNode(orbitEl)) {
    // First add a comment line listing the EPOCH used for this orbit, and the JPLREF number of the body JPLREF=
    if (isNotEmptyString(source.EPOCH) || isNotEmptyString(source.ID_JPLREF)) {
      let commentText = " Source:";
      if (isNotEmptyString(source.EPOCH)) { commentText += ` EPOCH=${source.EPOCH}`; }
      if (isNotEmptyString(source.ID_JPLREF)) { commentText += ` JPL_REF=${source.ID_JPLREF}`; }
      orbitEl.insertBefore(doc.createComment(commentText), orbitEl.firstChild);
    }
    addElementWithAttribute(context, doc, orbitEl, true, "SemiMajorAxis", "Km", source.A_SEMI_MAJOR_AXIS_KM);
    addElementWithAttribute(context, doc, orbitEl, true, "Inclination", "Degrees", source.IN_INCLINATION_DEG);
    addElementWithAttribute(context, doc, orbitEl, true, "Eccentricity", "Value", source.EC_ECCENTRICITY);
    addElementWithAttribute(context, doc, orbitEl, true, "LongitudeOfAscendingNode", "Degrees", source.OM_LONGITUDE_ASCENDING_NODE_DEG);
    addElementWithAttribute(context, doc, orbitEl, true, "ArgumentOfPeriapsis", "Degrees", source.W_ARG_PERIAPSIS_DEG);
    addElementWithAttribute(context, doc, orbitEl, true, "MeanAnomalyAtEpoch", "Degrees", source.MA_MEAN_ANOMALY_DEG);
  }

  addElementWithAttribute(context, doc, el, true, "MeanRadius", "Km", source.MEAN_RADIUS_KM);
  addElementWithAttribute(context, doc, el, true, "RotationPeriod", "Seconds", source.PERIOD_SEC);
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
    addElementWithAttribute(context, doc, el, true, "RetrogradeRotation", "Value", "true");
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

export function createCelestialRootElement(doc: Document, type: BodyType, id: string, parent: string | undefined | null): Element {
  const el = doc.createElement(type);

  el.setAttribute("Id", id);
  if (parent) {
    el.setAttribute("Parent", parent);
  }

  return el;
}
