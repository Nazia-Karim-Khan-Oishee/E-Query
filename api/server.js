require("dotenv").config();
const app = require("./index.js");

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
module.exports = server;
