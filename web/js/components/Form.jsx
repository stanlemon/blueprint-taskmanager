/* @flow weak */
import { get, has, isEqual, isBoolean, isObject, zipObject, fill, range, merge } from 'lodash';
import React from 'react';
import Validator from 'validator';

export default class Form extends React.Component {

    validators = {};

    fields = [];

    handleSubmit(e) {
        e.preventDefault();

        let errors = {};
        let validators = {};

        Object.assign(validators, this.validators, this.props.validate);

        for (let field in validators) {
            for (let key in validators[field]) {
                let validator;
                // Magically prepend is for most validators
                if (key !== 'notEmpty' && key !== 'contains' && key !== 'equals' && key !== 'matches' && key.slice(0,2) !== 'is') {
                    validator = 'is' + key.charAt(0).toUpperCase() + key.slice(1);
                } else {
                    validator = key;
                }

                if (key !== 'notEmpty' && !Validator.hasOwnProperty(validator)) {
                    console.warn('Validator does not have ' + validator);
                }

                const value = get(this.state.fields, field, '');


                let args = [value];

                if (Array.isArray(validators[field][key])) {
                    args = [value, ...validators[field][key]];
                } else if (isObject(validators[field][key]) && has(validators[field][key], 'args')) {
                    args = validators[field][key].args
                }

                let hasError = false;

                if (key === 'notEmpty') {
                    hasError = !!value.match(/^[\s\t\r\n]*$/);
                } else if (false === Validator[validator].apply(null, args)) {
                    hasError = true;
                }

                if (hasError) {
                    if (!errors.hasOwnProperty(field)) {
                        errors[field] = [];
                    }

                    const message = isObject(validators[field][key]) && has(validators[field][key], 'msg')
                        ? validators[field][key].msg : key

                    errors[field].push(message);
                }
            }
        }

        // This ensure we always send every field property, though for those that
        // have not had a change trigger we simply send an empty string
        const newState = this.props.handler(errors, Object.assign(
            zipObject(this.fields, fill(range(this.fields.length), '')),
            this.state.fields
        ));

        if (newState instanceof Object) {
            this.setState({ fields: newState});
        }
    }

    handleChange(field, value) {
        this.setState({
            fields: Object.assign(this.state.fields, { [field]: value })
        });
    }

    componentWillMount() {
        this.setState({
            fields: get(this.props, 'fields', {})
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.fields, nextProps.fields) && nextProps.errors.length === 0) {
            this.setState({ fields: nextProps.fields });
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)} {...this.props}>
                {this.processChildren(this.props.children)}
            </form>
        );
    }

    processChildren(children) {
        return React.Children.map(children, (child, i) => {
            if (child instanceof Object && (child.type === 'input' || child.type === 'textarea' || child.type === 'select')) {
                if (child.props.validate) {
                    this.validators[child.props.name] = child.props.validate;
                }

                this.fields.push(child.props.name);

                const value = get(this.state.fields, child.props.name, '');

                return React.cloneElement(child, {
                    [child.type === 'input' && child.props.type === 'checkbox' ? 'checkedLink' : 'valueLink']: {
                        value: value,
                        requestChange: this.handleChange.bind(this, child.props.name)
                    }
                });
            } else if (child instanceof Object && child.props.children instanceof Object && React.Children.count(child) > 0) {
                return React.cloneElement(child, {}, this.processChildren(child.props.children));
            } else {
                return child;
            }
        });
    }
}
