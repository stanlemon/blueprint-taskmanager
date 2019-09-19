const snakeCase = require("lodash/snakeCase");
const camelCase = require("lodash/camelCase");
const mapKeys = require("lodash/mapKeys");
const isObject = require("lodash/isObject");

function convertCamelCase(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  return mapKeys(obj, (value, key) => {
    return camelCase(key);
  });
}

function convertSnakeCase(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  return mapKeys(obj, (value, key) => {
    return snakeCase(key);
  });
}

module.exports = { convertCamelCase, convertSnakeCase };
