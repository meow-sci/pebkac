import { parse } from '@fast-csv/parse';
import { readFile, writeFile, copyFile, cp, mkdir } from "node:fs/promises";
import path from "node:path";

// earth system csv
const inputCsvFilePath = path.resolve(import.meta.dirname, '../data/earth_system_2025-11-22.csv');
const outputCsvFilePath = path.resolve(import.meta.dirname, '../public/data/earth_system_data.csv');
const outputJsonFilePath = path.resolve(import.meta.dirname, '../public/data/earth_system_data.json');

// Core mode files
const coreModSourceDir = path.resolve(import.meta.dirname, '../data/Core');
const coreModDestDir = path.resolve(import.meta.dirname, '../public/data/mods/Core');


function parseCsv(csv: string): Promise<object[]> {
  return new Promise((resolve, reject) => {

    const rows: object[] = [];

    const stream = parse({ headers: true })
      .on('error', e => reject(e))
      .on('data', o => rows.push(o))
      .on('end', () => resolve(rows));

    stream.write(csv);
    stream.end();


  });
}

async function preProcessEarthSystemCsv() {
  const csvData = await readFile(inputCsvFilePath, 'utf8');

  const rows = await parseCsv(csvData);

  console.log(`Parsed ${rows.length} rows from CSV file ${inputCsvFilePath}`);

  await mkdir(path.dirname(outputJsonFilePath), { recursive: true });

  await writeFile(outputJsonFilePath, JSON.stringify(rows, null, 2), 'utf8');

  console.log(`Wrote JSON data to file ${outputJsonFilePath}`);

  await copyFile(inputCsvFilePath, outputCsvFilePath);

  console.log(`Copied CSV data to file ${outputCsvFilePath}`);

}

async function copyCoreModFiles() {

  await mkdir(coreModDestDir, { recursive: true });
  await cp(coreModSourceDir, coreModDestDir, { recursive: true });

  console.log(`Copied Core mod files from ${coreModSourceDir} to ${coreModDestDir}`);

}

async function main() {

  await preProcessEarthSystemCsv();
  await copyCoreModFiles();

}

main();

