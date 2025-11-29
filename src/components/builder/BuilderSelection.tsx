import { useStore } from "@nanostores/react"
import { useEffect, useRef, useState } from "react"
import { $selectedSystemEntries, $systemSettings } from "../../state/builder-state"

export function BuilderSelection() {

  const selected = useSelectionCount();
  const crafts = useCraftCount();
  const kittenauts = useKittenautCount();

  return (
    <section id="builder-selection">
      <span className="label"><u>selection info</u></span>
      <section className="counts">
        <Count label="Selected Kittenauts" value={kittenauts} />
        <Count label="Selected Celestials" value={selected} />
        <Count label="Selected Crafts" value={crafts} />
      </section>
    </section>
  )
}

function Count({ label, value }: { label: string; value: string }) {
  const [animate, setAnimate] = useState(false)
  const prevValueRef = useRef<string | null>(null)

  useEffect(() => {
    // On mount we don't want the initial render to animate
    if (prevValueRef.current === null) {
      prevValueRef.current = value
      return
    }

    if (prevValueRef.current !== value) {
      setAnimate(true)
      // Remove the class after the animation finishes so re-adding will re-trigger it later
      const timer = setTimeout(() => setAnimate(false), 200)
      prevValueRef.current = value
      return () => clearTimeout(timer)
    }
  }, [value])

  return (
    <>
      <span className={`count-data ${animate ? "pop" : ""}`}>{value}</span>
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

  if (settings.addGemini7Reference) count++;
  if (settings.addRocketReference) count++;

  return count.toLocaleString();;

}