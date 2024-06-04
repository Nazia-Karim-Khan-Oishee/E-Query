require("dotenv").config();
const app = require("./index.js");

const server = app.listen(process.env.PORT);
module.exports = server;
