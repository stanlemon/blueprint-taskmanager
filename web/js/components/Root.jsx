/* @flow weak */
import { omit } from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';

class Root extends React.Component {
    render() {
        return React.cloneElement(this.props.children, omit(this.props, 'children'));
    }
}

Root.propTypes = {
    children: React.PropTypes.node,
};

export default connect(state => state, dispatch => {
    return { actions: bindActionCreators(actions, dispatch) };
})(Root);

