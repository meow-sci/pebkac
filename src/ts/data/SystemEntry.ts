import type { BodyType } from "./CelestialType";

export interface SystemEntry {
  ID: string;
  ID_JPLREF: string;
  PARENT: string;
  PARENT_JPLREF: string;
  EPOCH: string;
  REF_FRAME: string;
  A_SEMI_MAJOR_AXIS_KM: string;
  EC_ECCENTRICITY: string;
  W_ARG_PERIAPSIS_DEG: string;
  TP_TIME_DAYS: string;
  MA_MEAN_ANOMALY_DEG: string;
  IN_INCLINATION_DEG: string;
  OM_LONGITUDE_ASCENDING_NODE_DEG: string;
  PR_SIDEREAL_ORBIT_PERIOD_SEC: string;
  TILT_OBLIQUITY_DEG: string;
  TILT_AZIMUTH_DEG: string;
  PARENT_ROT_LONG: string;
  MEAN_RADIUS_KM: string;
  "GM_KM3/S2": string;
  PERIOD_SEC: string;
  RETROGRADE_ROT: string;
  GROUP: string;
  BODY_TYPE: BodyType;
}