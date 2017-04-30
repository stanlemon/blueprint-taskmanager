import { spy } from 'sinon';
import React from 'react';
import { mount } from 'enzyme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import TaskListView from '../../../web/js/components/TaskListView.jsx';
import MockRouter from '../mocks/MockRouter';

injectTapEventPlugin();

momentLocalizer(moment);

describe('<TaskListView />', () => {

    it('should render a spinner while it waits to load', () => {
        const view = mount(<TaskListView loaded={[]} tasks={[]} router={new MockRouter()} actions={{}} />);

        const i = view.find('i');

        expect(i.hasClass('fa-refresh')).toBe(true);
        expect(i.hasClass('fa-spin')).toBe(true);
    });

    it('should render a list of tasks', () => {
        const router = new MockRouter();

        const tasks = [
            {
                id: 1,
                name: 'First Task',
                description: 'This is a task',
                due: false,
                completed: false,
            },
            {
                id: 2,
                name: 'Second Task',
                description: 'This is another task',
                due: false,
                completed: false,
            },
        ];

        spy(TaskListView.prototype, 'render');

        const view = mount(<TaskListView loaded={['tasks']} tasks={tasks} errors={{}} router={router} actions={{}} />);

        expect(TaskListView.prototype.render.calledOnce).toBe(true);

        expect(view.text().indexOf(tasks[0].name)).toBeGreaterThan(-1);
        expect(view.text().indexOf(tasks[1].name)).toBeGreaterThan(-1);

        view.find('.task-name').first().simulate('click');

        expect(router.routes[0]).toBe('/view/2');
    });
});
