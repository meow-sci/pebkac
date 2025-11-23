import { parse } from '@fast-csv/parse';
import { readFile, writeFile, copyFile, cp, mkdir } from "node:fs/promises";
import path from "node:path";

// earth system csv
const inputCsvFilePath = path.resolve(import.meta.dirname, '../data/earth_system_2025-11-22.csv');
const outputCsvFilePath1 = path.resolve(import.meta.dirname, '../public/data/earth_system_data.csv');
const outputJsonFilePath1 = path.resolve(import.meta.dirname, '../public/data/earth_system_data.json');
const outputCsvFilePath2 = path.resolve(import.meta.dirname, '../src/data/earth_system_data.csv');
const outputJsonFilePath2 = path.resolve(import.meta.dirname, '../src/data/earth_system_data.json');

// Core mode files
const coreModSourceDir = path.resolve(import.meta.dirname, '../data/Core_v2025.11.8.2847');
const coreModDestDir1 = path.resolve(import.meta.dirname, '../public/data/mods/Core');
const coreModDestDir2 = path.resolve(import.meta.dirname, '../src/data/mods/Core');


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

  await mkdir(path.dirname(outputJsonFilePath1), { recursive: true });
  await mkdir(path.dirname(outputJsonFilePath2), { recursive: true });

  await writeFile(outputJsonFilePath1, JSON.stringify(rows, null, 2), 'utf8');
  await writeFile(outputJsonFilePath2, JSON.stringify(rows, null, 2), 'utf8');

  console.log(`Wrote JSON data to file ${outputJsonFilePath1}`);
  console.log(`Wrote JSON data to file ${outputJsonFilePath2}`);

  await copyFile(inputCsvFilePath, outputCsvFilePath1);
  await copyFile(inputCsvFilePath, outputCsvFilePath2);

  console.log(`Copied CSV data to file ${outputCsvFilePath1}`);
  console.log(`Copied CSV data to file ${outputCsvFilePath2}`);

}

async function copyCoreModFiles() {

  await mkdir(coreModDestDir1, { recursive: true });
  await mkdir(coreModDestDir2, { recursive: true });
  await cp(coreModSourceDir, coreModDestDir1, { recursive: true });
  await cp(coreModSourceDir, coreModDestDir2, { recursive: true });

  console.log(`Copied Core mod files from ${coreModSourceDir} to ${coreModDestDir1}`);
  console.log(`Copied Core mod files from ${coreModSourceDir} to ${coreModDestDir2}`);

}

async function main() {

  await preProcessEarthSystemCsv();
  await copyCoreModFiles();

}

main();

