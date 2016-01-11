/* @flow weak */
import { has } from 'lodash';
import React from 'react';

export default class FieldError extends React.Component {

    static defaultProps = {
        errors: [],
        field: false
    };

    render() {
        const { errors, field } = this.props;

        const message = errors.reduce((prev, curr) => {
            return !prev && curr.field == field ? curr : false;
        }, false);

        return message ? this.props.children.slice(0,1)[0] : null;
    }
}
