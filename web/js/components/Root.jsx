import { omit } from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';

class Root extends React.Component {

    static propTypes = {
        children: React.PropTypes.node,
    };

    render() {
        return React.cloneElement(this.props.children, omit(this.props, 'children'));
    }
}

export default connect(state => state, dispatch => {
    return { actions: bindActionCreators(actions, dispatch) };
})(Root);

