const { Knock } = require("@knocklabs/node");
require("dotenv").config();
const knock = new Knock(process.env.KNOCK_API_KEY);

const foo = async () => {
  try {
    let res = await knock.users.bulkDelete([
      "jramberger3@gatech.edu",
      "rambergerjohn@gmail.com",
    ]);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};
foo();
