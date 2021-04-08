const log4js_config = require("./log4js.json");
const log4js = require('log4js').configure(log4js_config);



module.exports = log4js;