# Knock bulk user adder/remover

### 8/26/2022

Made for DSGT by [John Ramberger](https://github.com/JohnRamberger)

## How to use

This program is built using NodeJS in JavaScript

In order to run the app, you must have NodeJS and NPM setup on your machine. To test this, enter `npm --v` into a console (CMD, PowerShell, VSCode Terminal, etc.). If you get a version back such as `8.9.0` then you _should_ be good.

If you don't have NPM installed, I would just google how to install it.

### So how do I run it?

Just follow the steps below:

1. Download this repository to your local machine (either download the zip or clone the repository).
2. Open the root folder with all of the files (you should see a file named `bulkemail.js`)
3. Create a file called `.env` and enter your PRIVATE api key from Knock as `KNOCK_API_KEY`. Your file should look like this (replace `example_api_key` with your key):

```
KNOCK_API_KEY=example_api_key
```

4. Place your `.CSV` file into this folder. The name of the file does NOT matter, just make sure the CSV has a row at the top with the column labels and there exists at least a `email` and `fullname` column. Yes, the file must be in CSV format and yes, it can have more than those 2 columns.
5. Open a console (same way as before) in the folder. You'll know if it worked if it has the path to the repository in the starting line. Ex: `C:\Users\USER\Documents\GitHub\DSGT-Mailing-List-Knock>`. If you don't know how to do this, check [this](https://www.groovypost.com/howto/open-command-window-terminal-window-specific-folder-windows-mac-linux/) link out.
6. Run the command `npm install`. This will install all the dependencies that the script needs to run.
7. Run the command `npm run start`. This will start the program :D.
8. Just follow the prompts and answer according to the question. If it asks `Would you like to add or remove users? (add, remove)` respond with either `add` or `remove` and nothing else.
9. Once you see `DONE!`, the program is over and all of the users have been added/removed to Knock.

From here, you're done, but if you have another file or changed your mind and want to remove the users, simply start from `step 7` and start the app again.

If you closed the console, follow `steps 2 and 5`, but you shouldn't need to install again.
