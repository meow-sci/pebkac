import { describe, expect, test } from 'vitest'
import { XMLSerializer } from '@xmldom/xmldom'

import type { EarthSystemEntry } from '../ts/data/EarthSystemEntry';

import earthSystemDataJson from "../../public/data/earth_system_data.json";
import { transform_earth_system_entry_to_element } from '../ts/transform/transform_earth_system_entry_to_xml';
import type { GeneratorConfig } from '../ts/data/GeneratorConfig';

const earthSystemData = earthSystemDataJson as unknown as EarthSystemEntry[];

const config: GeneratorConfig = {
  gravitational_constant: 6.6743e-20 // km^3/kg/s^2
};


describe('not in Core', () => {

  test('Thebe', () => {

    const el = transform_earth_system_entry_to_element(config, earthSystemData.find(e => e.ID === "Thebe")!);
    const serializer = new XMLSerializer();

    const xml = serializer.serializeToString(el);

    console.log(xml);

  })

});
