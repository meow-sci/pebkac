import { useStore } from "@nanostores/react";
import { Checkbox } from "react-aria-components";
import { $systemSettings } from "../../state/builder-state";
import { checkbox } from "../rac/checkbox";

export function BuilderCrafts() {

  const settings = useStore($systemSettings);

  return (
    <section className="settings">

      <Checkbox onChange={onChangeHunter} isSelected={settings.addHunterReference}>
        {checkbox}
        <span className="label">Add Hunder</span>
      </Checkbox>

      <Checkbox onChange={onChangeBanjo} isSelected={settings.addBanjoReference}>
        {checkbox}
        <span className="label">Add Banjo</span>
      </Checkbox>

      <Checkbox onChange={onChangePolaris} isSelected={settings.addPolarisReference}>
        {checkbox}
        <span className="label">Add Polaris</span>
      </Checkbox>

      <Checkbox onChange={onChangeRocket} isSelected={settings.addRocketReference}>
        {checkbox}
        <span className="label">Add Rocket</span>
      </Checkbox>

      <Checkbox onChange={onChangeGemini7} isSelected={settings.addGemini7Reference}>
        {checkbox}
        <span className="label">Add Gemini7</span>
      </Checkbox>

      <Checkbox onChange={onChangeGemini6a} isSelected={settings.addGemini6aReference}>
        {checkbox}
        <span className="label">Add Gemini6a</span>
      </Checkbox>

    </section>
  )

}


const onChangeHunter = (selected: boolean) => $systemSettings.setKey("addHunterReference", selected);
const onChangeBanjo = (selected: boolean) => $systemSettings.setKey("addBanjoReference", selected);
const onChangePolaris = (selected: boolean) => $systemSettings.setKey("addPolarisReference", selected);
const onChangeRocket = (selected: boolean) => $systemSettings.setKey("addRocketReference", selected);
const onChangeGemini7 = (selected: boolean) => $systemSettings.setKey("addGemini7Reference", selected);
const onChangeGemini6a = (selected: boolean) => $systemSettings.setKey("addGemini6aReference", selected);