
import { atom, computed, map, type ReadableAtom } from "nanostores";
import { logger } from "@nanostores/logger";

import { type SystemEntry } from "../ts/data/SystemEntry";

import { type LogEntry } from "../ts/data/LogEntry";
import { parseCsvIntoSystemEntries } from "../ts/builder/parseCsvIntoSystemEntries";
import { type SystemSettings } from "../ts/data/SystemSettings";
import { type ExtractedCelestials } from "../ts/data/ExtractedCelestials";
import { selectCelestialsFromKsaXml } from "../ts/xml/selectCelestialsFromKsaXml";
import { generateSystemXml } from "../ts/builder/generateSystemXmlRedux";

// inital raw CSV data to start with
import systemDataCsv from "../data/earth_system_data.csv?raw";

// raw XML data from Core KSA mod.  this data needs to be updated when the KSA game data is updated
import ksaAstronomicalsXml from "../data/mods/Core/Astronomicals.xml?raw";
import ksaSolSystemXml from "../data/mods/Core/SolSystem.xml?raw";
import type { GridApi } from "ag-grid-community";

// app logs to be displayed to end-user
export const $logs = atom<LogEntry[]>([]);

export const $ksaCoreModCelestials = atom<ExtractedCelestials[]>([
  // Order matters! This data is searched by Id for existing game celestial data, first found wins
  selectCelestialsFromKsaXml("Core/SolSystem.xml", ksaSolSystemXml),
  selectCelestialsFromKsaXml("Core/Astronomicals.xml", ksaAstronomicalsXml),
]);

// raw CSV data from editor
export const $csvData = atom<string>(systemDataCsv);

// derived SystemEntry data from CSV, re-computes when CSV changes dynamically
export const $systemEntries = computed<SystemEntry[], typeof $csvData>(
  $csvData,
  (data) => {
    // TODO: check for parse errors, blank out data and log errors
    return parseCsvIntoSystemEntries(data);
  }
);

export const $systemSettings = map<SystemSettings>({
  systemId: "My System",
  forceEarthReference: true,
  addSolReference: true,
  addRocketReference: true,
  addGemini7Reference: true,
  addGemini6aReference: true,
  addHunterReference: true,
  addBanjoReference: true,
  addPolarisReference: true,
  hack_RemoveMarsLunaCliffsDiffuse: true,
});


export const $systemEntryGridApi = atom<GridApi | null>(null);

// quickfilter for the system entry grid filtering
export const $gridQuickfilter = atom<string>("");

export const $selectedSystemEntries = atom<SystemEntry[]>([]);

// generated XML from current state, updates dynamically when any of these things change:
//   - system settings
//   - all system entries
//   - selected system entries
export const $generatedSystemXml: ReadableAtom<string> = computed(
  [$systemSettings, $systemEntries, $selectedSystemEntries, $ksaCoreModCelestials],
  (settings, allCelestials, selectedCelestials, ksaGameCelestialData) => {
    // generate XML from current system entries
    return generateSystemXml({
      ...settings,
      ksaGameCelestialData,
      allCelestials,
      selectedCelestials,
    });
  }
);



// debug logging

export function setupNanostoresLogger() {
  logger({
    '$csvData': $csvData,
    '$systemEntries': $systemEntries
  });
}

setupNanostoresLogger();
