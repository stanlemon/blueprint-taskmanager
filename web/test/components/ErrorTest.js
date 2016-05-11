'use strict';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Error from '../../js/components/Error';

describe('<Error />', () => {
    it('should render the error message', () => {
        const wrapper = shallow(<Error message="An error occurred!" />);
        expect(wrapper.contains('An error occurred!')).to.equal(true);
    });
});
