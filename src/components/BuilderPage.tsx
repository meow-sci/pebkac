import { useCallback } from "react";
import { useStore } from "@nanostores/react";
import xpath from "xpath";
// import { XMLSerializer } from '@xmldom/xmldom'


import { BuilderGrid } from "./BuilderGrid";

import type { SystemEntry } from "../ts/data/SystemEntry";
import { $builderSelectedRows } from "../state/builder-state";
import { transformSystemEntryToKsaXml, transformSystemEntryToKsaXmlIntoElement } from "../ts/transform/transformSystemEntryToKsaXml";
import { createGeneratorContext } from "../ts/data/GeneratorContext";
import { selectCelestialsFromKsaXml } from "../ts/xml/selectCelestialsFromKsaXml";

import systemDataJson from "../data/earth_system_data.json";
import ksaAstronomicalsXml from "../data/mods/Core/Astronomicals.xml?raw";
import ksaSolSystemXml from "../data/mods/Core/SolSystem.xml?raw";
import type { ExtractedCelestials } from "../ts/data/ExtractedCelestials";
import { isElementNode } from "../ts/xml/isXmlNodeTypeGuards";

const systemData = systemDataJson as SystemEntry[];

const ksaAstronimcals = selectCelestialsFromKsaXml("Core/Astronomicals.xml", ksaAstronomicalsXml);
const ksaSolSystem = selectCelestialsFromKsaXml("Core/SolSystem.xml", ksaSolSystemXml);

function findExistingCelestialByIDFromAll(id: string): Element | null {
  return findExistingCelestialByID(ksaSolSystem, id) ?? findExistingCelestialByID(ksaAstronimcals, id);
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

function createSystemDocument(elements: Element[]): Document {

  // create an empty xml document
  const doc = new Document();

  const systemElement = doc.createElement("System");
  doc.appendChild(systemElement);
  systemElement.appendChild(doc.createTextNode("\n"));

  if (!isElementNode(systemElement)) {
    throw new Error("Failed to create System document");
  }

  for (const el of elements) {
    doc.importNode(el, true);
    systemElement.appendChild(el);
  }

  systemElement.appendChild(doc.createTextNode("\n"));

  return doc;
}

export function BuilderPage() {

  const selection = useStore($builderSelectedRows);

  const generateXML = useCallback(() => {

    if (selection.length === 0) {
      return;
    }

    const selectedIDs = selection.map(o => o.ID);

    const context = createGeneratorContext();

    const generatedElements: Element[] = [];

    // const elementsForSelection = selection.map(o => transformSystemEntryToKsaXml(context, o));

    for (let i = 0; i < selectedIDs.length; i++) {
      let id = selectedIDs[i];
      const data = selection[i];

      const existing = findExistingCelestialByIDFromAll(id);

      if (isElementNode(existing)) {
        transformSystemEntryToKsaXmlIntoElement(context, data, existing.ownerDocument, existing);
        generatedElements.push(existing);
      } else {
        const el = transformSystemEntryToKsaXml(context, data);
        generatedElements.push(el);
      }
    }


    const systemDoc = createSystemDocument(generatedElements);
    const serializer = new XMLSerializer();
    const xml = serializer.serializeToString(systemDoc);
    console.log(xml);



  }, [selection]);

  return (
    <>
      <div id="actions">
        <button onClick={generateXML}>Go XML!</button>
      </div>
      <div id="info">
        Num selected: {selection.length}
      </div>
      <div id="grid">
        <BuilderGrid data={systemData} />
      </div>
    </>

  )
}
