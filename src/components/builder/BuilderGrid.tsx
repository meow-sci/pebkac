import { AllCommunityModule, ModuleRegistry, type ColDef, type GetRowIdParams, type GridReadyEvent, type IRowNode, type RowClickedEvent, type SelectionChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { useLayoutEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { Button, Input, TextField } from 'react-aria-components';

import type { SystemEntry } from '../../ts/data/SystemEntry';
import { $gridQuickfilter, $selectedSystemEntries, $systemEntries, $systemEntryGridApi } from '../../state/builder-state';
import { builderGridTheme } from './builder-grid-theme';
import { CircleMinus, CirclePlus, Flame } from 'lucide-react';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


export function BuilderGrid() {

  const data = useStore($systemEntries);
  const quickfilter = useStore($gridQuickfilter);
  const selected = useStore($selectedSystemEntries);

  const rowData = useMemo<RowData[]>(() => data.map(toRowData), [data]);

  // whenever selected changes from global state, update the grid selection
  useLayoutEffect(() => updateGridSelection(selected), [selected]);

  return (
    <section id="builder-grid-section">
      <section className="actions">

        <TextField aria-label="quick filter" onChange={onQuickfilterChange} value={quickfilter}>
          <Input placeholder='filter...' />
        </TextField>

        <Button onClick={addFiltered}><CirclePlus strokeWidth={1} size={20} /> add filtered</Button>

        <Button onClick={removeFiltered}><CircleMinus strokeWidth={1} size={20} />remove filtered</Button>

        <Button onClick={clearSelection}><Flame strokeWidth={1} size={20} />clear selection</Button>

      </section>
      <AgGridReact<SystemEntry>
        autoSizeStrategy={{ type: "fitCellContents", skipHeader: false }}
        quickFilterText={quickfilter}
        rowSelection={{ mode: "multiRow" }}
        cellSelection={false}
        theme={builderGridTheme}
        rowData={rowData}
        getRowId={getRowId}
        columnDefs={COLUMNS}
        suppressCellFocus
        onSelectionChanged={onSelectionChanged}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
      />
    </section>

  )
}

function getRowId(row: GetRowIdParams<SystemEntry, any>): string {
  return row.data.ID;
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
  { ...COL_DEFAULTS, field: "RETROGRADE_ROT", headerName: "Retrograde Roation" },
  { ...COL_DEFAULTS, field: "GROUP", headerName: "Orbital Group" },
];

function onSelectionChanged(event: SelectionChangedEvent<any, any>) {
  const selection = event.api.getSelectedRows().map(o => o);
  $selectedSystemEntries.set(selection);
}

function toRowData(data: SystemEntry): RowData {
  return data;
}

function updateGridSelection(selected: SystemEntry[]) {

  const api = $systemEntryGridApi.get()!;

  if (!api) {
    return;
  }

  if (selected.length > 0) {

    // pre-select existing selections using a bulk operation, else XML will generate per node selection (thats bad 💀)
    const selectedIds = new Set(selected.map(o => o.ID));

    const nodesToBeSelected: IRowNode<any>[] = [];
    const nodesToBeDeselected: IRowNode<any>[] = [];

    api.forEachNode(node => {
      if (selectedIds.has(node.data.ID)) {
        nodesToBeSelected.push(node);
      } else if (node.isSelected()) {
        nodesToBeDeselected.push(node);
      }
    });

    if (nodesToBeSelected.length > 0) {
      api.setNodesSelected({ nodes: nodesToBeSelected, newValue: true, source: "api" });
      api.setNodesSelected({ nodes: nodesToBeDeselected, newValue: false, source: "api" });
    }

  } else {
    api.deselectAll();
  }

}

function onGridReady(event: GridReadyEvent<any, any>) {
  $systemEntryGridApi.set(event.api);

  if ($selectedSystemEntries.get().length > 0) {

    // pre-select existing selections using a bulk operation, else XML will generate per node selection (thats bad 💀)
    const selectedIds = new Set($selectedSystemEntries.get().map(o => o.ID));

    const nodesToSelectByDefault: IRowNode<any>[] = [];
    event.api.forEachNode(node => {
      if (selectedIds.has(node.data.ID)) {
        nodesToSelectByDefault.push(node);
      }
    });

    if (nodesToSelectByDefault.length > 0) {
      event.api.setNodesSelected({ nodes: nodesToSelectByDefault, newValue: true, source: "api" });
    }
  }
};


function addFiltered() {

  const entries = $selectedSystemEntries.get();

  $systemEntryGridApi.get()?.forEachNodeAfterFilter(node => {

    if (!entries.includes(node.data)) {
      $selectedSystemEntries.set([...$selectedSystemEntries.get(), node.data]);
    }

  });
};


function removeFiltered() {


  let itemsToRemove: SystemEntry[] = [];

  $systemEntryGridApi.get()?.forEachNodeAfterFilter(node => {
    itemsToRemove.push(node.data);
  });

  const workingSet = [...$selectedSystemEntries.get()];

  for (const item of itemsToRemove) {
    if (workingSet.includes(item)) {
      workingSet.splice(workingSet.indexOf(item), 1);
    }
  };

  $selectedSystemEntries.set(workingSet);
};

function clearSelection() {
  $selectedSystemEntries.set([]);
};


function onQuickfilterChange(value: string) {
  $gridQuickfilter.set(value);
}

function onRowClicked(event: RowClickedEvent<SystemEntry, any>) {
  event.node.setSelected(!event.node.isSelected());
}
