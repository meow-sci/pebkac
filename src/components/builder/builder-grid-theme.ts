import { themeQuartz } from 'ag-grid-community';

export const builderGridTheme = themeQuartz
  .withParams({
    accentColor: "#FCFF00",
    backgroundColor: "#1a1a1a",
    borderColor: "var(--green-50)",
    borderRadius: 0,
    browserColorScheme: "dark",
    cellHorizontalPaddingScale: 0.8,
    cellTextColor: "#00FF00",
    columnBorder: false,
    fontFamily: {
      googleFont: "Inter Variable"
    },
    fontSize: 13,
    foregroundColor: "#00FF00",

    headerBackgroundColor: "var(--selection-bg-color)",
    headerFontSize: 14,
    headerFontWeight: 600,
    headerRowBorder: true,
    headerTextColor: "var(--bg-color)",
    headerVerticalPaddingScale: 1.2,
    headerHeight: 33,

    oddRowBackgroundColor: "#1c1c1c",
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
