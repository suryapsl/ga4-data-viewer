import fs from 'fs';
import path from 'path';
import { processData } from './utils/dataProcessor.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('__filename', __filename);
console.log('__dirname', __dirname);

// Main function to read JSONL and process it
const convertJSONLToJSON = async inputFile => {
  // Read the file
  const fileContent = await fs.promises.readFile(inputFile, 'utf8');

  // Split by lines and parse each line as JSON
  const lines = fileContent.trim().split('\n');
  const jsonRecords = lines.map(line => JSON.parse(line));

  console.log(`Total records read: ${jsonRecords.length}`);

  return jsonRecords;
};

const convertTopViewByCategoryJSONL = async () => {
  try {
    const inputFile = ''; // paste the jsonl (also know as Newline-Delimited JSON) file path
    const jsonRecords = await convertJSONLToJSON(inputFile);
    // Filter records by device_category
    const desktopRecords = jsonRecords.filter(
      record => record.device_category === 'desktop'
    );
    const mobileRecords = jsonRecords.filter(
      record => record.device_category === 'mobile'
    );

    console.log(`Desktop records: ${desktopRecords.length}`);
    console.log(`Mobile records: ${mobileRecords.length}`);

    // Process data for each device category
    const processedDesktopData = processData(desktopRecords);
    const processedMobileData = processData(mobileRecords);

    // Write the processed data to output files
    await fs.promises.writeFile(
      path.join(__dirname, 'topViewAll1000Desktop.json'),
      JSON.stringify(processedDesktopData, null, 2)
    );

    await fs.promises.writeFile(
      path.join(__dirname, 'topViewAll1000Mobile.json'),
      JSON.stringify(processedMobileData, null, 2)
    );

    console.log('Processing complete! Files created:');
    console.log('- topViewAll1000Desktop.json');
    console.log('- topViewAll1000Mobile.json');
  } catch (error) {
    console.error('Error processing JSONL file:', error);
  }
};

const convertTopViewAllJSONL = async () => {
  try {
    const inputFile ='';
    const jsonRecords = await convertJSONLToJSON(inputFile);
    console.log(`All records: ${jsonRecords.length}`);
    const processedJSONData = processData(jsonRecords);
    console.log(`processed json data `, Object.keys(processedJSONData).length);
    await fs.promises.writeFile(
      path.join(__dirname, 'top100ViewAll-8To13April25.json'),
      JSON.stringify(processedJSONData, null, 2)
    );
  } catch (error) {
    console.error('Error processing JSONL file:', error);
  }
};

// Execute the convert function
// convertTopViewByCategoryJSONL()
// convertTopViewAllJSONL();
