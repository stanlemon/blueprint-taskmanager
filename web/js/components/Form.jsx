/* @flow weak */
import { isEqual } from 'lodash';
import classNames from 'classnames';
import React from 'react';

export default class Form extends React.Component {

    static defaultProps = {
        fields: {},
        errors: [],
        handler: (state) => {
            console.log(state);
        }
    };

    static propTypes = {
        fields: React.PropTypes.object,
        errors: React.PropTypes.array,
        handler: React.PropTypes.func
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            fields: props.fields,
            errors: []
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.handler(this.state.fields);
    }

    handleChange(e) {
        this.setState({
            fields: Object.assign(this.state.fields, { [e.target.name]: e.target.value })
        });
    }

    /*
    componentWillReceiveProps(nextProps) {
        // If the next properties are not equal and we don't have errors
        // If we have errors we don't want to lose our state
        if (!isEqual(this.props, nextProps) && nextProps.errors.length === 0) {
            this.setState(nextProps);
        }
    }
    */

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)} {...this.props}>
                {this.processChildren(this.props.children)}
            </form>
        );
    }

    processChildren(children, x = 0) {
        return React.Children.map(children, (child, i) => {
            if (child instanceof Object && (child.type === 'input' || child.type === 'textarea' || child.type === 'select')) {
                return React.cloneElement(child, Object.assign({}, {
                    value: this.state.fields[child.props.name],
                    onChange: this.handleChange.bind(this)
                }));
            } else if (child instanceof Object && child.props.children instanceof Object && React.Children.count(child) > 0) {
                return React.cloneElement(child, {}, this.processChildren(child.props.children, x + ": " + i));
            } else {
                return child;
            }
        });
    }
}
