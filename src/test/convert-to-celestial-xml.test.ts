import { describe, expect, test } from 'vitest'
import { XMLSerializer } from '@xmldom/xmldom'

import type { SystemEntry } from '../ts/data/SystemEntry';

import earthSystemDataJson from "../../public/data/earth_system_data.json";
import { transformSystemEntryToKsaXml } from '../ts/transform/transformSystemEntryToKsaXml';
import type { GeneratorConfig } from '../ts/data/GeneratorConfig';

const earthSystemData = earthSystemDataJson as unknown as SystemEntry[];

const config: GeneratorConfig = {
  gravitational_constant: 6.6743e-20 // km^3/kg/s^2
};


describe('not in Core', () => {

  test('Thebe', () => {

    const el = transformSystemEntryToKsaXml(config, earthSystemData.find(e => e.ID === "Thebe")!);
    const serializer = new XMLSerializer();

    const xml = serializer.serializeToString(el);

    expect(xml).toContain('<TerrestrialBody Id="Thebe" Parent="Jupiter">');
    expect(xml).toContain('<Inclination Degrees="1.1"/>');
    expect(xml).toContain('<Eccentricity Value="0.018"/>');
    expect(xml).toContain('<LongitudeOfAscendingNode Degrees="340.4"/>');
    expect(xml).toContain('<ArgumentOfPeriapsis Degrees="26.6"/>');
    expect(xml).toContain('<MeanAnomalyAtEpoch Degrees="182.1"/>');
    expect(xml).toContain('<MeanRadius Km="49.3"/>');
    expect(xml).toContain('<Period Seconds="0"/>');
    expect(xml).toContain('<AxialTilt Degrees="0"/>');
    expect(xml).toContain('<Mass Kg="451732765982949500"/>');
    expect(xml).toContain('<TidallyLocked Value="true"/>');

  });

  test('Venus', () => {

    const el = transformSystemEntryToKsaXml(config, earthSystemData.find(e => e.ID === "Venus")!);
    const serializer = new XMLSerializer();

    const xml = serializer.serializeToString(el);
    console.log(xml);

    // Element header — model type AtmosphericBody expected for Venus
    expect(xml).toContain('<AtmosphericBody Id="Venus" Parent="Sol">');
    expect(xml).toContain('<Inclination Degrees="3.39458"/>');
    expect(xml).toContain('<Eccentricity Value="0.0068"/>');
    expect(xml).toContain('<LongitudeOfAscendingNode Degrees="76.68"/>');
    expect(xml).toContain('<ArgumentOfPeriapsis Degrees="54.891"/>');
    expect(xml).toContain('<MeanAnomalyAtEpoch Degrees="50.1"/>');
    expect(xml).toContain('<MeanRadius Km="6051.84"/>');
    expect(xml).toContain('<Period Seconds="20996755"/>');
    expect(xml).toContain('<AxialTilt Degrees="177.4"/>');
    expect(xml).not.toContain('<TidallyLocked Value="false"/>');
    expect(xml).not.toContain('<RetrogradeRotation Value="true"/>');
    expect(xml).toContain('<Mass Kg="4867305814842006000000000"/>');

  });

});
