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

  writeFile(
    `${process.env.DELIVERY_OUTPUT_JSON_DESTINATION_DIR}/${process.env.DELIVERY_OUTPUT_JSON_FILE_NAME}.json`,
    dataBuffer,
    FILE_ENCODING,
    function (err) {
      if (err)
        return console.log(
          "sv-delivery-confitions ERROR writing output file : ",
          err
        );
      console.log("sv-delivery-confitions SUCCESS file written");
      console.log("LINES WRITTEN : ", jsonObj.length);
    }
  );
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
    console.log("sv-delivery-confitions ERROR reading file : ", error);
    throw error;
  }
}

async function generateArrayOfJSONfromCSV(): Promise<Array<Object>> {
  const filesNames: Array<string> =
    process.env.DELIVERY_INPUT_FILES_NAME_LIST?.split(",") || [];

  const filesToImport = filesNames.map(
    (fileName) => `${process.env.DELIVERY_INPUT_FILES_DIR}/${fileName}`
  );

  return Promise.all(
    filesToImport.map(async (file) => {
      console.log("importing file ", file);
      const jsonObj: Array<Object> = await csv({ delimiter: "," }).fromFile(
        file
      );
      // .then((_jsonObj: any) => {
      //   jsonObj = _jsonObj;
      //   console.log('_jsonObj',_jsonObj.length);
      //   return _jsonObj;
      // });
      console.log("jsonObj", jsonObj.length);

      return csv({ delimiter: "," }).fromFile(file);
    })
  );
}

//generateArrayOfJSONfromCSV();
//readExistingJsonData();

async function updateDeliveryConditions() {
  const filesData = await generateArrayOfJSONfromCSV();
  console.log("filesData", filesData.length);
  //console.log("filesData", filesData[0].length);
  writeOutputFile(filesData);
}

updateDeliveryConditions();
