import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Error from './Error';

configure({ adapter: new Adapter() });

describe('<Error />', () => {
    it('should render the error message', () => {
        const wrapper = shallow(<Error message="An error occurred!" />);
        expect(wrapper.contains('An error occurred!')).toBe(true);
    });
});
