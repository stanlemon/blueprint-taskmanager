import { shallow } from 'enzyme';
import { makeDateTime } from '../../js/lib/Utils';
import React from 'react';
import TaskItem from '../../../web/js/components/TaskItem.jsx';
import MockRouter from '../mocks/MockRouter';

describe('<TaskItem />', () => {
    it('should render the task name', () => {
        const task = {
            id: 1,
            name: 'Foobar',
            completed: null,
        };
        const wrapper = shallow(
            <TaskItem task={task} router={new MockRouter()} actions={{}} />
        );
        expect(wrapper.contains(task.name)).toBe(true);
    });

    it('should render the task with a checked checkbox', () => {
        const task = {
            id: 1,
            name: 'Foobar',
            completed: makeDateTime(),
        };
        const wrapper = shallow(
            <TaskItem task={task} router={new MockRouter()} actions={{}} />
        );

        expect(wrapper.find('input').is('[checked=true]')).toBe(true);
    });
});
