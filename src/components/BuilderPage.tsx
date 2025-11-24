import { useCallback, useRef, useState } from "react";
import { useStore } from "@nanostores/react";


import { BuilderGrid } from "./BuilderGrid";

import type { SystemEntry } from "../ts/data/SystemEntry";
import { $builderSelectedRows, $gridApi } from "../state/builder-state";
import { transformSystemEntryToKsaXml, transformSystemEntryToKsaXmlIntoElement } from "../ts/transform/transformSystemEntryToKsaXml";
import { createGeneratorContext } from "../ts/data/GeneratorContext";
import { selectCelestialsFromKsaXml } from "../ts/xml/selectCelestialsFromKsaXml";

import systemDataJson from "../data/earth_system_data.json";
import ksaAstronomicalsXml from "../data/mods/Core/Astronomicals.xml?raw";
import ksaSolSystemXml from "../data/mods/Core/SolSystem.xml?raw";
import type { ExtractedCelestials } from "../ts/data/ExtractedCelestials";
import { isElementNode } from "../ts/xml/isXmlNodeTypeGuards";
import { serializeDocument } from "../ts/xml/serializeDocument";
import { collapseXmlDeadspace } from "../ts/xml/collapseXmlDeadspace";
import { prettifyDocument } from "../ts/xml/prettifyDocument";

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

export interface GenerateSystemData {
  systemId: string;
  addSolReference: boolean;
  celestials: Element[];
}

function createSystemXml(data: GenerateSystemData): string {
  const doc = createSystemDocument(data);
  collapseXmlDeadspace(doc);
  prettifyDocument(doc);
  return serializeDocument(doc);
}

function createSystemDocument(data: GenerateSystemData): Document {

  // create an empty xml document
  const doc = new Document();

  const systemElement = doc.createElement("System");
  systemElement.setAttribute("Id", data.systemId);

  if (data.addSolReference) {
    systemElement.appendChild(doc.createTextNode("\n    "));

    const loadFromLibraryElement = doc.createElement("LoadFromLibrary");
    loadFromLibraryElement.setAttribute("Id", "Sol");
    systemElement.appendChild(loadFromLibraryElement);
    systemElement.appendChild(doc.createTextNode("\n"));
  }

  doc.appendChild(systemElement);
  systemElement.appendChild(doc.createTextNode("\n"));

  if (!isElementNode(systemElement)) {
    throw new Error("Failed to create System document");
  }

  for (const el of data.celestials) {
    systemElement.appendChild(doc.createTextNode("\n"));
    doc.importNode(el, true);
    systemElement.appendChild(el);
  }

  systemElement.appendChild(doc.createTextNode("\n"));

  return doc;
}

export function BuilderPage() {

  const selection = useStore($builderSelectedRows);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [xmlOutput, setXmlOutput] = useState<string>("");
  const [quickfilter, setQuickfilter] = useState<string>("");

  const disableGoXml = selection.length === 0;

  const addVisibleToSelection = useCallback(() => {

    const gridApi = $gridApi.get();

    if (!gridApi) {
      return;
    }

    gridApi.forEachNodeAfterFilter(node => {
      node.setSelected(true);
    });

  }, []);

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


    const systemXml = createSystemXml({ addSolReference: true, systemId: "GeneratedSystem", celestials: generatedElements });

    setXmlOutput(systemXml);
    dialogRef.current?.showModal();

  }, [selection]);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(xmlOutput);
  }, [xmlOutput]);

  return (
    <>
      <div id="actions">
        <button onClick={addVisibleToSelection}>Add Currently visible to Selection</button>
        <button onClick={generateXML} disabled={disableGoXml}>Go XML!</button>
        <input id="quickfilter" placeholder="filter..." type="text" onChange={e => setQuickfilter(e.currentTarget.value)} />
      </div>
      <div id="info">
        Num selected: {selection.length}
      </div>
      <div id="grid">
        <BuilderGrid data={systemData} quickfilterText={quickfilter} />
      </div>
      <dialog
        ref={dialogRef}
        style={{
          width: '75vw',
          height: '75vh',
          padding: 0,
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', gap: '10px' }}>
            <button onClick={closeDialog}>Close</button>
            <button onClick={copyToClipboard}>Copy</button>
          </div>
          <pre style={{
            flex: 1,
            margin: 0,
            padding: '10px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {xmlOutput}
          </pre>
        </div>
      </dialog>
    </>

  )
}
