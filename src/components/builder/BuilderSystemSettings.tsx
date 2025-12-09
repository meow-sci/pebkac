import { Checkbox, Input, Label, TextField } from "react-aria-components";
import { useStore } from "@nanostores/react";

import { checkbox } from "../rac/checkbox";
import { $systemSettings } from "../../state/builder-state";



export function BuilderSystemSettings() {

  const settings = useStore($systemSettings);

  return (
    <section className="settings">

      <TextField aria-label="system name" onChange={onSystemNameChange} value={settings.systemId}>
        <Label style={{marginBottom: "0.5rem"}}>System ID</Label>
        <Input style={{ maxWidth: "20rem" }} />
      </TextField>


      <Checkbox onChange={onChangeSol} isSelected={settings.addSolReference}>
        {checkbox}
        <span className="label">Add Sol</span>
      </Checkbox>

      <Checkbox onChange={onChangeForceEarth} isSelected={settings.forceEarthReference}>
        {checkbox}
        <span className="label">Force Earth Always</span>
      </Checkbox>

    </section>
  );

}

const onChangeSol = (selected: boolean) => $systemSettings.setKey("addSolReference", selected);
const onChangeForceEarth = (selected: boolean) => $systemSettings.setKey("forceEarthReference", selected);

function onSystemNameChange(value: string) {
  $systemSettings.setKey("systemId", value);
}