import React, { Component } from 'react';

export default class HelloWorld extends Component {
    render() {
        return (
            <p>{this.props.message}</p>
        );
    }
}
