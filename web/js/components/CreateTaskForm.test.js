import React from 'react';
import { mount } from 'enzyme';
import CreateTaskForm from './CreateTaskForm';
import moment from 'moment';

describe('<CreateTaskForm />', () => {
    it('should render a form with a task in it', () => {
        let lastSavedTask = null;

        const actions = {
            createTask: (task) => {
                // Store the task so that we can reference it later
                lastSavedTask = task;
            },
        };

        const task = {
            name: 'Test Task',
            description: 'A brief description',
        };

        const view = mount(
            <CreateTaskForm
                task={task}
                actions={actions}
                navigateTo={() => {}}
            />
        );

        const name = view.find('input[name="name"]');

        expect(name.props().value).toEqual(task.name);

        const description = view.find('textarea[name="description"]');

        expect(description.props().value).toEqual(task.description);

        // UpdateTaskForm has a Datetime component that sets the components state with the due date
        expect(view.state().due).toBeNull();

        const completed = view.find('input[name="completed"]');

        expect(completed.exists()).toBe(false);

        const form = view.find('form');

        form.simulate('submit');

        const expectedTask = Object.assign(
            task,
            { completed: null, due: null}
        );

        expect(lastSavedTask).toEqual(expectedTask);
    });
});
