import { inferSchema, initParser } from 'udsv';

import { logger } from './logger';
import type { SystemEntry } from '../data/SystemEntry';

// TODO: FIXME: add a zod validator for the parsed data
export function parseCsvIntoSystemEntries(csvData: string): SystemEntry[] {
  const rows = parseCsv(csvData);
  logger.info(`Parsed ${rows.length} rows from CSV`);
  return rows as SystemEntry[];
}

function parseCsv(csv: string): {}[] {

  let schema = inferSchema(csv);
  let parser = initParser(schema);

  let objects = parser.stringObjs(csv); // [ ['1','2','3'], ['4','5','6'] ]
  return objects;

}