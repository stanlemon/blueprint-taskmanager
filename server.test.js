// BEFORE RUNNING THIS TEST
// Ensure that the app's assets have been built. This is an end to end test
// that will start a full server in a production-like mode.

const puppeteer = require("puppeteer");
const { waitFor } = require("@testing-library/react");
process.env.PORT = "19292";

const { server } = require("./server.js");

// Make sure the jumbotron has our text
async function waitForTextInSelector(page, selector, text) {
  return page.waitForFunction(
    'document.querySelector("' +
      selector +
      '").innerText.includes("' +
      text +
      '")'
  );
}

test("end to end", async (done) => {
  await waitFor(() => {
    expect(server.listening).toEqual(true);
  });

  const username = "stanlemon@users.noreply.github.com";
  const password = "p@$$w0rd!";

  const browser = await puppeteer.launch({
    // Must be wide enough so that the logout button is visible.
    defaultViewport: { width: 1024, height: 600 },
    //headless: false,
    //devtools: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });
  const page = await browser.newPage();

  const response = await page.goto("http://localhost:" + process.env.PORT);
  const text = await response.text();
  // For debugging...
  console.log("Page contents: ", text);

  await page.waitForSelector(".login-form");

  console.log("Click create account button");
  const createAccountButton = await page.$("#create-account-button");

  createAccountButton.click();

  await page.waitForSelector("#register-form");

  console.log("Fill out register account form");
  const nameInput1 = await await page.$('input[name="name"]');
  await nameInput1.type("Stan Lemon");

  const emailInput1 = await page.$("input[name=email]");
  await emailInput1.type(username);

  const passwordInput1 = await page.$("input[name=password]");
  await passwordInput1.type(password);

  const repeatPasswordInput1 = await page.$("input[name=repeat_password]");
  await repeatPasswordInput1.type(password);

  console.log("Submit register account form");
  const submitButton1 = await page.$("#register-button");
  await submitButton1.click();

  await page.waitForSelector(".task-create-form");

  console.log("Click button to logout");
  // Triggers the user menu to fan out first
  await page.click("#user-menu");
  // Click the now visible logout button
  const logoutButton = await page.waitForSelector("#logout");
  await logoutButton.click();

  await page.waitForSelector(".login-form");

  console.log("Enter username and password");
  const loginUsernameInput = await page.$("input[name=username]");
  await loginUsernameInput.type(username);

  const loginPasswordInput = await page.$("input[name=password]");
  await loginPasswordInput.type(password);

  console.log("Click button to login");
  const loginSubmitButton = await page.$("#login-button");
  await loginSubmitButton.click();

  await page.waitForSelector(".task-create-form");

  console.log("Create a new task");
  const taskNameInput1 = await page.$('input[name="name"]');
  await taskNameInput1.focus();
  await taskNameInput1.type("First task name");

  const saveButton1 = await page.$("#save-task");
  await saveButton1.click();

  const taskRow1 = await page.waitForSelector(".task-row");
  await waitForTextInSelector(page, ".task-row", "First task name");

  console.log("Click on task to go to edit page");
  await taskRow1.click();

  await page.waitForSelector(".task-update-form");

  console.log("Update task name");
  const taskNameInput2 = await page.$('input[name="name"]');
  await taskNameInput2.focus();
  await taskNameInput2.type("First task name, now updated");

  console.log("Click button to save task");
  const saveButton2 = await page.$("#save-task");
  await saveButton2.click();

  await page.waitForSelector(".task-row");
  await waitForTextInSelector(
    page,
    ".task-row",
    "First task name, now updated"
  );

  console.log("Click checkbox on task to mark it complete");
  const completeCheckbox1 = await page.$(".complete-task");
  await completeCheckbox1.click();

  await page.waitForSelector(".task-row.task-completed");

  console.log("Click button to delete task");
  const deleteTaskButton = await page.$(".delete-task");
  await deleteTaskButton.click();

  console.log("Click button to confirm delete task");
  const confirmDeleteTaskButton = await page.$(".modal .is-danger");
  await confirmDeleteTaskButton.click();

  console.log("Verify there are no tasks");
  // Make sure the jumbotron has our text
  await waitForTextInSelector(page, "h1", "You don't have any tasks!");

  console.log("Close the browser");
  await browser.close();

  console.log("Kill server");
  server.kill(() => {
    console.log("Killing server");

    // Take a brief pause before calling it quits
    setTimeout(() => {
      done();
    }, 1000);
  });
}, 60000);
