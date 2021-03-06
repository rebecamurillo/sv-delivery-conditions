"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getJsonArray = exports.mergeCsvFilesToJsonArray = void 0;
require("dotenv/config");
var fs_1 = require("fs");
var csv = require("csvtojson");
var DEFAULT_FILE_ENCODING = "utf8";
function writeOutputFile(options, jsonObj) {
    var dataBuffer = Buffer.from(JSON.stringify(jsonObj));
    var destFile = "".concat(options.outputDir, "/").concat(options.outputFileName, ".json");
    var encoding = options.encoding || DEFAULT_FILE_ENCODING;
    (0, fs_1.writeFile)(destFile, dataBuffer, encoding, function (err) {
        if (err)
            return console.log("multiple-csv-merge-to-json ERROR writing output file : ", err);
        console.log("multiple-csv-merge-to-json SUCCESS file written");
        console.log("multiple-csv-merge-to-json SUCCESS lines written in file %s : %s", destFile, jsonObj.length);
    });
}
function readExistingJsonDataArray(options) {
    return __awaiter(this, void 0, void 0, function () {
        var encoding, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    encoding = options.encoding || DEFAULT_FILE_ENCODING;
                    return [4 /*yield*/, (0, fs_1.readFileSync)("".concat(options.outputDir, "/").concat(options.outputFileName), encoding)];
                case 1:
                    data = _a.sent();
                    if (typeof data === "string")
                        return [2 /*return*/, JSON.parse(data)];
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log("multiple-csv-merge-to-json ERROR reading file : ", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, []];
            }
        });
    });
}
function generateArrayOfJSONfromCSV(options) {
    return __awaiter(this, void 0, void 0, function () {
        var filesNames, filesToImport;
        var _this = this;
        return __generator(this, function (_a) {
            filesNames = options.inputFileNameList;
            filesToImport = filesNames.map(function (fileName) { return "".concat(options.inputDir, "/").concat(fileName); });
            return [2 /*return*/, Promise.all(filesToImport.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log("multiple-csv-merge-to-json importing file :", file);
                        return [2 /*return*/, csv({ delimiter: options.columnDelimiter }).fromFile(file)];
                    });
                }); }))];
        });
    });
}
function objectMatchesSearchKeys(dataObject, searchObject) {
    var _a;
    var objectKeys = ((_a = process.env.DELIVERY_INPUT_FILES_UNIQUE_KEY) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
    for (var _i = 0, objectKeys_1 = objectKeys; _i < objectKeys_1.length; _i++) {
        var key = objectKeys_1[_i];
        if (new String(dataObject[key])
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") !==
            new String(searchObject[key])
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""))
            return false;
    }
    return true;
}
function mergeObjects(existingObject, newObject) {
    var updatedObject = __assign({}, existingObject);
    for (var key in newObject) {
        updatedObject[key] = new String(newObject[key])
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }
    return updatedObject;
}
function updateData(existingData, newData) {
    var updatedData = __spreadArray([], existingData, true);
    var counter = -1;
    var _loop_1 = function (data) {
        var indexFound = existingData.findIndex(function (_existingData) {
            return objectMatchesSearchKeys(_existingData, data);
        });
        if (indexFound >= 0) {
            var mergedObject = mergeObjects(existingData[indexFound], data);
            if (mergedObject.updated) {
                updatedData[indexFound] = mergedObject;
            }
            else {
                existingData[indexFound] = __assign(__assign({}, existingData[indexFound]), { updated: true });
                updatedData.push(mergedObject);
            }
        }
        else {
            updatedData.push(data);
        }
    };
    for (var _i = 0, newData_1 = newData; _i < newData_1.length; _i++) {
        var data = newData_1[_i];
        _loop_1(data);
    }
    return updatedData;
}
function mergeCsvFilesToJsonArray(options) {
    return __awaiter(this, void 0, void 0, function () {
        var filesDataImported, outputData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateArrayOfJSONfromCSV(options)];
                case 1:
                    filesDataImported = _a.sent();
                    console.log("multiple-csv-merge-to-json number of files to import : ", filesDataImported.length);
                    outputData = [{}];
                    if (filesDataImported.length > 0) {
                        console.log("multiple-csv-merge-to-json reading file at index 0");
                        outputData = filesDataImported[0];
                        console.log("multiple-csv-merge-to-json lines in buffer END ", outputData.length);
                        filesDataImported.slice(1).forEach(function (fileData, index) {
                            console.log("multiple-csv-merge-to-json reading file at index %s", index + 1);
                            outputData = updateData(outputData, fileData);
                            console.log("multiple-csv-merge-to-json lines in buffer END ", outputData.length);
                        });
                    }
                    writeOutputFile(options, outputData);
                    return [2 /*return*/];
            }
        });
    });
}
exports.mergeCsvFilesToJsonArray = mergeCsvFilesToJsonArray;
function getJsonArray(options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, readExistingJsonDataArray(options)];
        });
    });
}
exports.getJsonArray = getJsonArray;
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
    columnDelimiter: ","
});
