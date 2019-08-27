import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import UpdateTaskForm from './UpdateTaskForm';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

configure({ adapter: new Adapter() });

describe('<UpdateTaskForm />', () => {
    it('should render a form with a task in it', () => {
        let lastSavedTask = null;

        const actions = {
            updateTask: task => {
                // Store the task so that we can reference it later
                lastSavedTask = task;
            },
        };

        const task = {
            id: 1,
            name: 'Test Task',
            description: 'A brief description',
            due: parseISO('2018-06-12T07:08'),
            completed: parseISO('2017-06-12T07:08'),
        };

        const navigateTo = () => {};

        const view = mount(
            <UpdateTaskForm
                task={task}
                actions={actions}
                navigateTo={navigateTo}
            />
        );

        const name = view.find('input[name="name"]');

        expect(name.props().value).toEqual(task.name);

        const description = view.find('textarea[name="description"]');

        expect(description.props().value).toEqual(task.description);

        // UpdateTaskForm has a Datetime component that sets the components state with the due date
        expect(view.state().due).toEqual(task.due);

        const completed = view.find('input[name="completed"]');

        expect(completed.props().checked).toEqual(task.completed);

        const form = view.find('form');

        form.simulate('submit');

        expect(lastSavedTask).toEqual(task);
    });
});
