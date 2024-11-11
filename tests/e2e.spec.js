import { test, expect } from "@playwright/test";
import waitForExpect from "wait-for-expect";

process.env.PORT = "19292";

async function getTextInSelector(page, selector) {
  return await page.locator(selector).allTextContents();
}

async function waitForTextInSelector(page, selector, text) {
  await waitForExpect(async () => {
    const results = await getTextInSelector(page, selector);
    expect(results.includes(text)).toBe(true);
  });
}

// eslint-disable-next-line max-lines-per-function
test("end to end", async ({ page }) => {
  await page.goto("http://localhost:" + process.env.PORT);

  const username = "stanlemon@users.noreply.github.com";
  const password = "p@$$w0rd!";

  await page.waitForSelector("input[name=username]");

  console.log("Click create account button");
  await page.locator("#create-account-button").click();

  await page.waitForSelector("#register-form");

  console.log("Fill out register account form");
  await page.locator('input[name="name"]').type("Stan Lemon");
  await page.locator("input[name=email]").type(username);
  await page.locator("input[name=password]").type(password);
  await page.locator("input[name=repeat_password]").type(password);

  console.log("Submit register account form");
  await page.locator("#register-button").click();

  await page.waitForSelector("#task-create-form");

  console.log("Click button to logout");
  await page.locator("#settings").click();
  await page.locator("#logout").click();

  await page.waitForSelector("input[name=username]");

  console.log("Enter username and password");
  await page.locator("input[name=username]").type(username);
  await page.locator("input[name=password]").type(password);

  console.log("Click button to login");
  await page.locator("#login-button").click();

  await page.waitForSelector("#task-create-form");

  console.log("Create new task 1");
  await page.locator('input[name="name"]').type("First task name");
  await page.locator("#save-task").click();

  await waitForTextInSelector(page, "div", "First task name");

  console.log("Create new task 2");
  await page.locator('input[name="name"]').type("Second task name");
  await page.locator("#save-task").click();

  await waitForTextInSelector(page, "div", "Second task name");

  console.log("Click task 1 to go to edit page");
  await page.locator(".task-row:nth-child(1) .task-name").click();

  expect(await page.locator('input[name="name"]').inputValue()).toBe(
    "First task name"
  );

  await page.locator("#cancel-task").click();
  await page.waitForSelector("#task-create-form");

  console.log("Click task 2 to go to edit page");
  await page.locator(".task-row:nth-child(2) .task-name").click();
  const secondTaskInputValue = await page
    .locator('input[name="name"]')
    .inputValue();
  expect(secondTaskInputValue).toBe("Second task name");

  await page.locator("#cancel-task").click();
  await page.waitForSelector("#task-create-form");

  console.log("Click task 1 to go back to the edit page");
  await page.locator(".task-row:nth-child(1) .task-name").click();

  console.log("Update task name");
  const taskNameInput = page.locator('input[name="name"]');
  await taskNameInput.fill("First task name, now updated");
  await page.locator("#save-task").click();

  await waitForTextInSelector(
    page,
    ".task-name",
    "First task name, now updated"
  );

  console.log("Click checkbox on task to mark it complete");
  await page
    .locator(
      ".task-row:has-text('First task name, now updated') input[type='checkbox']"
    )
    .click(); // Use click here because of React

  expect(
    page.locator(
      ".task-row:has-text('First task name, now updated') input[type='checkbox']"
    )
  ).toBeChecked();

  console.log("Delete all tasks");
  let total = await page.locator(".task-row").count();

  while (total > 0) {
    await page.locator(".task-delete").first().click();
    await page.locator(".task-delete-confirm").click();
    total--;
    await waitForExpect(async () => {
      const count = await page.locator(".task-row").count();
      expect(count).toBe(total);
    });
  }

  console.log("Verify there are no tasks");
  await waitForTextInSelector(page, "h1", "You don't have any tasks!");

  console.log("All done!");
});
