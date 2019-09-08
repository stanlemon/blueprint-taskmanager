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

    await page.waitForSelector('.login-form');

    const createAccountButton = await page.$('#register-button');

    createAccountButton.click();

    await page.waitForSelector('.register-form');

    const nameInput1 = await await page.$('input[name="name"]');
    await nameInput1.type('Stan Lemon');

    const emailInput1 = await page.$('input[name=email]');
    await emailInput1.type('stanlemon@users.noreply.github.com');

    const passwordInput1 = await page.$('input[name=password]');
    await passwordInput1.type('p@$$w0rd!');

    const submitButton1 = await page.$('button[type=submit]');
    await submitButton1.click();

    await page.waitForSelector('.task-create-form');

    const taskNameInput1 = await page.$('input[name="name"]');
    await taskNameInput1.focus();
    await taskNameInput1.type('First task name');

    const saveButton1 = await page.$('button[name=saveTask]');
    await saveButton1.click();

    const taskRow1 = await page.waitForSelector('.task-row');
    expect(taskRow1).toMatch('First task name');

    await taskRow1.click();

    await page.waitForSelector('.task-update-form');

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
