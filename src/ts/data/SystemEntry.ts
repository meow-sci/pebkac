import type { CelestialType } from "./CelestialType";

export interface SystemEntry {
  ID: string;
  PARENT: string;
  PARENT_IAU: string;
  ID_IAU: string;
  EPOCH: string;
  A_SEMI_MAJOR_AXIS_KM: string;
  EC_ECCENTRICITY: string;
  W_ARG_PERIAPSIS_DEG: string;
  MA_MEAN_ANOMALY_DEG: string;
  IN_INCLINATION_DEG: string;
  OM_LONGITUDE_ASCENDING_NODE_DEG: string;
  PR_SIDEREAL_ORBIT_PERIOD_SEC: string;
  AXIAL_TILT_DEG: string;
  MEAN_RADIUS_KM: string;
  "GM_KM3/S2": string;
  PERIOD_SEC: string;
  RETROGRADE_ROT: string;
  MODEL_TYPE: CelestialType;
}
