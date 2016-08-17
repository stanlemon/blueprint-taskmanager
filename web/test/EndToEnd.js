import fs from 'fs';
import { mount } from 'enzyme';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

jest.useRealTimers();
jasmine.getEnv().defaultTimeoutInterval = 5000;

describe('EndToEnd', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = 3131;
    process.env.DATABASE_URL = 'sqlite://test.sqlite';

    const sqliteDb = __dirname + '/../../test.sqlite'; 

    // Cleanup any strays
    if (fs.existsSync(sqliteDb)) {
        fs.unlinkSync(sqliteDb);
    }

    // Will start the nodejs application
    const { server, db } = require('../../app');

    // Make sure the server is running
    beforeEach((done) => {
        while (!server.listening) {}
        done();
    });

    // Make sure our db schema has been loaded
    beforeEach((done) => {
        db.sequelize.sync({ force: true }).then(() => {
            done();
        });
    });

    afterEach(() => {
        // Shutdown the http server
        server.close();
        // Cleanup our database
        fs.unlinkSync(sqliteDb);
    });

    // TODO Allow setting of bearer token in service, alter URL and this test might work OK 
    describe('Working', () => {
        it('Works', (done) => {
            const app = require('../js/App').default;

            const view = mount(app());

            // Something is happening here that I need to wait for
            setTimeout(() => {
                // Find the register button and click it
                view.find('button.btn-link').first().simulate('click');

                view.find('#name').first().simulate('change', { target: { value: 'Foo Bar' } });
                view.find('#email').first().simulate('change', { target: { value: 'test@test.com' } });
                view.find('#password').first().simulate('change', { target: { value: 'password' } });

                view.find('form').first().simulate('submit');

                setTimeout(() => {
                    db.models.User.findOne({ where: { email: 'test@test.com' } }).then(user => {
                        expect(user.email).toBe('test@test.com');
                        done();
                    }).catch(error => {
                        console.error(error);
                    });
                }, 100);
            }, 100);
        });
    });
});

