import { spy } from 'sinon';
import React from 'react';
import { mount, shallow } from 'enzyme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TaskListView from '../../../web/js/components/TaskListView';
import TaskItem from '../../../web/js/components/TaskItem';
import MockRouter from '../mocks/MockRouter';

injectTapEventPlugin();

describe('<TaskListView />', () => {
    it('should render a spinner while it waits to load', () => {
        const view = mount(
            <TaskListView
                loaded={[]}
                tasks={[]}
                router={new MockRouter()}
                actions={{}}
            />
        );

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

        const view = shallow(
            <TaskListView
                loaded={['tasks']}
                tasks={tasks}
                errors={{}}
                router={router}
                actions={{}}
            />
        );

        // List of tasks contains our first task
        expect(view.contains(<TaskItem router={router} actions={{}} task={tasks[0]} />)).toBe(true);
        // List of tasks contains our second task
        expect(view.contains(<TaskItem router={router} actions={{}} task={tasks[1]} />)).toBe(true);
    });
});
