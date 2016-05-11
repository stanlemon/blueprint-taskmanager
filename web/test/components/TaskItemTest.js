'use strict';

import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import { makeDateTime } from '../../js/lib/Utils';
import React from 'react';
import TaskItem from '../../js/components/TaskItem';

chai.use(chaiEnzyme());

describe('<TaskItem />', () => {
    it('should render the task name', () => {
        const task = {
            id: 1,
            name: 'Foobar',
            completed: null
        };
        const wrapper = shallow(<TaskItem task={task} />);
        expect(wrapper.text()).to.contain(task.name);
    });

    it('should render the task with a checked checkbox', () => {
        const task = {
            id: 1,
            name: 'Foobar',
            completed: makeDateTime()
        };
        const wrapper = shallow(<TaskItem task={task} />);

        expect(wrapper.find('input')).to.be.checked();
    });
});
