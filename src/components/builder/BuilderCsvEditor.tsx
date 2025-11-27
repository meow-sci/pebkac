import { useStore } from "@nanostores/react";
import { CsvEditor } from "../monaco/CsvEditor";
import { $csvData } from "../../state/builder-state";
import { useCallback, useMemo } from "react";

export function BuilderCsvEditor() {
  const csvData = useStore($csvData);

  const onChange = useCallback((o: string) => {
    $csvData.set(o);
  }, []);

  return useMemo(
    () => <CsvEditor defaultValue={csvData} onChange={onChange} />,
    [csvData]
  );
}