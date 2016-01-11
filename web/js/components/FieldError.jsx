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

        const message = errors.filter(e => e.field == field).slice(0,1)[0];

        return message ? this.props.children.slice(0,1)[0] : null;
    }
}
