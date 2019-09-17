const snakeCase = require("lodash/snakeCase");
const camelCase = require("lodash/camelCase");
const mapKeys = require("lodash/mapKeys");

function convertCamelCase(obj) {
  return mapKeys(obj, (value, key) => {
    return camelCase(key);
  });
}

function convertSnakeCase(obj) {
  return mapKeys(obj, (value, key) => {
    return snakeCase(key);
  });
}

module.exports = { convertCamelCase, convertSnakeCase };
