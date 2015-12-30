'use strict';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import { makeDateTime } from '../../js/lib/Utils';
import React from 'react';
import TaskItem from '../../js/components/TaskItem';

describe('<TaskItem />', () => {
    it('should render the task name', () => {
        const task = {
            id: 1,
            name: 'Foobar',
            completed: null
        };
        const wrapper = shallow(<TaskItem task={task} />);
        expect(wrapper.contains('<span>' + task.name + '</span>')).to.be.true;
    });

    it('should render the task name striked through for completion', () => {
        const task = {
            id: 1,
            name: 'Foobar',
            completed: makeDateTime()
        };
        const wrapper = shallow(<TaskItem task={task} />);
        expect(wrapper.contains('<s>' + task.name + '</s>')).to.be.true;
    });
});
