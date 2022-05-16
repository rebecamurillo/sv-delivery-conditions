import { readFileSync, writeFile, WriteFileOptions } from "fs";
const csv = require("csvtojson");

const DEFAULT_FILE_ENCODING = "utf8";
type MultCsvMergeToJsonOptions = {
  inputDir: string;
  inputKeys: Array<string>;
  inputFileNameList: Array<string>;
  outputDir: string;
  outputFileName: string;
  columnDelimiter: string;
  encoding?: WriteFileOptions;
};

function writeOutputFile(
  options: MultCsvMergeToJsonOptions,
  jsonObj: Array<Object>
) {
  const dataBuffer = Buffer.from(JSON.stringify(jsonObj));
  const destFile = `${options.outputDir}/${options.outputFileName}.json`;
  const encoding = options.encoding || DEFAULT_FILE_ENCODING;

  writeFile(destFile, dataBuffer, encoding, function (err) {
    if (err)
      return console.log(
        "multiple-csv-merge-to-json ERROR writing output file : ",
        err
      );
    console.log("multiple-csv-merge-to-json SUCCESS file written");
    console.log(
      "multiple-csv-merge-to-json SUCCESS lines written in file %s : %s",
      destFile,
      jsonObj.length
    );
  });
}

async function readExistingJsonDataArray(
  options: MultCsvMergeToJsonOptions
): Promise<Array<Object>> {
  try {
    const encoding = options.encoding || DEFAULT_FILE_ENCODING;

    const data = await readFileSync(
      `${options.outputDir}/${options.outputFileName}`,
      encoding
    );
    if (typeof data === "string") return JSON.parse(data) as Array<Object>;
  } catch (error) {
    console.log("multiple-csv-merge-to-json ERROR reading file : ", error);
  }
  return [];
}

async function generateArrayOfJSONfromCSV(
  options: MultCsvMergeToJsonOptions
): Promise<Array<Array<Object>>> {
  const filesNames: Array<string> = options.inputFileNameList;

  const filesToImport = filesNames.map(
    (fileName) => `${options.inputDir}/${fileName}`
  );

  return Promise.all(
    filesToImport.map(async (file) => {
      console.log("multiple-csv-merge-to-json importing file :", file);

      return csv({ delimiter: options.columnDelimiter }).fromFile(file);
    })
  );
}

function objectMatchesSearchKeys(dataObject: any, searchObject: any) {
  const objectKeys =
    process.env.DELIVERY_INPUT_FILES_UNIQUE_KEY?.split(",") || [];

  for (const key of objectKeys) {
    if (
      new String(dataObject[key])
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") !==
      new String(searchObject[key])
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    )
      return false;
  }

  return true;
}

function mergeObjects(existingObject: any, newObject: any): any {
  let updatedObject = { ...existingObject };
  for (const key in newObject) {
    updatedObject[key] = new String(newObject[key])
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  return updatedObject;
}

function updateData(
  existingData: Array<Object>,
  newData: Array<Object>
): Array<Object> {
  let updatedData = [...existingData];

  for (const data of newData) {
    const indexFound = existingData.findIndex((_existingData) =>
      objectMatchesSearchKeys(_existingData, data)
    );

    if (indexFound >= 0) {
      const mergedObject = mergeObjects(existingData[indexFound], data);
      if (mergedObject.updated) {
        updatedData[indexFound] = mergedObject;
      } else {
        existingData[indexFound] = {
          ...existingData[indexFound],
          updated: true,
        };
        updatedData.push(mergedObject);
      }
    } else {
      updatedData.push(data);
    }
  }

  return updatedData;
}

async function mergeCsvFilesToJsonArray(options: MultCsvMergeToJsonOptions) {
  const filesDataImported = await generateArrayOfJSONfromCSV(options);
  console.log(
    "multiple-csv-merge-to-json number of files to import : ",
    filesDataImported.length
  );
  let outputData = [{}];

  if (filesDataImported.length > 0) {
    console.log("multiple-csv-merge-to-json reading file at index 0");
    outputData = filesDataImported[0];
    console.log(
      "multiple-csv-merge-to-json lines in buffer END ",
      outputData.length
    );
    filesDataImported.slice(1).forEach((fileData, index) => {
      console.log(
        "multiple-csv-merge-to-json reading file at index %s",
        index + 1
      );
      outputData = updateData(outputData, fileData);
      console.log(
        "multiple-csv-merge-to-json lines in buffer END ",
        outputData.length
      );
    });
  }

  writeOutputFile(options, outputData);
}

async function getJsonArray(options: MultCsvMergeToJsonOptions) {
  return readExistingJsonDataArray(options);
}

mergeCsvFilesToJsonArray({
  inputDir: "./data_input_files",
  inputKeys: ["city", "region"],
  inputFileNameList: [
    "general_rates.csv",
    "premium_rates.csv",
    "danger_zones.csv",
  ],
  outputDir: "./data_output_json",
  outputFileName: "delivery_rates",
  columnDelimiter: ",",
});
export { MultCsvMergeToJsonOptions, mergeCsvFilesToJsonArray, getJsonArray };
