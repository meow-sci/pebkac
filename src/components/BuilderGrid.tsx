import { AllCommunityModule, ModuleRegistry, type ColDef, type SelectionChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { useMemo } from 'react';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { themeQuartz } from 'ag-grid-community';
import type { SystemEntry } from '../ts/data/SystemEntry';
import { $builderSelectedRows } from '../state/builder-state';

export interface BuilderGridProps {
  data: SystemEntry[];
}

interface RowData extends SystemEntry {

}

const COLUMNS: ColDef[] = [
  { field: "ID", headerName: "Id" },
];

export function BuilderGrid(props: BuilderGridProps) {

  const rowData = useMemo<RowData[]>(() => props.data.map(toRowData), [props.data]);

  const onSelectionChanged = (event: SelectionChangedEvent<any, any>) => {
    const selection = event.api.getSelectedRows().map(o => o);
    $builderSelectedRows.set(selection);
  }

  return (
    <AgGridReact
      rowSelection={{ mode: "multiRow" }}
      cellSelection={false}
      theme={myTheme}
      rowData={rowData}
      columnDefs={COLUMNS}
      suppressCellFocus
      onSelectionChanged={onSelectionChanged}
    />

  )
}

function toRowData(data: SystemEntry): RowData {
  return data;
}

const myTheme = themeQuartz
  .withParams({
    accentColor: "#FCFF00",
    backgroundColor: "#222222",
    borderColor: "#429356",
    borderRadius: 0,
    browserColorScheme: "dark",
    cellHorizontalPaddingScale: 0.8,
    cellTextColor: "#00FF00",
    columnBorder: false,
    fontFamily: {
      googleFont: "Inter Variable"
    },
    fontSize: 12,
    foregroundColor: "#00FF00",
    headerBackgroundColor: "#282828",
    headerFontSize: 14,
    headerFontWeight: 700,
    headerRowBorder: true,
    headerTextColor: "#00FF00",
    headerVerticalPaddingScale: 1.5,
    oddRowBackgroundColor: "#282828",
    rangeSelectionBackgroundColor: "#FFFF0020",
    rangeSelectionBorderColor: "yellow",
    rangeSelectionBorderStyle: "dashed",
    rowBorder: true,
    rowVerticalPaddingScale: 1.5,
    sidePanelBorder: true,
    spacing: 3,
    wrapperBorder: false,
    wrapperBorderRadius: 0
  });
