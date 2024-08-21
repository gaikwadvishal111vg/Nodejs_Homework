const fs = require("fs").promises;
// const { readFile } = require("fs/promises");
const path = require("path");
const readline = require("readline");

const filePath = path.join(__dirname, "file.txt");
const getInput = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
};

const addTask = async () => {
  try {
    const task = await getInput("Enter a task: ");
    try {
      await fs.access(filePath);
      const fileContent = await fs.readFile(filePath, "utf-8");
      if (fileContent.trim() == "") {
        await fs.writeFile(filePath, task);
      } else {
        await fs.appendFile(filePath, "\n" + task);
      }
    } catch {
      await fs.writeFile(filePath, task);
    } finally {
      console.log("Task Added Succesfully");
    }
  } catch (err) {
    console.error(err);
  }
};

const viewFile = async () => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data.split("\n");
  } catch (err) {
    console.error(err);
  }
};

const markRead = async () => {
  try {
    const data = await viewFile();
    if (data.length == 1 && data[0].trim() == "") {
      console.log("\n No Task added yet \n");
    }
    console.log("\n your task are");
    data.map((line, idx) => {
      console.log(`${idx + 1}, ${line}`);
    });
    const idx = Number(
      await getInput("Enter the task number you want to mark as read")
    );
    if (isNaN(idx) || idx < 1 || idx > data.length) {
      console.log("Invalid task index. please Enter valid Number");
      return;
    }
    data[idx - 1] = `🪠${data[idx - 1]}🪠`;
    await fs.writeFile(filePath, data.join("\n"));
    console.log("Task Mark As A Completed");
  } catch (err) {
    console.error(err);
  }
};

const removeTask = async () => {
    try {
        const data = await viewFile();
        if (data.length == 1 && data[0].trim() == "") {
          console.log("\n No Task added yet \n");
        }
        console.log("\n your task are");
        data.map((line, idx) => {
          console.log(`${idx + 1}, ${line}`);
        });
        const idx = Number(
          await getInput("Enter the task number you want to Remove task")
        );
        if (isNaN(idx) || idx < 1 || idx > data.length) {
          console.log("Invalid task index. please Enter valid Number");
          return;
        }
        const newTask = data.filter((_, index) => index !== idx - 1)
        await fs.writeFile(filePath, newTask.join("\n"));
        console.log("Task Removed");
      } catch (err) 
      {
        console.error(err);
      }
    };
   


// Here Main Function Start

async function main() {
  while (true) {
    console.log("\n 1. Add  A New Task");
    console.log("\n 2. View A List Of Task");
    console.log("\n 3. Mark A Task As Completed");
    console.log("\n 4. Remove A Task");
    console.log("\n 5. Exit");

    const choice = await getInput("Choose An Option?");
    switch (choice) {
      case "1":
        await addTask();
        break;

      case "2":
        const data = await viewFile();
        if (data.length == 1 && data[0].trim() == "") {
          console.log("\n No Task added yet \n");
        
        };
        if (data.length > 0) {
          console.log("\n  your task are");
          data.map((line, idx) => {
            console.log(`${idx + 1}. ${line}`);
          });
        } else {
          console.log("\n No Task Available \n ");
        }
        break;

      case "3":
        await markRead();
        break;

      case "4":
        await removeTask();
        break;

      case "5":
        process.exit();
        break;

              default:
                
        break;
    }
  }
}
main();