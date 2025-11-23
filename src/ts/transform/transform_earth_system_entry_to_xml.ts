import { DOMParser } from '@xmldom/xmldom';
import type { EarthSystemEntry } from "../data/EarthSystemEntry";
import type { GeneratorConfig } from '../data/GeneratorConfig';

/*
    <TerrestrialBody Id="Callisto" Parent="Jupiter">
        <SemiMajorAxis Km="1882700" />
        <Inclination Degrees="0.192" />
        <Eccentricity Value="0.0074" />
        <LongitudeOfAscendingNode Degrees="21.6" />
        <ArgumentOfPeriapsis Degrees="298.848" />
        <MeanAnomalyAtEpoch Degrees="21.6" />
        <MeanRadius Km="2410.3" />
        <Mass Zg="107.6" />
        <Period Days="16" Hours="16" Minutes="32" Seconds="10"/>
        <TidallyLocked Value="true" />
    </TerrestrialBody>
*/

export function transform_earth_system_entry_to_element(config: GeneratorConfig, source: EarthSystemEntry): Element {
  // create an XML document using available DOM APIs

  const parser = new DOMParser();
  // create an empty xml document
  const doc = parser.parseFromString("<root/>", "application/xml");

  const el = doc.createElement("TerrestrialBody");

  // set top-level attributes
  if (source.ID) el.setAttribute("Id", source.ID);
  if (source.PARENT) el.setAttribute("Parent", source.PARENT);

  function addSimple(name: string, attrName: string, value?: string) {
    if (value === undefined || value === null || value === "") return;
    const child = doc!.createElement(name);
    child.setAttribute(attrName, value);
    el.appendChild(child);
  }

  addSimple("SemiMajorAxis", "Km", source.A_SEMI_MAJOR_AXIS_KM);
  addSimple("Inclination", "Degrees", source.IN_INCLINATION_DEG);
  addSimple("Eccentricity", "Value", source.EC_ECCENTRICITY);
  addSimple("LongitudeOfAscendingNode", "Degrees", source.OM_LONGITUDE_ASCENDING_NODE_DEG);
  addSimple("ArgumentOfPeriapsis", "Degrees", source.W_ARG_PERIAPSIS_DEG);
  addSimple("MeanAnomalyAtEpoch", "Degrees", source.MA_MEAN_ANOMALY_DEG);
  addSimple("MeanRadius", "Km", source.MEAN_RADIUS_KM);

  // Mass: prefer GM if provided
  // (GM_KM3/S2) / (universe grav constant) = celestial mass in Kg

  if (isNotEmptyString(source["GM_KM3/S2"])) {
    const val = Number(source["GM_KM3/S2"]);
    const mass = val / config.gravitational_constant;
    addSimple("Mass", "Kg", String(mass));
  }

  // Period: convert seconds into Days/Hours/Minutes/Seconds
  const periodSecStr = source.PR_SIDEREAL_ORBIT_PERIOD_SEC || source.PERIOD_SEC;
  if (periodSecStr) {
    const secsNum = Number(periodSecStr);
    if (!Number.isNaN(secsNum)) {
      let rem = Math.max(0, Math.floor(secsNum));
      const days = Math.floor(rem / 86400);
      rem = rem % 86400;
      const hours = Math.floor(rem / 3600);
      rem = rem % 3600;
      const minutes = Math.floor(rem / 60);
      const seconds = rem % 60;

      const period = doc.createElement("Period");
      period.setAttribute("Days", String(days));
      period.setAttribute("Hours", String(hours));
      period.setAttribute("Minutes", String(minutes));
      period.setAttribute("Seconds", String(seconds));
      el.appendChild(period);
    }
  }

  // TidallyLocked: not present in source; infer from RETROGRADE_ROT? default false
  const tidally = doc.createElement("TidallyLocked");
  const tidallyVal = (source.RETROGRADE_ROT && String(source.RETROGRADE_ROT).toLowerCase() === "true") ? "false" : "false";
  tidally.setAttribute("Value", tidallyVal);
  el.appendChild(tidally);

  return el;

}

function isNotEmptyString(o: string | undefined | null): o is string {
  if (typeof o === "string" && o.trim() !== "") {
    return true;
  }
  return false;
}
