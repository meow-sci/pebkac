export interface SystemSettings {
  systemId: string;

  forceEarthReference: boolean;

  addSolReference: boolean;

  addRocketReference: boolean;
  addGemini7Reference: boolean;

  addHunterReference: boolean;
  addBanjoReference: boolean;
  addPolarisReference: boolean;

  // HACKS AND BUG MITIGATION

  hack_RemoveMarsLunaCliffsDiffuse: boolean;

}

