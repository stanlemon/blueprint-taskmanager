import React from 'react';
import { mount, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RegisterView from './RegisterView';

configure({ adapter: new Adapter() });

describe('<RegisterView />', () => {
    const navigateTo = () => {};

    it('should render a register screen with empty fields', () => {
        const view = mount(<RegisterView navigateTo={navigateTo} />);

        const name = view.find('input[name="name"]');

        expect(name.props().value).toEqual('');

        const email = view.find('input[name="email"]');

        expect(email.props().value).toEqual('');

        const password = view.find('input[name="password"]');

        expect(password.props().value).toEqual('');
    });
});
