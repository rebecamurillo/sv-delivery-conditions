import "dotenv/config";
import { readFile, readFileSync, writeFile } from "fs";
const csv = require("csvtojson");

const FILE_ENCODING = "utf8";

console.log("process", process.env.NODE_ENV);
console.log("INPUT_FILES_DIR", process.env.DELIVERY_INPUT_FILES_DIR);
console.log("INPUT_FILES_NAME", process.env.DELIVERY_INPUT_FILES_NAME);
console.log(
  "OUTPUT_JSON_DESTINATION_DIR",
  process.env.DELIVERY_OUTPUT_JSON_DESTINATION_DIR
);

function writeOutputFile(jsonObj: Array<Object>) {
  const dataBuffer = Buffer.from(JSON.stringify(jsonObj));
  const destFile = `${process.env.DELIVERY_OUTPUT_JSON_DESTINATION_DIR}/${process.env.DELIVERY_OUTPUT_JSON_FILE_NAME}.json`;
  writeFile(destFile, dataBuffer, FILE_ENCODING, function (err) {
    if (err)
      return console.log(
        "sv-delivery-conditions ERROR writing output file : ",
        err
      );
    console.log("sv-delivery-conditions SUCCESS file written");
    console.log(
      "sv-delivery-conditions SUCCESS lines written in file %s : %s",
      destFile,
      jsonObj.length
    );
  });
}

function readExistingJsonData() {
  try {
    const data = readFileSync(
      `${process.env.DELIVERY_OUTPUT_JSON_DESTINATION_DIR}/${process.env.DELIVERY_OUTPUT_JSON_FILE_NAME}.json`,
      FILE_ENCODING
    );
    const jsonObj = JSON.parse(data);
    console.log("LINES READ : ", jsonObj.length);
    return jsonObj;
  } catch (error) {
    console.log("sv-delivery-conditions ERROR reading file : ", error);
    return undefined;
  }
}

async function generateArrayOfJSONfromCSV(): Promise<Array<Array<Object>>> {
  const filesNames: Array<string> =
    process.env.DELIVERY_INPUT_FILES_NAME_LIST?.split(",") || [];

  const filesToImport = filesNames.map(
    (fileName) => `${process.env.DELIVERY_INPUT_FILES_DIR}/${fileName}`
  );

  return Promise.all(
    filesToImport.map(async (file) => {
      console.log("importing file ", file);

      return csv({ delimiter: "," }).fromFile(file);
    })
  );
}

//generateArrayOfJSONfromCSV();
//readExistingJsonData();

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
  //console.log('meging objects',existingObject,newObject)
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

  var counter = -1;
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

async function initDeliveryConditions() {
  const filesDataImported = await generateArrayOfJSONfromCSV();
  console.log(
    "sv-delivery-conditions number of files to import : ",
    filesDataImported.length
  );
  let outputData = [{}];

  if (filesDataImported.length > 0) {
    console.log("sv-delivery-conditions reading file number 1");
    outputData = filesDataImported[0];
    console.log(
      "sv-delivery-conditions lines in buffer END ",
      outputData.length
    );
    filesDataImported.slice(1).forEach((fileData, index) => {
      console.log("sv-delivery-conditions reading file number ", index + 2);
      outputData = updateData(outputData, fileData);
      console.log(
        "sv-delivery-conditions lines in buffer END ",
        outputData.length
      );
    });
  }

  writeOutputFile(outputData);
}

initDeliveryConditions();
