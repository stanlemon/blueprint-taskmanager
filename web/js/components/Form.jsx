/* @flow weak */
import { isEqual, get } from 'lodash';
import React from 'react';
import Validator from 'validator';

export default class Form extends React.Component {

    validators = {};

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

                const args = Array.isArray(validators[field][key]) ? 
                    [value, ...validators[field][key]] : [value];

                let hasError = false;

                if (key === 'notEmpty') {
                    hasError = value.match(/^[\s\t\r\n]*$/) === false;
                } else if (false === Validator[validator].apply(null, args)) {
                    hasError = true;
                }

                if (hasError) {
                    if (!errors.hasOwnProperty(field)) {
                        errors[field] = [];
                    }

                    errors[field].push(key);
                }
            }
        }

        const newState = this.props.handler(errors, this.state.fields);
        
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

                return React.cloneElement(child, {
                    valueLink: {
                        value: this.state.fields[child.props.name] || '',
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
