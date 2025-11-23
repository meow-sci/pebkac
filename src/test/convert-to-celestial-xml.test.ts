import { describe, expect, test } from 'vitest'
import { XMLSerializer } from '@xmldom/xmldom'

import type { SystemEntry } from '../ts/data/SystemEntry';

import systemEntriesJson from "../../public/data/earth_system_data.json";
import { calculateMassKgFromGm, transformSystemEntryToKsaXml } from '../ts/transform/transformSystemEntryToKsaXml';
import type { GeneratorConfig } from '../ts/data/GeneratorConfig';

const systemEntries = systemEntriesJson as unknown as SystemEntry[];

const config: GeneratorConfig = {
  gravitational_constant: 6.6743e-20 // km^3/kg/s^2
};


describe('earth system', () => {

  function assertXmlMatchesEntry(config: GeneratorConfig, entry: SystemEntry) {
    const el = transformSystemEntryToKsaXml(config, entry);
    const serializer = new XMLSerializer();
    const xml = serializer.serializeToString(el);

    // Root element type and attributes
    expect(xml).toContain(`<${entry.MODEL_TYPE} Id="${entry.ID}" Parent="${entry.PARENT}">`);

    // Generic checks — only assert if the source value is present
    const checks: { tag: string; attr: string; value?: string }[] = [
      { tag: 'Inclination', attr: 'Degrees', value: entry.IN_INCLINATION_DEG },
      { tag: 'Eccentricity', attr: 'Value', value: entry.EC_ECCENTRICITY },
      { tag: 'LongitudeOfAscendingNode', attr: 'Degrees', value: entry.OM_LONGITUDE_ASCENDING_NODE_DEG },
      { tag: 'ArgumentOfPeriapsis', attr: 'Degrees', value: entry.W_ARG_PERIAPSIS_DEG },
      { tag: 'MeanAnomalyAtEpoch', attr: 'Degrees', value: entry.MA_MEAN_ANOMALY_DEG },
      { tag: 'MeanRadius', attr: 'Km', value: entry.MEAN_RADIUS_KM },
      { tag: 'Period', attr: 'Seconds', value: entry.PERIOD_SEC },
      { tag: 'AxialTilt', attr: 'Degrees', value: entry.AXIAL_TILT_DEG }
    ];

    checks.forEach(c => {
      if (c.value !== undefined && c.value !== null && String(c.value).trim() !== '') {
        const expected = `<${c.tag} ${c.attr}="${c.value}"/>`;
        expect(xml).toContain(expected);
      }
    });

    // Mass: compute from GM and gravitational constant, if present
    const gmStr = (entry as any)["GM_KM3/S2"];
    if (typeof gmStr === 'string' && gmStr.trim() !== '') {
      const massStr = calculateMassKgFromGm(gmStr, config);
      expect(xml).toContain(`<Mass Kg="${massStr}"/>`);
    }

    // TidallyLocked — present only if PERIOD_SEC equals zero
    const periodSeconds = Number(entry.PERIOD_SEC);
    if (!isNaN(periodSeconds) && periodSeconds === 0) {
      expect(xml).toContain('<TidallyLocked Value="true"/>');
    } else {
      expect(xml).not.toContain('<TidallyLocked Value="true"/>');
    }

    // Retrograde — case-insensitive flag check
    const retroStr = entry.RETROGRADE_ROT;
    if (typeof retroStr === 'string' && retroStr.trim().toLowerCase() === 'true') {
      expect(xml).toContain('<Retrograde Value="true"/>');
    } else {
      expect(xml).not.toContain('<Retrograde Value="true"/>');
    }
  }

  // generate one test per SystemEntry
  systemEntries.forEach(entry => {
    test(`${entry.ID}`, () => {
      assertXmlMatchesEntry(config, entry);
    });
  });

});
