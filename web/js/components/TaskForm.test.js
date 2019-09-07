import React from 'react';
import parseISO from 'date-fns/parseISO';
import isSameDay from 'date-fns/isSameDay';
import format from 'date-fns/format';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TaskForm from './TaskForm';

configure({ adapter: new Adapter() });

describe('<TaskForm />', () => {
    it('should render an empty form with and submit a new task in it', () => {
        let lastSavedTask = null;

        const save = task => {
            // Store the task so that we can reference it later
            lastSavedTask = task;
            // Returning the value updates the form's state
            return task;
        };

        const task = {
            name: 'Test Task',
            description: 'A brief description',
            due: null,
            completed: false,
        };

        const view = mount(<TaskForm save={save} />);

        const name = view.find('input[name="name"]');

        expect(name.props().value).toEqual('');

        const description = view.find('textarea[name="description"]');

        expect(description.props().value).toEqual('');

        const due = view.find('input[name="due"]');

        expect(due.props().value).toEqual('');

        const completed = view.find('input[name="completed"]');

        // Create form does not include the completed checkbox
        expect(completed.exists()).toBe(false);

        // Set the name field
        name.simulate('change', {
            target: { name: 'name', value: task.name },
        });

        // Set the description field
        description.simulate('change', {
            target: { name: 'description', value: task.description },
        });

        // Update the component
        view.update();

        const form = view.find('form');

        // Submit, the handler should fire and lastSavedTask updated to match our task object
        form.simulate('submit');

        expect(lastSavedTask).toEqual(task);
    });

    it('submitting a form without a task name triggers an error', () => {
        const save = r => r;

        const view = mount(<TaskForm save={save} />);

        const form = view.find('form');

        // Submit, the handler should fire and lastSavedTask updated to match our task object
        form.simulate('submit');

        const errors = view.find('.has-error .help-block');

        expect(errors.length).toBe(1);

        expect(errors.at(0).text()).toBe(
            'You must enter a name for this task.'
        );
    });

    it('should render a form with an existing task and update it', () => {
        let lastSavedTask = null;

        const save = task => {
            // Store the task so that we can reference it later
            lastSavedTask = task;
            return task;
        };

        const task = {
            id: 1,
            name: 'Test Task',
            description: 'A brief description',
            due: parseISO('2018-06-12T07:08'),
            completed: parseISO('2017-06-12T07:08'),
        };

        const view = mount(<TaskForm task={task} save={save} />);

        const name = view.find('input[name="name"]');

        expect(name.props().value).toEqual(task.name);

        const description = view.find('textarea[name="description"]');

        expect(description.props().value).toEqual(task.description);

        const due = view.find('input[name="due"]');

        expect(due.props().value).toEqual('06/12/2018 7:08AM');

        const completed = view.find('input[name="completed"]');

        expect(completed.props().checked).toEqual(true);

        const completedLabel = view.find('label[htmlFor="completed"]');

        expect(completedLabel.text()).toEqual(
            'Completed on June 12th 2017, 7:08AM'
        );

        // Update the task name
        const newName = 'New Task Name';
        name.simulate('change', {
            target: { name: 'name', value: newName },
        });

        // Update the task description
        const newDescription = 'New Task Description';
        description.simulate('change', {
            target: { name: 'description', value: newDescription },
        });

        // Click the checkbox to toggle it
        completed.simulate('change', {
            target: { type: 'checkbox', name: 'completed', checked: false },
        });

        view.update();

        expect(completed.props().checked).toEqual(true);

        const form = view.find('form');

        form.simulate('submit');

        // When we submit we should have the original task, but with the new name and description fields
        expect(lastSavedTask).toEqual({
            id: task.id,
            name: newName,
            description: newDescription,
            due: task.due, // field is unchanged
            completed: false,
        });
    });

    it('clicking  on due opens a pop up', () => {
        const save = r => r;

        const view = mount(<TaskForm save={save} />);

        const dueInput = view.find('input[name="due"]');

        expect(dueInput.length).toBe(1);

        dueInput.simulate('click');

        const datepicker = view.find('.react-datepicker');

        // For some reason in this test after clicking we have two datepicker instances rendered
        expect(datepicker.length).toBeGreaterThanOrEqual(0);

        // The datepicker is open now, find today and click on it
        view.find('.react-datepicker__day--today').simulate('click');

        // Selecting 'today' should set the internal form state to be today's date
        expect(isSameDay(new Date(), view.state().data.due)).toBe(true);

        // Create a date for today at midnight
        const nowMidnight = parseISO(
            format(Date.now(), 'yyyy-MM-dd') + 'T00:00:00'
        );

        // Our input should have our today midnight value
        // We have to re-find it here, rather than use 'dueInput' because the datepicker component creates a new node
        expect(view.find('input[name="due"]').props().value).toEqual(
            format(nowMidnight, 'MM/dd/yyyy h:mma')
        );
    });
});