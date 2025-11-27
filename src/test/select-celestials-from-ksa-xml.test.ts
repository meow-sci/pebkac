// import { XMLSerializer, DOMParser } from '@xmldom/xmldom'

// import { describe, expect, test } from 'vitest';

// import { selectCelestialsFromKsaXml } from '../ts/xml/selectCelestialsFromKsaXml';

// import SolSystemXml from "../../public/data/mods/Core/SolSystem.xml?raw";
// import AstronomicalsXml from "../../public/data/mods/Core/Astronomicals.xml?raw";

// describe('selectCelestialsFromKsaXml', () => {

//   test('SolSystem.xml: discovers expected number of celestial types', () => {
//     const result = selectCelestialsFromKsaXml(DOMParser, "Core/SolSystem.xml", SolSystemXml);

//     // SolSystem.xml contains no StellarBody elements in this file
//     expect(result.stellarBodies.length).toBe(0);

//     // Terrestrial bodies explicitly defined in SolSystem.xml (counted manually)
//     expect(result.terrestrialBodies.length).toBe(37);

//     // Atmospheric bodies explicitly defined in SolSystem.xml
//     expect(result.atmosphericBodies.length).toBe(7);

//     // No explicit <Comet> tags in SolSystem.xml (they are load-from-library)
//     expect(result.comets.length).toBe(0);

//     // allBodies should be the sum of the above lists
//     expect(result.allBodies.length).toBe(
//       result.stellarBodies.length
//       + result.terrestrialBodies.length
//       + result.atmosphericBodies.length
//       + result.comets.length
//     );
//   });

//   test('Astronomicals.xml: discovers expected number of celestial types', () => {
//     const result = selectCelestialsFromKsaXml("Core/Astronimcals.xml", AstronomicalsXml);

//     // Astronomicals defines the stellar body Sol
//     expect(result.stellarBodies.length).toBe(1);

//     // Luna defined in Astronomicals.xml
//     expect(result.terrestrialBodies.length).toBe(1);

//     // Earth defined as an AtmosphericBody in Astronomicals.xml
//     expect(result.atmosphericBodies.length).toBe(1);

//     // Known explicit <Comet> tags added to this file
//     expect(result.comets.length).toBe(6);

//     // Ensure allBodies is the sum
//     expect(result.allBodies.length).toBe(
//       result.stellarBodies.length
//       + result.terrestrialBodies.length
//       + result.atmosphericBodies.length
//       + result.comets.length
//     );
//   });

// });
