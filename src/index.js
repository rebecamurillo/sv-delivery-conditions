"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("dotenv/config");
var fs_1 = require("fs");
var csv = require("csvtojson");
var FILE_ENCODING = "utf8";
console.log("process", process.env.NODE_ENV);
console.log("INPUT_FILES_DIR", process.env.DELIVERY_INPUT_FILES_DIR);
console.log("INPUT_FILES_NAME", process.env.DELIVERY_INPUT_FILES_NAME);
console.log("OUTPUT_JSON_DESTINATION_DIR", process.env.DELIVERY_OUTPUT_JSON_DESTINATION_DIR);
function writeOutputFile(jsonObj) {
    var dataBuffer = Buffer.from(JSON.stringify(jsonObj));
    (0, fs_1.writeFile)("".concat(process.env.DELIVERY_OUTPUT_JSON_DESTINATION_DIR, "/").concat(process.env.DELIVERY_OUTPUT_JSON_FILE_NAME, ".json"), dataBuffer, FILE_ENCODING, function (err) {
        if (err)
            return console.log("sv-delivery-confitions ERROR writing output file : ", err);
        console.log("sv-delivery-confitions SUCCESS file written");
        console.log("LINES WRITTEN : ", jsonObj.length);
    });
}
function readExistingJsonData() {
    try {
        var data = (0, fs_1.readFileSync)("".concat(process.env.DELIVERY_OUTPUT_JSON_DESTINATION_DIR, "/").concat(process.env.DELIVERY_OUTPUT_JSON_FILE_NAME, ".json"), FILE_ENCODING);
        var jsonObj = JSON.parse(data);
        console.log("LINES READ : ", jsonObj.length);
        return jsonObj;
    }
    catch (error) {
        console.log("sv-delivery-confitions ERROR reading file : ", error);
        throw error;
    }
}
function generateArrayOfJSONfromCSV() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var filesNames, filesToImport;
        var _this = this;
        return __generator(this, function (_b) {
            filesNames = ((_a = process.env.DELIVERY_INPUT_FILES_NAME_LIST) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
            filesToImport = filesNames.map(function (fileName) { return "".concat(process.env.DELIVERY_INPUT_FILES_DIR, "/").concat(fileName); });
            return [2 /*return*/, Promise.all(filesToImport.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                    var jsonObj;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("importing file ", file);
                                return [4 /*yield*/, csv({ delimiter: "," }).fromFile(file)];
                            case 1:
                                jsonObj = _a.sent();
                                // .then((_jsonObj: any) => {
                                //   jsonObj = _jsonObj;
                                //   console.log('_jsonObj',_jsonObj.length);
                                //   return _jsonObj;
                                // });
                                console.log("jsonObj", jsonObj.length);
                                return [2 /*return*/, csv({ delimiter: "," }).fromFile(file)];
                        }
                    });
                }); }))];
        });
    });
}
//generateArrayOfJSONfromCSV();
//readExistingJsonData();
function updateDeliveryConditions() {
    return __awaiter(this, void 0, void 0, function () {
        var filesData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateArrayOfJSONfromCSV()];
                case 1:
                    filesData = _a.sent();
                    console.log("filesData", filesData.length);
                    //console.log("filesData", filesData[0].length);
                    writeOutputFile(filesData);
                    return [2 /*return*/];
            }
        });
    });
}
updateDeliveryConditions();
