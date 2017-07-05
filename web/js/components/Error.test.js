import { shallow } from 'enzyme';
import React from 'react';
import Error from './Error';

describe('<Error />', () => {
    it('should render the error message', () => {
        const wrapper = shallow(<Error message="An error occurred!" />);
        expect(wrapper.contains('An error occurred!')).toBe(true);
    });
});
