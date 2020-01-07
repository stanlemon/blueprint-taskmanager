const format = require("date-fns/format");

const SQL_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";

function makeDateString(d = new Date()) {
  return format(d, SQL_DATE_FORMAT);
}

module.exports = { SQL_DATE_FORMAT, makeDateString };
