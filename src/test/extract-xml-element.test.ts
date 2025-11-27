// import { XMLSerializer, DOMParser } from '@xmldom/xmldom'
// globalThis.DOMParser = DOMParser;
// globalThis.XMLSerializer = XMLSerializer;

// import { describe, expect, test } from 'vitest'
// import xpath from "xpath";
// import type { SystemEntry } from '../ts/data/SystemEntry';

// import { transformSystemEntryToKsaXmlIntoElement } from '../ts/transform/transformSystemEntryToKsaXml';
// import { createGeneratorContext } from '../ts/data/GeneratorContext';
// import { isElementNode } from '../ts/xml/isXmlNodeTypeGuards';
// import { assertXmlMatchesEntry } from './util/xml-assertions';

// import SolSystemXml from "../data/mods/Core/SolSystem.xml?raw";
// import earthSystemCsv from "../data/earth_system_data.csv?raw";
// import { parseCsvIntoSystemEntries } from '../ts/builder/parseCsvIntoSystemEntries';



// const systemEntries = parseCsvIntoSystemEntries(earthSystemCsv);


// const context = createGeneratorContext();

// describe('earth system', () => {

//   test('update existing jupiter', () => {

//     const jupiterData = systemEntries.find(entry => entry.ID === "Jupiter")!;
//     expect(jupiterData).toBeDefined();
//     expect(jupiterData).not.toBeNull();

//     const parser = new DOMParser();
//     const doc = parser.parseFromString(SolSystemXml, "application/xml");
//     var jupiterNode = xpath.select1('/System/AtmosphericBody[@Id="Jupiter"]', doc);

//     expect(jupiterNode).toBeTypeOf("object");

//     if (isElementNode(jupiterNode)) {

//       const mangledData = { ...jupiterData, EC_ECCENTRICITY: "0.12345" } as SystemEntry;

//       transformSystemEntryToKsaXmlIntoElement(context, mangledData, doc, jupiterNode);

//       assertXmlMatchesEntry(context, mangledData, jupiterNode);

//       expect(context.infoLogs).toContain('Removing existing element <Mass Jupiters="1"> in parent <AtmosphericBody Id="Jupiter" Parent="Sol">');
//       expect(context.infoLogs).toContain('Added element <Mass Kg="1898124625803455200000000000"> to parent <AtmosphericBody Id="Jupiter" Parent="Sol">');

//       // assert existing XML elements remain
//       expect(isElementNode(xpath.select1("Atmosphere", jupiterNode))).toBeTruthy();
//       expect(isElementNode(xpath.select1("Clouds", jupiterNode))).toBeTruthy();
//       expect(isElementNode(xpath.select1("Color", jupiterNode))).toBeTruthy();

//     }

//   });

// });


