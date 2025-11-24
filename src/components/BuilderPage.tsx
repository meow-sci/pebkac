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
import { fixPathsToCore } from "../ts/xml/fixPathsToCore";

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

  addRocketReference: boolean;
  addGemini7Reference: boolean;
  addGemini6aReference: boolean;

  addHunterReference: boolean;
  addBanjoReference: boolean;
  addPolarisReference: boolean;

  celestials: Element[];
}

function createSystemXml(data: GenerateSystemData): string {
  const doc = createSystemDocument(data);
  fixPathsToCore(doc);
  collapseXmlDeadspace(doc);
  prettifyDocument(doc);
  return serializeDocument(doc);
}

function createSystemDocument(data: GenerateSystemData): Document {

  // create an empty xml document
  const doc = new Document();

  const systemElement = doc.createElement("System");
  systemElement.setAttribute("Id", data.systemId);

  const loadFromLibraryElement = doc.createElement("DisplayName");
  loadFromLibraryElement.setAttribute("Value", "GeneratedSystem");
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

  if (data.addSolReference) {
    addLoadFromLibrary("Sol");
  }

  if (data.addRocketReference) {
    addLoadFromLibrary("Rocket", "Earth");
  }

  if (data.addGemini7Reference) {
    addLoadFromLibrary("Gemini7", "Earth");
  }

  if (data.addGemini6aReference) {
    addLoadFromLibrary("Gemini6a", "Earth");
  }

  if (data.addHunterReference) {
    addLoadFromLibrary("Hunter", "Earth");
  }

  if (data.addBanjoReference) {
    addLoadFromLibrary("Banjo", "Earth");
  }

  if (data.addPolarisReference) {
    addLoadFromLibrary("Polaris", "Earth");
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

    // always ensure Earth is included
    if (!selectedIDs.includes("Earth")) {
      // const earth = findExistingCelestialByIDFromAll("Earth");
      selectedIDs.push("Earth");
      selection.push(systemData.find(s => s.ID === "Earth")!);
    }

    for (let i = 0; i < selectedIDs.length; i++) {
      let id = selectedIDs[i];
      const data = selection[i];

      const existing = findExistingCelestialByIDFromAll(id);

      try {
        if (isElementNode(existing)) {
          transformSystemEntryToKsaXmlIntoElement(context, data, existing.ownerDocument, existing);
          generatedElements.push(existing);
        } else {
          const el = transformSystemEntryToKsaXml(context, data);
          generatedElements.push(el);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const systemXml = createSystemXml({
      addRocketReference: true,
      addSolReference: true,
      addGemini6aReference: true,
      addGemini7Reference: true,
      addHunterReference: true,
      addBanjoReference: true,
      addPolarisReference: true,
      systemId: "GeneratedSystem",
      celestials: generatedElements,
    });

    setXmlOutput(systemXml);
    dialogRef.current?.showModal();

  }, [selection]);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(xmlOutput);
    alert("Copied to clipboard!");
  }, [xmlOutput]);

  return (
    <>
      <div id="actions">
        <a href="/pebkac/">Home</a>
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
            <button onClick={copyToClipboard}>Copy</button>
            <button onClick={closeDialog}>Close</button>
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
