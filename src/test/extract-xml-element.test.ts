import { describe, expect, test } from 'vitest'
import { DOMParser, XMLSerializer } from '@xmldom/xmldom'
import xpath from "xpath";
import type { SystemEntry } from '../ts/data/SystemEntry';

import AstronomicalsXml from "../../data/Core/Astronomicals.xml?raw";
import SolSystemXml from "../../data/Core/SolSystem.xml?raw";
import systemEntriesJson from "../../public/data/earth_system_data.json";
import { transformSystemEntryToKsaXmlIntoElement } from '../ts/transform/transformSystemEntryToKsaXml';
import { createGeneratorContext, type GeneratorContext } from '../ts/data/GeneratorContext';
import { isElementNode } from '../ts/xml/isXmlNodeTypeGuards';

const systemEntries = systemEntriesJson as unknown as SystemEntry[];


const context = createGeneratorContext();

describe('earth system', () => {

  test('hi ', () => {

    const jupiterData = systemEntries.find(entry => entry.ID === "Jupiter")!;
    expect(jupiterData).toBeDefined();
    expect(jupiterData).not.toBeNull();

    const parser = new DOMParser();
    const doc = parser.parseFromString(SolSystemXml, "application/xml");
    var jupiterNode = xpath.select1('/System/AtmosphericBody[@Id="Jupiter"]', doc);

    expect(jupiterNode).toBeTypeOf("object");

    if (isElementNode(jupiterNode)) {

      const mangledData = { ...jupiterData, EC_ECCENTRICITY: "0.12345" } as SystemEntry;

      const newElement = transformSystemEntryToKsaXmlIntoElement(context, mangledData, doc, jupiterNode);

      const serializer = new XMLSerializer();
      const xml = serializer.serializeToString(jupiterNode);

      console.log("node", xml);

    }



    console.log("hi");
  });

});


