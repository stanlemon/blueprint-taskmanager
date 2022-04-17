/**
 * @jest-environment puppeteer
 */
import "expect-puppeteer";

import waitForExpect from "wait-for-expect";

process.env.PORT = "19292";

// Make sure the jumbotron has our text
async function waitForTextInSelector(page, selector, text) {
  await waitForExpect(async () => {
    const results = await page.$$eval(selector, (nodes) =>
      nodes.map((node) => node.textContent)
    );
    //console.log(text, results, results.includes(text));
    expect(results.includes(text)).toBe(true);
  });
}

describe("end to end", () => {
  it("creates an account and tasks", async () => {
    await page.goto("http://localhost:" + process.env.PORT);

    const username = "stanlemon@users.noreply.github.com";
    const password = "p@$$w0rd!";

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

    await page.waitForSelector("#task-create-form");

    console.log("Click button to logout");
    // Triggers the menu to fan out first
    await page.click(".navbar-burger");
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

    await page.waitForSelector("#task-create-form");

    console.log("Create new task 1");
    const taskNameInput1 = await page.$('input[name="name"]');
    await taskNameInput1.focus();
    await taskNameInput1.type("First task name");

    const saveButton1 = await page.$("#save-task");
    await saveButton1.click();

    await page.waitForSelector(".task-name");
    await waitForTextInSelector(page, ".task-name", "First task name");

    console.log("Create new task 2");
    const taskNameInput2 = await page.$('input[name="name"]');
    await taskNameInput2.focus();
    await taskNameInput2.type("Second task name");

    const saveButton2 = await page.$("#save-task");
    await saveButton2.click();

    await page.waitForSelector(".task-name");
    await waitForTextInSelector(page, ".task-name", "Second task name");

    console.log("Click task 1 to go to edit page");
    await (
      await page.waitForSelector(".task-row:nth-child(1) .task-name")
    ).click();
    // Check for our input having the correct task name
    expect(
      await page.$eval('input[name="name"]', (node) => node.value)
    ).toEqual("First task name");
    // Clicking cancel will return to the task list
    await (await page.$("#cancel-task")).click();
    // Verify we are back on the main page
    await page.waitForSelector("#task-create-form");

    console.log("Click task 2 to go to edit page");
    await (
      await page.waitForSelector(".task-row:nth-child(2) .task-name")
    ).click();

    const secondTaskInputValue = await page.$eval(
      'input[name="name"]',
      (node) => {
        console.log(node.value);
        return node.value;
      }
    );

    expect(secondTaskInputValue).toEqual("Second task name");
    // Clicking cancel will return to the task list
    await (await page.$("#cancel-task")).click();

    await page.waitForSelector("#task-create-form");

    // Go back to the first task so that we can edit the page
    console.log("Click task 1 to go back to the edit page");
    await (
      await page.waitForSelector(".task-row:nth-child(1) .task-name")
    ).click();

    await page.waitForSelector(".task-update-form");

    console.log("Update task name");
    const taskNameInput1Update = await page.$('input[name="name"]');
    await taskNameInput1Update.focus();
    await taskNameInput1Update.type(", now updated"); // Appends onto the existing value of the text field

    console.log("Click button to save task");
    const saveButton1Update = await page.$("#save-task");
    await saveButton1Update.click();

    await page.waitForSelector(".task-name");
    await waitForTextInSelector(
      page,
      ".task-name",
      "First task name, now updated"
    );

    console.log("Click checkbox on task to mark it complete");
    const completeCheckbox1 = await page.$(".complete-task");
    await completeCheckbox1.click();

    await page.waitForSelector(".task-row.task-completed");

    let total = (await page.$$(".task-row")).length;

    // Delete every row we've created
    while (total > 0) {
      console.log("Click button to delete task");
      const deleteTaskButton = await page.$(".delete-task");
      await deleteTaskButton.click();

      console.log("Click button to confirm delete task");
      const confirmDeleteTaskButton = await page.$(".modal .is-danger");
      await confirmDeleteTaskButton.click();

      total--;

      await waitForExpect(async () => {
        const x = (await page.$$(".task-row")).length;
        expect(x).toBe(total);
      });
    }

    console.log("Verify there are no tasks");
    // Make sure the jumbotron has our text
    await waitForTextInSelector(page, "h1", "You don't have any tasks!");

    console.log("All done!");
  }, 10000);
});
