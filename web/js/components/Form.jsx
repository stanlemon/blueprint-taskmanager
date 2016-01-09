/* @flow weak */
import React from 'react';

export default class Form extends React.Component {

    static defaultProps = {
        fields: {},
        handler: (state) => {}
    };

    static propTypes = {
        fields: React.PropTypes.object,
        handler: React.PropTypes.func
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            fields: props.fields
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        const newState = this.props.handler(this.state.fields);
        
        if (newState instanceof Object) {
            this.setState({ fields: newState});
        }
    }

    handleChange(e) {
        this.setState({
            fields: Object.assign(this.state.fields, { [e.target.name]: e.target.value })
        });
    }

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
