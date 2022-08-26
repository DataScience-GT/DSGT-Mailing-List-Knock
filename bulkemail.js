const { Knock } = require("@knocklabs/node");
const prompt = require("prompt");

const fs = require("fs");
const { parse } = require("csv-parse");

require("dotenv").config();
const knock = new Knock(process.env.KNOCK_API_KEY);

const MAX_USERS_PER_REQUEST = 100;

prompt.start();

const foo = async () => {
  //get users from CSV
  let files = fs.readdirSync(`./`);
  let file = files.find((x) => x.toLowerCase().includes(".csv"));
  if (!file) {
    console.error("Missing CSV file in root directory.");
    return;
  }
  let line = 1;

  let fullnameIndex = -1;
  let emailIndex = -1;
  let users = [];
  fs.createReadStream(file)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      if (line === 1) {
        //header row with column names
        row.forEach((col) => {
          let colName = col.replaceAll(" ", "").toLowerCase().trim();
          let index = row.indexOf(col);
          switch (colName) {
            case "fullname":
              fullnameIndex = index;
              break;
            case "email":
              emailIndex = index;
          }
        });
      } else if (emailIndex >= 0 && fullnameIndex >= 0) {
        //add email and name to user list
        let user = {
          id: row[emailIndex],
          name: row[fullnameIndex],
          email: row[emailIndex],
        };
        users.push(user);
      }
      line++;
    })
    .on("end", async function () {
      if (!users.length) {
        console.error(
          "No users found! make sure the columns 'fullname' and 'email' exist on your .CSV file"
        );
        return;
      }
      //send 5 users to show examples
      console.log("Found users, here's a look at some:");
      console.log(users.slice(0, 5));

      //prompt for continuing
      console.log("Send emails to Knock (irreversible)? (y/n)");
      let goodYes = ["yes", "y"];
      let goodNo = ["no", "n"];
      const { confirm } = await prompt
        .get({
          name: "confirm",
          required: true,
          conform: (val) => {
            if (
              goodYes.includes(val.toLowerCase()) ||
              goodNo.includes(val.toLowerCase())
            ) {
              return true;
            }
            return false;
          },
        })
        .catch(console.err);
      if (goodNo.includes(confirm.toLowerCase())) {
        console.log("Ok, goodbye.");
        return;
      }

      //map the users in sets of 100
      let sets = [];
      while (users.length > 0) {
        sets.push(users.splice(0, MAX_USERS_PER_REQUEST));
      }

      sets.forEach(async (set) => {
        //for each set of 100, attempt to send to knock

        // add the users through the api
        // let res = await knock.users.bulkIdentify(users);
        try {
          let res = await knock.users.bulkIdentify(set);
          console.log(res);
          //   console.log(res);
        } catch (err) {
          console.error(err);
        }
      });
    });
};

foo();

// const x = async () => {
//   try {
//     let res = await knock.users.bulkIdentify([
//       {
//         id: "rambergerjohn@gmail.com",
//         name: "John Ramberger",
//         email: "rambergerjohn@gmail.com",
//       },
//     ]);
//     console.log(res);
//   } catch (err) {
//     console.error(err);
//   }
// };
// x();
