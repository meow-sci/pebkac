import type { ExtractedCelestials } from "../data/ExtractedCelestials";
import { createGeneratorContext } from "../data/GeneratorContext";
import type { SystemEntry } from "../data/SystemEntry";
import type { SystemSettings } from "../data/SystemSettings";
import { transformSystemEntryToKsaXml, transformSystemEntryToKsaXmlIntoElement } from "../transform/transformSystemEntryToKsaXml";
import { fixPathsToCore } from "../xml/fixPathsToCore";
import { hack_fixMars } from "../xml/hack_fixMars";
import { isElementNode } from "../xml/isXmlNodeTypeGuards";
import { prettifyDocument } from "../xml/prettifyDocument";
import { serializeDocument } from "../xml/serializeDocument";

export interface GenerateSystemXmlConfig extends SystemSettings {

  /** parsed XML Element for Celestial types from KSA Core mod data */
  ksaGameCelestialData: ExtractedCelestials[];

  /** all celestials parsed from CSV */
  allCelestials: SystemEntry[];

  /** selected selection from parsed CSV data */
  selectedCelestials: SystemEntry[];
}

export function generateSystemXml(config: GenerateSystemXmlConfig): string {

  const workingSetOfCelestials = [...config.selectedCelestials];

  // commonly used since crafts default to orbiting Earth
  if (config.forceEarthReference) {
    if (workingSetOfCelestials.some(o => o.ID === "Earth") === false) {
      const earth = config.allCelestials.find(o => o.ID === "Earth");
      if (earth) {
        workingSetOfCelestials.push(earth);
      }
    }
  }

  const context = createGeneratorContext();
  const generatedElements: Element[] = [];

  for (const celestial of workingSetOfCelestials) {
    let id = celestial.ID;

    const existing = findExistingCelestialByIDFromAll(config, id);

    try {
      if (isElementNode(existing)) {
        transformSystemEntryToKsaXmlIntoElement(context, celestial, existing.ownerDocument, existing);
        generatedElements.push(existing);
      } else {
        const el = transformSystemEntryToKsaXml(context, celestial);
        generatedElements.push(el);
      }
    } catch (e) {
      console.error(e);
    }
  }


  const doc = createSystemDocument(config, generatedElements);
  
  if (config.hack_RemoveMarsLunaCliffsDiffuse) {
    hack_fixMars(doc);
  }

  fixPathsToCore(doc);
  prettifyDocument(doc);
  return serializeDocument(doc);
}

function findExistingCelestialByIDFromAll(config: GenerateSystemXmlConfig, id: string): Element | null {
  for (const corpus of config.ksaGameCelestialData) {
    const found = findExistingCelestialByID(corpus, id);
    if (found) {
      return found;
    }
  }
  return null;
}

function findExistingCelestialByID(corpus: ExtractedCelestials, id: string): Element | null {

  for (const body of corpus.allBodies) {
    const bodyID = body.getAttribute("Id");
    if (bodyID === id) {
      return body;
    }
  }

  return null;
}


function createSystemDocument(config: GenerateSystemXmlConfig, celestials: Element[]): Document {

  // create an empty xml document
  const doc = new Document();

  const systemElement = doc.createElement("System");
  systemElement.setAttribute("Id", config.systemId);

  const loadFromLibraryElement = doc.createElement("DisplayName");
  loadFromLibraryElement.setAttribute("Value", config.systemId);
  systemElement.appendChild(loadFromLibraryElement);

  function addLoadFromLibrary(id: string, parent?: string) {
    const loadFromLibraryElement = doc.createElement("LoadFromLibrary");
    loadFromLibraryElement.setAttribute("Id", id);
    if (parent) {
      loadFromLibraryElement.setAttribute("Parent", parent);
    }
    systemElement.appendChild(loadFromLibraryElement);
    systemElement.appendChild(doc.createTextNode("\n"));
  }

  if (config.addSolReference) {
    addLoadFromLibrary("Sol");
  }

  if (config.addRocketReference) {
    addLoadFromLibrary("Rocket", "Earth");
  }

  if (config.addGemini7Reference) {
    addLoadFromLibrary("Gemini7", "Earth");
  }

  if (config.addHunterReference) {
    addLoadFromLibrary("Hunter", "Earth");
  }

  if (config.addBanjoReference) {
    addLoadFromLibrary("Banjo", "Earth");
  }

  if (config.addPolarisReference) {
    addLoadFromLibrary("Polaris", "Earth");
  }

  doc.appendChild(systemElement);
  systemElement.appendChild(doc.createTextNode("\n"));

  if (!isElementNode(systemElement)) {
    throw new Error("Failed to create System document");
  }

  for (const el of celestials) {
    systemElement.appendChild(doc.createTextNode("\n"));
    doc.importNode(el, true);
    systemElement.appendChild(el);
  }

  systemElement.appendChild(doc.createTextNode("\n"));

  return doc;
}
