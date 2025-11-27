import { atom } from "nanostores";
import { type SystemEntry } from "../ts/data/SystemEntry";
import { type GridApi } from "ag-grid-community";

export const $builderSelectedRows = atom<SystemEntry[]>([]);
export const $gridApi = atom<GridApi | null>(null);