const { Knock } = require("@knocklabs/node");

const fs = require("fs");
const { parse } = require("csv-parse");

require("dotenv").config();
const knock = new Knock(process.env.KNOCK_API_KEY)

//get users from CSV


// await knock.users.bulkIdentify([
//     {
//       id: "1",
//       name: "John Hammond",
//       email: "jhammond@ingen.net",
//     },
//     {
//       id: "2",
//       name: "Ellie Sattler",
//       email: "esattler@ingen.net",
//     },
//   ]);