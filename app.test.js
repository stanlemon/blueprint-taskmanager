const fs = require('fs');
const puppeteer = require('puppeteer');
const waitForExpect = require('wait-for-expect');

const databaseFile = 'test-database-' + new Date().getTime() + '.sqlite';

process.env.PORT = '19292';
process.env.DATABASE_URL = 'sqlite://' + databaseFile;

const { server, db } = require('./app.js');

test('end to end', async done => {
    db.sequelize.sync({ force: true });

    waitForExpect(() => {
        expect(server.listening).toEqual(true);
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();

    await page.goto('http://localhost:' + process.env.PORT);

    const createAccountButton = await page.$('#register-button');

    createAccountButton.click();

    const nameInput = await page.waitForSelector('input[name="name"]');
    await nameInput.type('Stan Lemon');

    const emailInput = await page.$('input[name=email]');
    await emailInput.type('stanlemon@users.noreply.github.com');

    const passwordInput = await page.$('input[name=password]');
    await passwordInput.type('p@$$w0rd!');

    const submitButton = await page.$('button[type=submit]');
    await submitButton.click();

    await page.waitForSelector('.jumbotron');

    const taskNameInput = await page.$('input[name="name"]');
    await taskNameInput.focus();
    await taskNameInput.type('First task name');

    const saveButton = await page.$('button[name=saveTask]');
    await saveButton.click();

    const taskRow = await page.waitForSelector('.task-row');
    expect(taskRow).toMatch('First task name');

    await taskRow.click();

    // Unnecessary pause
    await new Promise(resolve => setTimeout(resolve, 10000));

    await browser.close();

    fs.unlinkSync('./' + databaseFile);

    server.kill(() => {
        console.log('Killing server');

        // Take a brief pause before calling it quits
        setTimeout(() => {
            done();
        }, 2000);
    });
}, 30000);
