import { parse } from '@fast-csv/parse';
import { readFile, writeFile, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const inputCsvFilePath = path.resolve(import.meta.dirname, '../data/earth_system_2025-11-22.csv');
const outputCsvFilePath = path.resolve(import.meta.dirname, '../public/data/earth_system_data.csv');
const outputJsonFilePath = path.resolve(import.meta.dirname, '../public/data/earth_system_data.json');

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

async function main() {

  const csvData = await readFile(inputCsvFilePath, 'utf8');

  const rows = await parseCsv(csvData);

  console.log(`Parsed ${rows.length} rows from CSV file ${inputCsvFilePath}`);

  await mkdir(path.dirname(outputJsonFilePath), { recursive: true });

  await writeFile(outputJsonFilePath, JSON.stringify(rows), 'utf8');

  console.log(`Wrote JSON data to file ${outputJsonFilePath}`);

  await copyFile(inputCsvFilePath, outputCsvFilePath);

  console.log(`Copied CSV data to file ${outputCsvFilePath}`);

}

main();

