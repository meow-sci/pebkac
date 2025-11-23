import { BuilderGrid } from "./BuilderGrid";

import systemDataJson from "../data/earth_system_data.json";
import type { SystemEntry } from "../ts/data/SystemEntry";
import { useStore } from "@nanostores/react";
import { $builderSelectedRows } from "../state/builder-state";
import { useCallback } from "react";
const systemData = systemDataJson as SystemEntry[];

export function BuilderPage() {

  const selection = useStore($builderSelectedRows);

  const generateXML = useCallback(() => {
    console.log("Generating XML for selection:", selection);
  }, [selection]);

  return (
    <>
      <div id="actions">
        <button onClick={generateXML}>Go XML!</button>
      </div>
      <div id="info">
        Num selected: {selection.length}
      </div>
      <div id="grid">
        <BuilderGrid data={systemData} />
      </div>
    </>

  )
}
