import React from 'react';
import { mount, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TaskListView from './TaskListView';
import TaskItem from './TaskItem';

configure({ adapter: new Adapter() });

describe('<TaskListView />', () => {
    const navigateTo = () => {};

    it('should render a spinner while it waits to load', () => {
        const view = mount(
            <TaskListView
                loaded={[]}
                tasks={[]}
                navigateTo={navigateTo}
                actions={{}}
            />
        );

        const i = view.find('i');

        expect(i.hasClass('fa-refresh')).toBe(true);
        expect(i.hasClass('fa-spin')).toBe(true);
    });

    it('should render a list of tasks', () => {
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
                navigateTo={navigateTo}
                actions={{}}
            />
        );

        // List of tasks contains our first task
        expect(
            view.contains(
                <TaskItem
                    navigateTo={navigateTo}
                    actions={{}}
                    task={tasks[0]}
                />
            )
        ).toBe(true);
        // List of tasks contains our second task
        expect(
            view.contains(
                <TaskItem
                    navigateTo={navigateTo}
                    actions={{}}
                    task={tasks[1]}
                />
            )
        ).toBe(true);
    });
});
