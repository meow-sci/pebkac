import { Checkbox } from "react-aria-components";
import { useStore } from "@nanostores/react";

import { checkbox } from "../rac/checkbox";
import { $systemSettings } from "../../state/builder-state";

export function BuilderSystemSettings() {

  const settings = useStore($systemSettings);

  return (
    <section className="settings">

      <Checkbox onChange={onChangeSol} isSelected={settings.addSolReference}>
        {checkbox}
        <span className="label">Add Sol</span>
      </Checkbox>

      <Checkbox onChange={onChangeForceEarth} isSelected={settings.forceEarthReference}>
        {checkbox}
        <span className="label">Force Earth Always</span>
      </Checkbox>

      <Checkbox onChange={onChangeHackMarsLunaCliffsDiffuse} isSelected={settings.hack_RemoveMarsLunaCliffsDiffuse}>
        {checkbox}
        <span className="label"><b>HACK:</b> Remove Mars LunaCliffsDiffuse references (bug when using from a mod 🥺)</span>
      </Checkbox>

    </section>
  );

}

const onChangeSol = (selected: boolean) => $systemSettings.setKey("addSolReference", selected);
const onChangeForceEarth = (selected: boolean) => $systemSettings.setKey("forceEarthReference", selected);
const onChangeHackMarsLunaCliffsDiffuse = (selected: boolean) => $systemSettings.setKey("hack_RemoveMarsLunaCliffsDiffuse", selected);
