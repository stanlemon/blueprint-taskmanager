'use strict';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Error from '../../js/components/Error';

describe('<Error />', () => {
    it('should render a single div', () => {
        const wrapper = shallow(<Error message="An error occurred!" />);
        expect(wrapper.contains('<div/>')).to.be.true;
    });
});
