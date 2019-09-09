const fs = require('fs');
const puppeteer = require('puppeteer');
const waitForExpect = require('wait-for-expect');

const databaseFile = 'test-database-' + new Date().getTime() + '.sqlite';

process.env.PORT = '19292';
process.env.DATABASE_URL = 'sqlite://' + databaseFile;

const { server, db } = require('./app.js');

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

test('end to end', async done => {
    db.sequelize.sync({ force: true });

    waitForExpect(() => {
        expect(server.listening).toEqual(true);
    });

    const username = 'stanlemon@users.noreply.github.com';
    const password = 'p@$$w0rd!';

    const browser = await puppeteer.launch({
        //headless: false,
        //devtools: true,
        args: ['--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();

    await page.goto('http://localhost:' + process.env.PORT);

    await page.waitForSelector('.login-form');

    const createAccountButton = await page.$('#register-button');

    createAccountButton.click();

    await page.waitForSelector('.register-form');

    const nameInput1 = await await page.$('input[name="name"]');
    await nameInput1.type('Stan Lemon');

    const emailInput1 = await page.$('input[name=email]');
    await emailInput1.type(username);

    const passwordInput1 = await page.$('input[name=password]');
    await passwordInput1.type(password);

    const submitButton1 = await page.$('button[type=submit]');
    await submitButton1.click();

    await page.waitForSelector('.task-create-form');

    const logoutButton = await page.$('#logout');
    await logoutButton.click();

    await page.waitForSelector('.login-form');

    const loginUsernameInput = await page.$('input[name=username]');
    await loginUsernameInput.type(username);

    const loginPasswordInput = await page.$('input[name=password]');
    await loginPasswordInput.type(password);

    const loginSubmitButton = await page.$('button[type=submit]');
    await loginSubmitButton.click();

    await page.waitForSelector('.task-create-form');

    const taskNameInput1 = await page.$('input[name="name"]');
    await taskNameInput1.focus();
    await taskNameInput1.type('First task name');

    const saveButton1 = await page.$('button[name=saveTask]');
    await saveButton1.click();

    const taskRow1 = await page.waitForSelector('.task-row');
    await waitForTextInSelector(page, '.task-row', 'First task name');

    await taskRow1.click();

    await page.waitForSelector('.task-update-form');

    const taskNameInput2 = await page.$('input[name="name"]');
    await taskNameInput2.focus();
    await taskNameInput2.type('First task name, now updated');

    const saveButton2 = await page.$('button[name=saveTask]');
    await saveButton2.click();

    const taskRow2 = await page.waitForSelector('.task-row');
    await waitForTextInSelector(
        page,
        '.task-row',
        'First task name, now updated'
    );

    const completeCheckbox1 = await page.$('.complete-task');
    await completeCheckbox1.click();

    await page.waitForSelector('.task-row.task-completed');

    const deleteTaskButton = await page.$('.delete-task');
    await deleteTaskButton.click();

    await page.waitForSelector('.jumbotron h1');

    // Make sure the jumbotron has our text
    await waitForTextInSelector(
        page,
        '.jumbotron h1',
        "You don't have any tasks!"
    );

    await browser.close();

    fs.unlinkSync('./' + databaseFile);

    server.kill(() => {
        console.log('Killing server');

        // Take a brief pause before calling it quits
        setTimeout(() => {
            done();
        }, 1000);
    });
}, 60000);
