const { Knock } = require("@knocklabs/node");
const prompt = require("prompt");

const fs = require("fs");
const { parse } = require("csv-parse");

require("dotenv").config();
const knock = new Knock(process.env.KNOCK_API_KEY);

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
  let emails = [];
  fs.createReadStream(file)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      if (line === 1) {
        //header row with column names
        row.forEach((col) => {
          let colName = col
            ? col.replaceAll(" ", "").toLowerCase().trim()
            : col;
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
        emails.push(row[emailIndex]);
        users.push(user);
      }
      line++;
    })
    .on("end", async function () {
      if (!emails.length) {
        console.error("No emails found in csv file");
        return;
      }
      console.log(
        "Emails found",
        emails.slice(0, 3),
        `and ${emails.length - 3} more`
      );
      console.log(
        "What Knock workflow would you like to trigger? (enter the key to the workflow)"
      );

      const { workflow_key } = await prompt
        .get({
          name: "workflow_key",
          required: true,
        })
        .catch(console.err);

      console.log(
        `are you sure you would like to trigger the workflow '${workflow_key}' for ${emails.length} people?`
      );
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
      try {
        await knock.notify(workflow_key, {
          // actor: "DSGT Knock Script",
          recipients: emails,
        });
        console.log("DONE!");
      } catch (err) {
        console.error(err);
      }
    });
};

foo();
