import { AllCommunityModule, ModuleRegistry, type ColDef, type GridReadyEvent, type SelectionChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { useMemo } from 'react';
import { useStore } from '@nanostores/react';

import type { SystemEntry } from '../../ts/data/SystemEntry';
import { $gridQuickfilter, $selectedSystemEntries, $systemEntries, $systemEntryGridApi } from '../../state/builder-state';
import { builderGridTheme } from './builder-grid-theme';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


export function BuilderGrid() {

  const data = useStore($systemEntries);
  const quickfilter = useStore($gridQuickfilter);

  const rowData = useMemo<RowData[]>(() => data.map(toRowData), [data]);

  const onGridReady = (event: GridReadyEvent<any, any>) => {
    $systemEntryGridApi.set(event.api);
  };

  return (
    <AgGridReact
      autoSizeStrategy={{ type: "fitCellContents", skipHeader: false }}
      quickFilterText={quickfilter}
      rowSelection={{ mode: "multiRow" }}
      cellSelection={false}
      theme={builderGridTheme}
      rowData={rowData}
      columnDefs={COLUMNS}
      suppressCellFocus
      onSelectionChanged={onSelectionChanged}
      onGridReady={onGridReady}
    />

  )
}

interface RowData extends SystemEntry {

}

const COL_DEFAULTS: Partial<ColDef<SystemEntry>> = {
  sortable: true,
  filter: true,
  resizable: true,
}

const COLUMNS: ColDef<SystemEntry>[] = [
  { ...COL_DEFAULTS, field: "ID", headerName: "ID" },
  { ...COL_DEFAULTS, field: "PARENT", headerName: "Parent" },
  { ...COL_DEFAULTS, field: "GM_KM3/S2", headerName: "GM (km3/m2)" },
  { ...COL_DEFAULTS, field: "MEAN_RADIUS_KM", headerName: "Mean Radius (Km)" },
  { ...COL_DEFAULTS, field: "A_SEMI_MAJOR_AXIS_KM", headerName: "SemiMajor Axis (Km)" },
  { ...COL_DEFAULTS, field: "EC_ECCENTRICITY", headerName: "Eccentricity" },
  { ...COL_DEFAULTS, field: "PERIOD_SEC", headerName: "Sidereal Rotation (S)" },
  { ...COL_DEFAULTS, field: "GROUP", headerName: "Orbital Group" },
  { ...COL_DEFAULTS, field: "BODY_TYPE", headerName: "Body Type" },
];

function onSelectionChanged(event: SelectionChangedEvent<any, any>) {
  const selection = event.api.getSelectedRows().map(o => o);
  $selectedSystemEntries.set(selection);
}

function toRowData(data: SystemEntry): RowData {
  return data;
}
