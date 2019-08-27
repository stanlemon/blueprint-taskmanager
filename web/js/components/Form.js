import includes from 'lodash/includes';
import get from 'lodash/get';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import zipObject from 'lodash/zipObject';
import fill from 'lodash/fill';
import range from 'lodash/range';
import React from 'react';
import PropTypes from 'prop-types';
import Validator from 'validator';

export default class Form extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        fields: PropTypes.object,
        validate: PropTypes.object,
        handler: PropTypes.func,
        errors: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    };

    static defaultProps = {
        fields: {},
        errors: {},
        validate: {},
        handler: () => {},
    };

    validators = {};
    fields = [];
    state = {
        fields: [],
    };

    handleSubmit = e => {
        e.preventDefault();

        const errors = {};
        const validators = {};

        Object.assign(validators, this.validators, this.props.validate);

        Object.keys(validators).forEach(field => {
            Object.keys(validators[field]).forEach(key => {
                let validator;
                // Magically prepend is for most validators
                if (
                    key !== 'notEmpty' &&
                    key !== 'contains' &&
                    key !== 'equals' &&
                    key !== 'matches' &&
                    key.slice(0, 2) !== 'is'
                ) {
                    validator = `is${key.charAt(0).toUpperCase()}${key.slice(
                        1
                    )}`;
                } else {
                    validator = key;
                }

                if (
                    key !== 'notEmpty' &&
                    !Object.prototype.hasOwnProperty.call(Validator, validator)
                ) {
                    throw new Error(`Validator does not have ${validator}`);
                }

                const value = get(this.state.fields, field, '');

                let args = [value];

                if (Array.isArray(validators[field][key])) {
                    args = [value, ...validators[field][key]];
                } else if (
                    isObject(validators[field][key]) &&
                    has(validators[field][key], 'args')
                ) {
                    args = [value, ...validators[field][key].args];
                }

                let hasError = false;

                if (key === 'notEmpty') {
                    hasError = !!value.match(/^[\s\t\r\n]*$/);
                } else if (Validator[validator].apply(null, args) === false) {
                    hasError = true;
                }

                if (hasError) {
                    if (!Object.prototype.hasOwnProperty.call(errors, field)) {
                        errors[field] = [];
                    }

                    const message =
                        isObject(validators[field][key]) &&
                        has(validators[field][key], 'msg')
                            ? validators[field][key].msg
                            : key;

                    errors[field].push(message);
                }
            });
        });

        // This ensure we always send every field property, though for those that
        // have not had a change trigger we simply send an empty string
        const newState = this.props.handler(
            errors,
            Object.assign(
                zipObject(this.fields, fill(range(this.fields.length), '')),
                this.state.fields
            )
        );

        if (newState instanceof Object) {
            this.setState({ fields: newState });
        }
    };

    handleChange(field, event) {
        const value =
            event.target.type === 'checkbox'
                ? event.target.checked
                : event.target.value;
        this.setState({
            fields: Object.assign(this.state.fields, { [field]: value }),
        });
    }

    componentDidMount() {
        this.setState({
            fields: get(this.props, 'fields', {}),
        });
    }

    componentDidUpdate(prevProps) {
        if (
            !isEqual(this.props.fields, prevProps.fields) &&
            this.props.errors.length === 0
        ) {
            this.setState({ fields: this.props.fields });
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {this.processChildren(this.props.children)}
            </form>
        );
    }

    processChildren(children) {
        return React.Children.map(children, child => {
            if (
                child instanceof Object &&
                includes(['input', 'textarea', 'select'], child.type)
            ) {
                if (child.props.validate) {
                    this.validators[child.props.name] = child.props.validate;
                }

                this.fields.push(child.props.name);

                const value = get(this.state.fields, child.props.name, '');

                return React.cloneElement(child, {
                    [child.props.type === 'checkbox'
                        ? 'checked'
                        : 'value']: value,
                    onChange: this.handleChange.bind(this, child.props.name),
                });
            } else if (
                child instanceof Object &&
                React.Children.count(child) > 0
            ) {
                return React.cloneElement(
                    child,
                    {},
                    this.processChildren(child.props.children)
                );
            }
            return child;
        });
    }
}
