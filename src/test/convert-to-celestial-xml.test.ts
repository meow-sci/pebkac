// import { XMLSerializer, DOMParser } from '@xmldom/xmldom'
// globalThis.DOMParser = DOMParser;
// globalThis.XMLSerializer = XMLSerializer;

// import { describe, test } from 'vitest'

// import type { SystemEntry } from '../ts/data/SystemEntry';

// import systemEntriesJson from "../../public/data/earth_system_data.json";
// import { createGeneratorContext } from '../ts/data/GeneratorContext';
// import { assertXmlMatchesEntry } from './util/xml-assertions';
// import { transformSystemEntryToKsaXml } from '../ts/transform/transformSystemEntryToKsaXml';

// const systemEntries = systemEntriesJson as unknown as SystemEntry[];

// const context = createGeneratorContext();

// describe('earth system data to xml', () => {

//   // generate one test per SystemEntry
//   systemEntries.forEach(entry => {
//     test(`${entry.ID}`, () => {

//       const el = transformSystemEntryToKsaXml(context, entry);
//       assertXmlMatchesEntry(context, entry, el);
      
//     });
//   });

// });
