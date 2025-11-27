import { useStore } from "@nanostores/react"
import { $selectedSystemEntries, $systemSettings } from "../../state/builder-state"

export function BuilderSelection() {

  const selected = useSelectionCount();
  const crafts = useCraftCount();
  const kittenauts = useKittenautCount();

  return (
    <section id="builder-selection">
      <span className="label"><u>selection info</u></span>
      <section className="counts">
        <Count label="Selected Celestials" value={selected} />
        <Count label="Selected Crafts" value={crafts} />
        <Count label="Selected Kittenauts" value={kittenauts} />
      </section>
    </section>
  )
}

function Count({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="count-data">{value}</span>
      <span className="count-text">{label}</span>
    </>
  )
}

function useSelectionCount(): string {
  const selected = useStore($selectedSystemEntries);
  return selected.length.toLocaleString();
}

function useKittenautCount() {
  const settings = useStore($systemSettings);

  let count = 0;

  if (settings.addBanjoReference) count++;
  if (settings.addHunterReference) count++;
  if (settings.addPolarisReference) count++;

  return count.toLocaleString();;

}

function useCraftCount() {
  const settings = useStore($systemSettings);

  let count = 0;

  if (settings.addGemini6aReference) count++;
  if (settings.addGemini7Reference) count++;
  if (settings.addRocketReference) count++;

  return count.toLocaleString();;

}