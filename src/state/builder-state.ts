import { atom } from "nanostores";
import { type SystemEntry } from "../ts/data/SystemEntry";

export const $builderSelectedRows = atom<SystemEntry[]>([]);
